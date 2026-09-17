// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FeeRouter — PING's on-chain fee-routing vault contract.
/// @notice This is the on-chain piece of the "launch a coin for a creator,
/// split every trade fee automatically" concept, targeting Robinhood Chain
/// (an Ethereum L2 built on the Arbitrum Orbit stack — see
/// https://docs.robinhood.com/chain/connecting). It deliberately does ONE
/// job — hold and split fees for a creator vault — rather than
/// reimplementing a full bonding-curve or AMM pool. A trading venue (e.g. a
/// Uniswap v4 pool a launchpad deploys the creator's fixed-supply ERC-20
/// into, or a relayer forwarding collected trade fees) is expected to call
/// `depositFee` with each collected fee; this contract then splits it three
/// ways in a single transaction and lets the verified creator withdraw
/// their share whenever they like.
///
/// Known limitations — read before deploying with real funds:
///
/// 1. `verifyCreator` trusts a single `admin` address (whoever called
///    `initializeVault`) to have checked the bio-code verification
///    off-chain. That is a centralization point and a single point of
///    failure. Before mainnet, replace it with either a multisig admin
///    (e.g. Safe) or an on-chain/oracle-backed proof.
/// 2. There is no bonding-curve, DEX, or Uniswap v4 pool integration here —
///    `depositFee` is the interface a trading venue calls, but wiring an
///    actual venue to call it on every trade is separate work.
/// 3. This contract has not been audited. Do not point it at Robinhood
///    Chain mainnet with real user funds until it has been.
/// 4. Reentrancy protection here is a small hand-rolled guard rather than
///    OpenZeppelin's audited `ReentrancyGuard`, to keep this file
///    dependency-free and easy to compile anywhere. Swap in OpenZeppelin's
///    version (and `Ownable`, `Pausable`, etc.) before a real deployment.
contract FeeRouter {
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant MAX_HANDLE_LEN = 32;

    struct CreatorVault {
        address admin;
        address creatorWallet;
        bool verified;
        bool exists;
        string handle;
        uint16 creatorBps;
        uint16 platformBps;
        uint16 buybackBps;
        address payable platformWallet;
        address payable buybackWallet;
        uint256 creatorBalance; // claimable now
        uint256 totalEarned; // lifetime creator earnings (claimed + unclaimed)
        uint256 totalClaimed; // lifetime amount the creator has withdrawn
    }

    /// @dev vaultId = keccak256(bytes(handle)) — the EVM equivalent of the
    /// Anchor program's `seeds = [b"vault", handle.as_bytes()]` PDA. Kept
    /// private (rather than `public`) because Solidity's auto-generated
    /// getter for a mapping of a many-field struct hits "stack too deep"
    /// under the legacy code generator — `vaultFor` below is the intended
    /// read path and returns the same data.
    mapping(bytes32 => CreatorVault) private vaults;

    uint256 private _locked = 1; // hand-rolled reentrancy guard, see contract-level docs

    event VaultInitialized(bytes32 indexed vaultId, string handle, address admin);
    event CreatorVerified(bytes32 indexed vaultId, address creatorWallet);
    event FeeDeposited(
        bytes32 indexed vaultId,
        uint256 creatorAmount,
        uint256 platformAmount,
        uint256 buybackAmount
    );
    event Claimed(bytes32 indexed vaultId, address creatorWallet, uint256 amount);

    error HandleTooLong();
    error HandleEmpty();
    error InvalidSplit();
    error VaultAlreadyExists();
    error VaultNotFound();
    error InvalidCreatorWallet();
    error CreatorNotVerified();
    error ZeroAmount();
    error NothingToClaim();
    error Unauthorized();
    error TransferFailed();
    error Reentrancy();

    modifier nonReentrant() {
        if (_locked != 1) revert Reentrancy();
        _locked = 2;
        _;
        _locked = 1;
    }

    /// @notice Creates a fee-routing vault for a creator handle. Callable by
    /// anyone acting as the vault's admin (in PING's launch flow, this is
    /// whoever clicked "Launch a coin" — see app/launch).
    function initializeVault(
        string calldata handle,
        uint16 creatorBps,
        uint16 platformBps,
        uint16 buybackBps,
        address payable platformWallet,
        address payable buybackWallet
    ) external returns (bytes32 vaultId) {
        bytes memory handleBytes = bytes(handle);
        if (handleBytes.length == 0) revert HandleEmpty();
        if (handleBytes.length > MAX_HANDLE_LEN) revert HandleTooLong();
        if (uint256(creatorBps) + uint256(platformBps) + uint256(buybackBps) != BPS_DENOMINATOR) {
            revert InvalidSplit();
        }

        vaultId = keccak256(handleBytes);
        if (vaults[vaultId].exists) revert VaultAlreadyExists();

        vaults[vaultId] = CreatorVault({
            admin: msg.sender,
            creatorWallet: address(0),
            verified: false,
            exists: true,
            handle: handle,
            creatorBps: creatorBps,
            platformBps: platformBps,
            buybackBps: buybackBps,
            platformWallet: platformWallet,
            buybackWallet: buybackWallet,
            creatorBalance: 0,
            totalEarned: 0,
            totalClaimed: 0
        });

        emit VaultInitialized(vaultId, handle, msg.sender);
    }

    /// @notice Marks a vault as verified and sets the creator's payout
    /// wallet. Must be called by the same admin address that initialized
    /// the vault. See the contract-level docs: this is the trust
    /// assumption that should be replaced by a multisig or stronger proof
    /// before real launch.
    function verifyCreator(string calldata handle, address creatorWallet) external {
        bytes32 vaultId = keccak256(bytes(handle));
        CreatorVault storage vault = vaults[vaultId];
        if (!vault.exists) revert VaultNotFound();
        if (msg.sender != vault.admin) revert Unauthorized();
        if (creatorWallet == address(0)) revert InvalidCreatorWallet();

        vault.creatorWallet = creatorWallet;
        vault.verified = true;

        emit CreatorVerified(vaultId, creatorWallet);
    }

    /// @notice Splits an incoming fee three ways in a single transaction:
    /// the creator's share is credited to the vault (claimable any time),
    /// the platform and buyback shares are forwarded immediately. Call this
    /// from whatever collects trade fees for this creator's coin, sending
    /// the fee amount as `msg.value`.
    function depositFee(string calldata handle) external payable nonReentrant {
        if (msg.value == 0) revert ZeroAmount();

        bytes32 vaultId = keccak256(bytes(handle));
        CreatorVault storage vault = vaults[vaultId];
        if (!vault.exists) revert VaultNotFound();
        if (!vault.verified) revert CreatorNotVerified();

        uint256 creatorAmount = (msg.value * vault.creatorBps) / BPS_DENOMINATOR;
        uint256 platformAmount = (msg.value * vault.platformBps) / BPS_DENOMINATOR;
        // Remainder (rounding dust) goes to the buyback pool so the three
        // shares always sum to exactly msg.value.
        uint256 buybackAmount = msg.value - creatorAmount - platformAmount;

        vault.creatorBalance += creatorAmount;
        vault.totalEarned += creatorAmount;

        if (platformAmount > 0) {
            (bool okPlatform, ) = vault.platformWallet.call{value: platformAmount}("");
            if (!okPlatform) revert TransferFailed();
        }
        if (buybackAmount > 0) {
            (bool okBuyback, ) = vault.buybackWallet.call{value: buybackAmount}("");
            if (!okBuyback) revert TransferFailed();
        }

        emit FeeDeposited(vaultId, creatorAmount, platformAmount, buybackAmount);
    }

    /// @notice Lets the verified creator withdraw everything currently
    /// credited to their vault. No admin involvement.
    function claim(string calldata handle) external nonReentrant {
        bytes32 vaultId = keccak256(bytes(handle));
        CreatorVault storage vault = vaults[vaultId];
        if (!vault.exists) revert VaultNotFound();
        if (msg.sender != vault.creatorWallet) revert Unauthorized();

        uint256 claimable = vault.creatorBalance;
        if (claimable == 0) revert NothingToClaim();

        // Effects before interaction.
        vault.creatorBalance = 0;
        vault.totalClaimed += claimable;

        (bool ok, ) = payable(msg.sender).call{value: claimable}("");
        if (!ok) revert TransferFailed();

        emit Claimed(vaultId, msg.sender, claimable);
    }

    /// @notice Read-only helper mirroring what the app's ClaimPanel needs,
    /// since Solidity's auto-generated getter for a mapping-of-structs
    /// already exposes every field except the dynamic `handle` string
    /// cleanly — this just makes the intent explicit.
    function vaultFor(string calldata handle) external view returns (CreatorVault memory) {
        return vaults[keccak256(bytes(handle))];
    }
}

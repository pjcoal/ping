import { expect } from "chai";
import { ethers } from "hardhat";
import type { FeeRouter } from "../typechain-types";

// Reference test suite — mirrors the behavior FeeRouter.sol is meant to
// have. Like the contract itself, this has NOT been run in the sandbox
// this was written in (no `npx hardhat compile` / typechain output
// available there — see README.md). Run `npm install && npx hardhat test`
// in `contracts/` on your own machine before trusting it.
describe("FeeRouter", () => {
  const HANDLE = "nova-plays";
  const CREATOR_BPS = 8800;
  const PLATFORM_BPS = 700;
  const BUYBACK_BPS = 500;

  async function deployAndInit() {
    const [admin, creator, platformWallet, buybackWallet, payer, stranger] =
      await ethers.getSigners();

    const FeeRouterFactory = await ethers.getContractFactory("FeeRouter");
    const router = (await FeeRouterFactory.deploy()) as unknown as FeeRouter;
    await router.waitForDeployment();

    await router
      .connect(admin)
      .initializeVault(
        HANDLE,
        CREATOR_BPS,
        PLATFORM_BPS,
        BUYBACK_BPS,
        platformWallet.address,
        buybackWallet.address
      );

    return { router, admin, creator, platformWallet, buybackWallet, payer, stranger };
  }

  it("splits a deposited fee 88/7/5 and credits the creator's claimable balance", async () => {
    const { router, admin, creator, platformWallet, buybackWallet, payer } =
      await deployAndInit();

    await router.connect(admin).verifyCreator(HANDLE, creator.address);

    const feeAmount = ethers.parseEther("1.0");
    const platformBefore = await ethers.provider.getBalance(platformWallet.address);
    const buybackBefore = await ethers.provider.getBalance(buybackWallet.address);

    await expect(router.connect(payer).depositFee(HANDLE, { value: feeAmount }))
      .to.emit(router, "FeeDeposited")
      .withArgs(
        ethers.keccak256(ethers.toUtf8Bytes(HANDLE)),
        (feeAmount * BigInt(CREATOR_BPS)) / 10_000n,
        (feeAmount * BigInt(PLATFORM_BPS)) / 10_000n,
        feeAmount -
          (feeAmount * BigInt(CREATOR_BPS)) / 10_000n -
          (feeAmount * BigInt(PLATFORM_BPS)) / 10_000n
      );

    expect(await ethers.provider.getBalance(platformWallet.address)).to.equal(
      platformBefore + (feeAmount * BigInt(PLATFORM_BPS)) / 10_000n
    );
    expect(await ethers.provider.getBalance(buybackWallet.address)).to.be.gt(buybackBefore);

    const vault = await router.vaultFor(HANDLE);
    expect(vault.creatorBalance).to.equal((feeAmount * BigInt(CREATOR_BPS)) / 10_000n);
  });

  it("rejects depositFee before the creator has verified", async () => {
    const { router, payer } = await deployAndInit();
    await expect(
      router.connect(payer).depositFee(HANDLE, { value: ethers.parseEther("1") })
    ).to.be.revertedWithCustomError(router, "CreatorNotVerified");
  });

  it("lets only the verified creator wallet claim, and only once per deposit", async () => {
    const { router, admin, creator, payer, stranger } = await deployAndInit();
    await router.connect(admin).verifyCreator(HANDLE, creator.address);
    await router.connect(payer).depositFee(HANDLE, { value: ethers.parseEther("1") });

    await expect(router.connect(stranger).claim(HANDLE)).to.be.revertedWithCustomError(
      router,
      "Unauthorized"
    );

    await expect(router.connect(creator).claim(HANDLE)).to.emit(router, "Claimed");
    await expect(router.connect(creator).claim(HANDLE)).to.be.revertedWithCustomError(
      router,
      "NothingToClaim"
    );
  });

  it("rejects a fee split that doesn't sum to 10,000 bps", async () => {
    const [admin, , platformWallet, buybackWallet] = await ethers.getSigners();
    const FeeRouterFactory = await ethers.getContractFactory("FeeRouter");
    const router = (await FeeRouterFactory.deploy()) as unknown as FeeRouter;
    await router.waitForDeployment();

    await expect(
      router
        .connect(admin)
        .initializeVault("bad-split", 9000, 700, 500, platformWallet.address, buybackWallet.address)
    ).to.be.revertedWithCustomError(router, "InvalidSplit");
  });
});

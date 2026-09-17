// Sample data only. PING has not launched yet, so there is no real
// trading activity, no real creators, and no real balances to show. This
// file exists purely so the UI has something realistic to render in the
// preview — swap it for real indexer/API data before going live. Every
// place this is used in the UI is labeled "sample data" for the same
// reason. Figures are in ETH (Robinhood Chain's gas + settlement token),
// scaled to be plausible for an early-stage launchpad rather than copied
// over from an earlier SOL-denominated draft.

export type Creator = {
  handle: string;
  displayName: string;
  avatarColor: string;
  platform: (typeof import("./constants").SOCIAL_PLATFORMS)[number];
  ticker: string;
  marketCapEth: number;
  holders: number;
  earnedEth: number;
  availableEth: number;
  sentEth: number;
  verified: boolean;
  bio: string;
};

export const SAMPLE_CREATORS: Creator[] = [
  {
    handle: "nova-plays",
    displayName: "Nova Plays",
    avatarColor: "#FF6B4A",
    platform: "Twitch",
    ticker: "NOVA",
    marketCapEth: 86.4,
    holders: 1284,
    earnedEth: 4.92,
    availableEth: 0.82,
    sentEth: 4.1,
    verified: true,
    bio: "Variety streamer, 40k followers. Verified via bio code on Twitch.",
  },
  {
    handle: "chef-marin",
    displayName: "Chef Marin",
    avatarColor: "#2DD4BF",
    platform: "YouTube",
    ticker: "MARIN",
    marketCapEth: 192.6,
    holders: 3021,
    earnedEth: 14.35,
    availableEth: 1.9,
    sentEth: 12.45,
    verified: true,
    bio: "Cooking channel, 2.1M subscribers. Verified via bio code on YouTube.",
  },
  {
    handle: "lo-fi-luca",
    displayName: "Lo-fi Luca",
    avatarColor: "#FFB84A",
    platform: "X",
    ticker: "LUCA",
    marketCapEth: 15.8,
    holders: 402,
    earnedEth: 0.66,
    availableEth: 0.66,
    sentEth: 0,
    verified: false,
    bio: "Producer sharing beats daily. Verification pending.",
  },
  {
    handle: "quinn-codes",
    displayName: "Quinn Codes",
    avatarColor: "#8B7CF6",
    platform: "TikTok",
    ticker: "QUINN",
    marketCapEth: 53.2,
    holders: 890,
    earnedEth: 2.68,
    availableEth: 0.43,
    sentEth: 2.25,
    verified: true,
    bio: "Builds tiny apps live. Verified via bio code on TikTok.",
  },
];

export type ActivityEvent = {
  id: string;
  type: "trade" | "payout" | "launch";
  creatorHandle: string;
  amountEth: number;
  timeAgo: string;
};

export const SAMPLE_ACTIVITY: ActivityEvent[] = [
  { id: "a1", type: "trade", creatorHandle: "chef-marin", amountEth: 0.3, timeAgo: "just now" },
  { id: "a2", type: "payout", creatorHandle: "nova-plays", amountEth: 0.82, timeAgo: "2m ago" },
  { id: "a3", type: "trade", creatorHandle: "quinn-codes", amountEth: 0.1, timeAgo: "5m ago" },
  { id: "a4", type: "launch", creatorHandle: "lo-fi-luca", amountEth: 0, timeAgo: "12m ago" },
  { id: "a5", type: "trade", creatorHandle: "nova-plays", amountEth: 0.15, timeAgo: "18m ago" },
  { id: "a6", type: "payout", creatorHandle: "chef-marin", amountEth: 1.9, timeAgo: "34m ago" },
];

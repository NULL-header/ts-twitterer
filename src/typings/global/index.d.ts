/* eslint-disable camelcase */
type Media =
  | {
      mediaUrl: string[];
      type: "photo";
    }
  | {
      mediaUrl: string;
      type: "animated_gif" | "video";
    };

type Tweet = {
  uniqid: number;
  user: {
    name: string;
    twitterId: string;
    iconUrl: string;
    bannerUrl: string;
    profile: string;
    description: string;
  };
  createdAt: string;
  dataid: string;
  content: string;
  listId: string;
} & (
  | {
      isRetweeted: false;
      retweeterName: undefined;
    }
  | {
      isRetweeted: true;
      retweeterName: string;
    }
) &
  ({ hasMedia: true; media: Media } | { hasMedia: false; media: undefined });

type TweetColumns = {
  tweet: Tweet;
};

interface Limit {
  limitRate: number;
  remaining: number;
}

type LimitData = Record<"lists", Limit>;

type Configs = {
  oldestUniqIdMap: Map<string, number>;
  newestUniqIdMap: Map<string, number>;
  newestTweetDataIdMap: Map<string, string>;
  currentList: string | undefined;
  limitData: LimitData | undefined;
  listIds: string[];
  isAuthorized: boolean;
};

interface ConfigColumns {
  id: 0;
  last_data: Configs & { tweets: Tweet[] };
}

declare module "comlink-loader?singleton=true!../worker/connect" {
  type Origin = typeof import("frontend/worker/connect");
  const origin: Origin;
  export = origin;
}

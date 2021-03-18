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
  currentList: string | undefined;
  limitData: LimitData | undefined;
  listIds: string[];
  isAuthorized: boolean;
};

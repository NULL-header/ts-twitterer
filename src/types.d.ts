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

type MediaColumns =
  | {
      media_url: string[];
      type: "photo";
    }
  | {
      media_url: string;
      type: "animated_gif" | "video";
    };

type Tweet = {
  id: number;
  dataid: string;
  username: string;
  userid: string;
  iconUrl: string;
  content: string;
  createdAt: string;
  media?: Media;
  listId: string;
} & (
  | {
      isRetweeted: false;
    }
  | {
      isRetweeted: true;
      retweeterName: string;
    }
);

type TweetColumns = {
  id: number;
  dataid: string;
  username: string;
  userid: string;
  icon_url: string;
  content: string;
  created_at: string;
  media?: MediaColumns;
  list_id: string;
} & (
  | {
      is_retweeted: false;
    }
  | {
      is_retweeted: true;
      retweeter_name: string;
    }
);

interface Configs {
  lastTweetIdGroup: Record<string, number>;
  newestTweetDataIdGroup: Record<string, string>;
  listIds: string[];
  currentList: string;
}

interface ConfigColumns {
  id: 0;
  last_tweet_id_group: Record<string, number>;
  newest_tweet_data_id_group: Record<string, string>;
  list_ids: string[];
  current_list: string;
}

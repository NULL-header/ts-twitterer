/* eslint-disable camelcase */
interface Media {
  mediaUrl: string;
  type: string;
  sizes: any;
}

interface MediaColumns {
  media_url: string;
  type: string;
  sizes: any;
}

interface Tweet {
  id: number;
  dataid: string;
  username: string;
  userid: string;
  iconUrl: string;
  content: string;
  createdAt: string;
  media?: Media[];
  listId: string;
}

interface TweetColumns {
  id: number;
  dataid: string;
  username: string;
  userid: string;
  icon_url: string;
  content: string;
  created_at: string;
  media?: MediaColumns[];
  list_id: string;
}

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

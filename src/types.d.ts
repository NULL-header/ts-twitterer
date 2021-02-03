/* eslint-disable camelcase */
interface Tweet {
  id: number;
  dataid: number;
  username: string;
  userid: string;
  iconUrl: string;
  content: string;
  createdAt: string;
}
interface TweetColumns {
  id: number;
  dataid: number;
  username: string;
  userid: string;
  icon_url: string;
  content: string;
  created_at: string;
}

interface Configs {
  lastTweetId: number;
  newestTweetDataId: number;
}
interface ConfigColumns {
  id: 0;
  last_tweet_id: number;
  newest_tweet_data_id: number;
}

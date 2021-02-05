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
}

interface Configs {
  lastTweetId: number;
  newestTweetDataId: string;
}

interface ConfigColumns {
  id: 0;
  last_tweet_id: number;
  newest_tweet_data_id: string;
}

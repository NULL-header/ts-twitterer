/* eslint-disable camelcase */
interface Tweet {
  id: number;
  username: string;
  userid: string;
  iconUrl: string;
  content: string;
  created_at: string;
}

interface Config {
  id: number;
  last_tweet_id: number;
}

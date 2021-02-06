import Dexie from "dexie";

const tweetColumnsFirst = [
  "++id",
  "username",
  "userid",
  "icon_url",
  "content",
  "created_at",
  "*media",
  "list_id",
];

const configColumnsFirst = [
  "id",
  "last_tweet_id",
  "newest_tweet_data_id",
  "*list_ids",
  "current_list",
];

const makeSchema = (columns: string[]) => columns.join(", ");

class MyDB extends Dexie {
  tweets!: Dexie.Table<TweetColumns, number>;
  configs!: Dexie.Table<ConfigColumns, 0>;
  constructor() {
    super("ts-twitterer");

    this.version(1).stores({
      tweets: makeSchema(tweetColumnsFirst),
      configs: makeSchema(configColumnsFirst),
    });
  }
}

const db = new MyDB();

export { db };

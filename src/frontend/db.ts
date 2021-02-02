import Dexie from "dexie";

const tweetColumnsFirst = [
  "++id",
  "username",
  "userid",
  "iconUrl",
  "content",
  "created_at",
];

const configColumnsFirst = ["id", "last_tweet_id"];

const makeSchema = (columns: string[]) => columns.join(", ");

class MyDB extends Dexie {
  tweets!: Dexie.Table<Tweet, number>;
  configs!: Dexie.Table<Config, 0>;
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

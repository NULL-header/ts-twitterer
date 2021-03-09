import Dexie from "dexie";

const tweetColumnsFirst = [
  "++tweet.uniqid",
  "tweet",
  "tweet.user.name",
  "tweet.user.twitterId",
  "tweet.createdAt",
  "tweet.listId",
  "tweet.hasMedia",
  "tweet.isRetweeted",
];

const configColumnsFirst = ["id", "last_data"];

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

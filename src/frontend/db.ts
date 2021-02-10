import Dexie from "dexie";

const tweetColumnsFirst = [
  "++id",
  "username",
  "userid",
  "icon_url",
  "content",
  "created_at",
  "media",
  "list_id",
  "[id+list_id]",
  "is_retweeted",
  "retweeter_name",
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

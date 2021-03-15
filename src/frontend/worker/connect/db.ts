import Dexie from "dexie";
import { GlobalDataObj } from "frontend/globalState/GlobalData";

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

const globalDataFirst = ["uniqid", "lastData"];

const makeSchema = (columns: string[]) => columns.join(", ");

class MyDB extends Dexie {
  tweets!: Dexie.Table<TweetColumns, number>;

  globalData!: Dexie.Table<{ uniqid: 0; lastData: GlobalDataObj }, 0>;

  constructor() {
    super("ts-twitterer");

    this.version(1).stores({
      tweets: makeSchema(tweetColumnsFirst),
      globalData: makeSchema(globalDataFirst),
    });
  }
}

const db = new MyDB();

export { db };

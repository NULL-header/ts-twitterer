import Dexie from "dexie";
import { AuthManager } from "frontend/globalState/AuthManager";
import { TweetsManager } from "frontend/components/main/Timeline/TweetsManager";

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

const timelineDetailColumnsFirst = ["uniqid", "lastData"];

const globalDataFirst = ["uniqid", "lastData"];

const makeSchema = (columns: string[]) => columns.join(", ");

class MyDB extends Dexie {
  tweets!: Dexie.Table<TweetColumns, number>;

  globalData!: Dexie.Table<
    { uniqid: 0; lastData: ReturnType<AuthManager["toJS"]> },
    0
  >;

  timelineDetail!: Dexie.Table<{
    uniqid: 0;
    lastData: ReturnType<TweetsManager["toJS"]>;
  }>;

  constructor() {
    super("ts-twitterer");

    this.version(1).stores({
      tweets: makeSchema(tweetColumnsFirst),
      globalData: makeSchema(globalDataFirst),
      timelineDetail: makeSchema(timelineDetailColumnsFirst),
    });
  }
}

const db = new MyDB();

export { db };

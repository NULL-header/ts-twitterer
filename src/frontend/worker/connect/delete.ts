import { db } from "./db";

export const deleteCacheTweetsAll = () => db.tweets.clear();

import Immutable from "immutable";
import { loadNewTweets } from "frontend/worker/connect";

const initValue = {
  tweets: Immutable.List<Tweet>(),
  newestUniqidMap: Immutable.Map<string, number | undefined>(),
  oldestUniqidMap: Immutable.Map<string, number | undefined>(),
  windowLength: 30,
  currentList: undefined as string | undefined,
  listids: Immutable.List<string>(),
};

const BaseRecord = Immutable.Record(initValue);

export class TweetsManager extends BaseRecord {
  async getTweets() {
    if (this.currentList == null)
      throw new Error("The current list is undefined.");
    const tweets = await loadNewTweets({
      currentList: this.currentList,
      windowLength: this.windowLength,
      newestUniqid: this.newestUniqidMap.get(this.currentList),
    });
    // 配列がゼロである可能性を潰して、nextTweets.firstとnextTweets.lastがundefinedである可能性を潰す
    if (tweets.length === 0) throw new Error("The new tweets are nothing.");
    const { tweets: oldTweets } = this;
    const allTweets = oldTweets.push(...tweets);
    const nextTweets =
      allTweets.size > this.windowLength
        ? allTweets.slice(allTweets.size - this.windowLength - 1)
        : allTweets;
    const newestTweet = nextTweets.last() as Tweet;
    const oldestTweet = nextTweets.first() as Tweet;
    const currentList = newestTweet.listId;
    return this.set("tweets", nextTweets).mergeDeep({
      newestDataidMap: {
        [currentList]: newestTweet.dataid,
      },
      newestUniqidMap: {
        [currentList]: newestTweet.uniqid,
      },
      oldestUniqidMap: {
        [currentList]: oldestTweet.uniqid,
      },
    } as any);
  }

  removeListid(listid: string) {
    const result = this.merge({
      newestUniqidMap: this.newestUniqidMap.remove(listid),
      oldestUniqidMap: this.oldestUniqidMap.remove(listid),
      listids: this.listids.remove(this.listids.indexOf(listid)),
    });
    if (this.currentList === listid)
      return result.set("currentList", undefined);
    return result;
  }

  addListid(listid: string) {
    return this.merge({
      newestUniqidMap: this.newestUniqidMap.set(listid, undefined),
      oldestUniqidMap: this.oldestUniqidMap.set(listid, undefined),
      listids: this.listids.push(listid),
    });
  }

  deleteAll() {
    return this.merge({
      newestUniqidMap: {},
      oldestUniqidMap: {},
      tweets: [],
    } as any);
  }
}

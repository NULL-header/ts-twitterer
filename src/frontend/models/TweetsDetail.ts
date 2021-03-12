import Immutable from "immutable";

const initValue = {
  tweets: Immutable.List<Tweet>(),
  newestDataidMap: Immutable.Map<string, string>(),
  newestUniqidMap: Immutable.Map<string, number>(),
  oldestUniqidMap: Immutable.Map<string, number>(),
  windowLength: 30,
  currentList: undefined as string | undefined,
  listids: Immutable.List<string>(),
};

export interface TweetsDetailObj {
  tweets: Tweet[];
  newestDataidMap: Record<string, string>;
  newestUniqidMap: Record<string, number>;
  oldestUniqidMap: Record<string, number>;
  listids: string[];
  windowLength: number;
  currentList: string | undefined;
}

const BaseRecord = Immutable.Record(initValue);

export class TweetsDetail extends BaseRecord {
  toJS() {
    return super.toJS() as TweetsDetailObj;
  }

  // 古い順に渡す
  addTweets(tweets: Tweet[]) {
    // 配列がゼロである可能性を潰して、nextTweets.firstとnextTweets.lastがundefinedである可能性を潰す
    if (tweets.length === 0) return this;
    const { tweets: oldTweets } = this;
    const allTweets = oldTweets.push(...tweets);
    const nextTweets =
      allTweets.size > this.windowLength
        ? allTweets.slice(allTweets.size - this.windowLength - 1)
        : allTweets;
    const newestTweet = nextTweets.last() as Tweet;
    const oldestTweet = nextTweets.first() as Tweet;
    const currentList = newestTweet.listId;
    return this.set("tweets", nextTweets)
      .set(
        "newestDataidMap",
        this.newestDataidMap.set(currentList, newestTweet.dataid),
      )
      .set(
        "newestUniqidMap",
        this.newestUniqidMap.set(currentList, newestTweet.uniqid),
      )
      .set(
        "oldestUniqidMap",
        this.oldestUniqidMap.set(currentList, oldestTweet.uniqid),
      );
  }

  load(obj: TweetsDetailObj): TweetsDetail {
    return this.merge(obj as any);
  }
}

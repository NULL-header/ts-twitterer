import Immutable, { Map as IMap, List } from "immutable";

interface TweetsDetailChildren {
  tweets: List<Tweet>;
  newestDataidMap: IMap<string, string>;
  newestUniqidMap: IMap<string, number>;
  oldestUniqidMap: IMap<string, number>;
  windowLength: number;
  currentList: string;
  listids: List<string>;
}

export interface TweetsDetailObj {
  tweets: Tweet[];
  newestDataidMap: Record<string, string>;
  newestUniqidMap: Record<string, number>;
  oldestUniqidMap: Record<string, number>;
  windowLength: number;
  currentList: string;
  listids: string[];
}

const BaseRecord = Immutable.Record({
  tweets: Immutable.List(),
  newestDataidMap: Immutable.Map(),
  newestUniqidMap: Immutable.Map(),
  oldestUniqidMap: Immutable.Map(),
  windowLength: 30,
} as TweetsDetailChildren);

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
    return this.set("tweets", Immutable.List(obj.tweets))
      .set("newestDataidMap", Immutable.Map(obj.newestDataidMap))
      .set("newestUniqidMap", Immutable.Map(obj.newestUniqidMap))
      .set("oldestUniqidMap", Immutable.Map(obj.oldestUniqidMap))
      .set("windowLength", obj.windowLength);
  }
}

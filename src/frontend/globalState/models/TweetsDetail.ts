// eslint-disable-next-line max-classes-per-file
import Immutable, { Record as IRecord, Map as IMap, List } from "immutable";

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

const BaseRecord = (Immutable.Record({
  tweets: Immutable.List(),
  newestDataidMap: Immutable.Map(),
  newestUniqidMap: Immutable.Map(),
  oldestUniqidMap: Immutable.Map(),
  windowLength: 30,
} as TweetsDetailChildren) as any) as new () => ReturnType<
  IRecord.Factory<TweetsDetailChildren>
> &
  TweetsDetailChildren;

export class TweetsDetail extends BaseRecord {
  set<T extends keyof TweetsDetailChildren>(
    key: T,
    value: TweetsDetailChildren[T],
  ): TweetsDetail {
    return super.set(key, value) as any;
  }

  toJS(): TweetsDetailObj {
    return super.toJS() as any;
  }

  addTweets(tweets: Tweet[]) {
    const { tweets: oldTweets } = this;
    const allTweets = oldTweets.push(...tweets);
    const nextTweets =
      allTweets.size > this.windowLength
        ? allTweets.slice(allTweets.size - this.windowLength - 1)
        : allTweets;
    const newestTweet = nextTweets.last();
    const oldestTweet = nextTweets.first();
    const currentList = newestTweet.listId;
    return this.set("tweets", nextTweets as any)
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

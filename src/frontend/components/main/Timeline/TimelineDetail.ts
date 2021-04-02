import Immutable from "immutable";
import { TweetsDetailObj, TweetsDetail } from "./TweetsDetail";

interface Limit {
  limitRate: number;
  remaining: number;
}

type LimitData = Record<"lists", Limit>;

const initValue = {
  listids: Immutable.List<string>(),
  currentList: undefined as string | undefined,
  limitData: undefined as LimitData | undefined,
  tweetsDetail: new TweetsDetail(),
  isLoadingFromDB: undefined as boolean | undefined,
};

export interface TimelineDetailObj {
  listids: string[];
  currentList: string | undefined;
  limitData: LimitData | undefined;
  tweetsDetail: TweetsDetailObj;
}

const BaseRecord = Immutable.Record(initValue);

export class TimelineDetail extends BaseRecord {
  load(obj: TimelineDetailObj) {
    return this.merge(obj as any);
  }

  removeListid(listid: string) {
    const result = this.merge({
      listids: this.listids.remove(this.listids.indexOf(listid)),
      tweetsDetail: this.tweetsDetail.removeListid(listid),
    });
    if (this.currentList === listid)
      return result.set("currentList", undefined);
    return result;
  }

  addListid(listid: string) {
    return this.merge({
      listids: this.listids.push(listid),
      tweetsDetail: this.tweetsDetail.addListid(listid),
    });
  }
}

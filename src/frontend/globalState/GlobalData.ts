import Immutable from "immutable";

const initValue = {
  isAuthorized: false,
};

const BaseRecord = Immutable.Record(initValue);

export interface GlobalDataObj {
  isAuthorized: boolean;
}

export class GlobalData extends BaseRecord {
  load(obj: GlobalDataObj) {
    return this.merge(obj);
  }
}

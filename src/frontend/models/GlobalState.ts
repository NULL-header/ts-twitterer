import Immutable from "immutable";

const initValue = {
  isAuthorized: false,
};

const BaseRecord = Immutable.Record(initValue);

export class GlobalState extends BaseRecord {}

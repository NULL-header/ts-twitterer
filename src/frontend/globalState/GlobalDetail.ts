import Immutable from "immutable";
import { GlobalData, GlobalDataObj } from "./GlobalData";

const initValue = {
  isLoadingFromDB: undefined as boolean | undefined,
  globalData: new GlobalData(),
};

export interface GlobalDetailObj {
  isLoadingFromDB: boolean | undefined;
  globalData: GlobalDataObj;
}

const BaseRecord = Immutable.Record(initValue);

export class GlobalDetail extends BaseRecord {}

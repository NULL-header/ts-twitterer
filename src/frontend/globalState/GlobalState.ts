import Immutable from "immutable";
import { GlobalData, GlobalDataObj } from "./GlobalData";

const initValue = {
  isLoadingFromDB: undefined as boolean | undefined,
  globalData: new GlobalData(),
};

export interface GlobalStateObj {
  isLoadingFromDB: boolean | undefined;
  globalData: GlobalDataObj;
}

const BaseRecord = Immutable.Record(initValue);

export class GlobalState extends BaseRecord {}

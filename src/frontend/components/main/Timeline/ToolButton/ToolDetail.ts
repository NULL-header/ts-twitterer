import Immutable from "immutable";

const initValue = {
  listTool: false,
};

const BaseRecord = Immutable.Record(initValue);

export class ToolDetail extends BaseRecord {}

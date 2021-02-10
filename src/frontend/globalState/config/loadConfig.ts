import { db } from "../../db";

export const loadConfigs = async () => {
  const dataNullable = await db.configs.get(0);
  if (dataNullable != null) {
    return dataNullable.last_data;
  }
  return undefined;
};

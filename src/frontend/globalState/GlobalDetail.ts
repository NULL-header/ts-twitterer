import Immutable from "immutable";
import { initializeGlobal, saveLastData } from "frontend/worker/connect";
import { AuthManager } from "./AuthManager";

const initValue = {
  isLoadingFromDB: undefined as boolean | undefined,
  authManager: new AuthManager(),
};

const BaseRecord = Immutable.Record(initValue);

export class GlobalDetail extends BaseRecord {
  async preload() {
    return this.merge({
      authManager: this.authManager.mergeDeep(await initializeGlobal()),
      isLoadingFromDB: false,
    });
  }

  load() {
    const prev = this.set("isLoadingFromDB", true);
    const after = prev.preload();
    return [prev, after];
  }

  getVoids() {
    return {
      save: async () => {
        await saveLastData(this.authManager.toJS());
      },
    };
  }

  async updateAsync<T extends keyof ReturnType<GlobalDetail["toJS"]>>(
    key: T,
    updater: (prop: GlobalDetail[T]) => Promise<GlobalDetail[T]>,
  ) {
    const result = await updater(this[key]);
    return this.set(key, result);
  }
}

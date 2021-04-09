import Immutable from "immutable";
import {
  saveTimelineDetail,
  loadTimelineDetail,
  deleteCacheTweetsAll,
} from "frontend/worker/connect";
import { TweetsManager } from "./TweetsManager";

const initValue = {
  tweetsManager: new TweetsManager(),
  isLoadingFromDB: undefined as boolean | undefined,
};

const BaseRecord = Immutable.Record(initValue);

export class TimelineDetail extends BaseRecord {
  async preload() {
    return this.merge({
      tweetsManager: this.tweetsManager.mergeDeep(
        (await loadTimelineDetail()) as any,
      ),
      isLoadingFromDB: false,
    });
  }

  load() {
    const prev = this.set("isLoadingFromDB", true);
    const after = prev.preload();
    return [prev, after];
  }

  async deleteCache() {
    const promise = deleteCacheTweetsAll();
    const deleted = this.update("tweetsManager", (manager) =>
      manager.deleteAll(),
    );
    await promise;
    return deleted;
  }

  getVoids() {
    return {
      save: async () => {
        await saveTimelineDetail(this.tweetsManager.toJS());
      },
    };
  }

  async updateAsync<T extends keyof ReturnType<TimelineDetail["toJS"]>>(
    key: T,
    updater: (prop: TimelineDetail[T]) => Promise<TimelineDetail[T]>,
  ) {
    const result = await updater(this[key]);
    return this.set(key, result);
  }
}

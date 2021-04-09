import Immutable from "immutable";
import { authorize, unauthorize } from "frontend/worker/connect";

const initValue = {
  isAuthorized: false,
};

const BaseRecord = Immutable.Record(initValue);

export class AuthManager extends BaseRecord {
  async auth(
    tokens: Record<
      | "accessToken"
      | "accessTokenSecret"
      | "consumerToken"
      | "consumerTokenSecret",
      string
    >,
  ) {
    await authorize(tokens);
    return this.set("isAuthorized", true);
  }

  async unauth() {
    await unauthorize();
    return this.set("isAuthorized", false);
  }

  load(obj: ReturnType<AuthManager["toJS"]>) {
    return this.merge(obj);
  }
}

import Immutable from "immutable";

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
    await fetch("/api/token/set", {
      body: JSON.stringify(tokens),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.set("isAuthorized", true);
  }

  async unauth() {
    await fetch("/api/token/delete", { method: "POST" });
    return this.set("isAuthorized", false);
  }

  load(obj: ReturnType<AuthManager["toJS"]>) {
    return this.merge(obj);
  }
}

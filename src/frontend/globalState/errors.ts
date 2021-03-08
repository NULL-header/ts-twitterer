/* eslint-disable max-classes-per-file */
class InitializeError extends TypeError {
  constructor(message: string) {
    super(`Initialize Error occured. detail is here:${message}`);
  }
}

export class CurrentListInitError extends InitializeError {
  constructor(message?: string) {
    super(`current list is undefined.${message}`);
  }
}

export class DataIdMapInitError extends InitializeError {
  constructor({ key }: { key: { [keyName: string]: any } }) {
    super(
      `The value of the key of newestTweetDataIdMap is not initialized. key is this: ${key}`,
    );
  }
}

export class ConfigInitError extends InitializeError {
  constructor(message?: string) {
    super(`Last config is nothing.${message}`);
  }
}

const baseText = "New object is nothing. detail is here:";
export class ShouldUnupdateError extends TypeError {
  constructor(message?: string) {
    super(`${baseText}New tweet is nothing.${message}`);
  }
}

export class RateError extends Error {
  constructor({ limit }: { limit: { [remaining: string]: number } }) {
    super(`The remaining of limit is too few. The detail is this: ${limit}`);
  }
}

export class DuplicateError extends Error {
  constructor({ flag }: { flag: { [flagName: string]: boolean } }) {
    super(`The task is duplicated. The flag is this: ${flag}`);
  }
}

export class NoLastConfigError extends TypeError {
  constructor() {
    super("The last config data is nothing");
  }
}

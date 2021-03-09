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

type IdMapErrorArgs = { key: { [keyname: string]: string } };

class IdMapError extends Error {
  constructor({ key }: IdMapErrorArgs, mapName: string) {
    super(
      `The value of the key of ${mapName} is undefined. The key is here: ${JSON.stringify(
        key,
      )}`,
    );
  }
}

export class OldestUniqIdMapError extends IdMapError {
  constructor(value: IdMapErrorArgs) {
    super(value, "oldestIdMap");
  }
}

export class NewestUniqIdMapError extends IdMapError {
  constructor(value: IdMapErrorArgs) {
    super(value, "newesIdMap");
  }
}

export class NewestDataIdMapError extends IdMapError {
  constructor(value: IdMapErrorArgs) {
    super(value, "newestDataIdMap");
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

/* eslint-disable @typescript-eslint/no-namespace */
import "immutable";

declare module "immutable" {
  interface List<T> {
    first(): T | undefined;
    first<A>(iniitalValue: A): A;
    last(): T | undefined;
    last<A>(initialValue: A): A;
  }
}

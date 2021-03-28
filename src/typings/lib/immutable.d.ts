import Immutable from "immutable";

type RecordImmutable<T> = {
  [P in keyof T]: T[P] extends Immutable.Record<infer A>
    ? RecordImmutable<A>
    : T[P] extends Immutable.List<infer A>
    ? ListImmutable<A>
    : T[P] extends Immutable.Map<infer K, infer V>
    ? MapImmutable<K, V>
    : T[P];
};

type ListImmutable<T> = T extends Immutable.Record<infer A>
  ? RecordImmutable<A>[]
  : T extends Immutable.List<infer A>
  ? ListImmutable<A>[]
  : T extends Immutable.Map<infer K, infer V>
  ? MapImmutable<K, V>[]
  : T[];

type MapImmutable<K, V> = K extends string
  ? V extends Immutable.Record<infer A>
    ? Record<K, RecordImmutable<A>>
    : V extends Immutable.List<infer A>
    ? Record<K, ListImmutable<A>>
    : V extends Immutable.Map<infer KA, infer VA>
    ? Record<K, MapImmutable<KA, VA>>
    : Record<K, V>
  : never;

declare module "immutable" {
  interface List<T> {
    first(): T | undefined;
    first<A>(iniitalValue: A): A;
    last(): T | undefined;
    last(initialValue: T): T;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface Record<TProps extends Object> {
    toJS(): RecordImmutable<TProps>;
  }
}

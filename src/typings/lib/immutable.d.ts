import Immutable from "immutable";

type ArrayBranch = "ArrayBranch";
type MapBranch = "MapBranch";

type RecursiveImmutable<
  T extends
    | Record<string, any>
    | Record<ArrayBranch, any>
    | Record<MapBranch, any>
> = T extends Record<ArrayBranch, infer A>
  ? A extends Immutable.Record<infer B>
    ? RecursiveImmutable<B>
    : A extends Immutable.List<infer B>
    ? RecursiveImmutable<Record<ArrayBranch, B>>[]
    : A extends Immutable.Map<infer B, infer C>
    ? B extends string
      ? Record<B, RecursiveImmutable<Record<MapBranch, C>>>
      : never
    : A
  : T extends Record<MapBranch, infer A>
  ? A extends Immutable.Record<infer B>
    ? RecursiveImmutable<B>
    : A extends Immutable.List<infer B>
    ? RecursiveImmutable<Record<MapBranch, B>>[]
    : A extends Immutable.Map<infer B, infer C>
    ? B extends string
      ? Record<B, RecursiveImmutable<Record<MapBranch, C>>>
      : never
    : A
  : {
      [P in keyof T]: T[P] extends Immutable.Record<infer A>
        ? RecursiveImmutable<A>
        : T[P] extends Immutable.List<infer A>
        ? RecursiveImmutable<Record<ArrayBranch, A>>[]
        : T[P] extends Immutable.Map<infer A, infer B>
        ? A extends string
          ? Record<A, RecursiveImmutable<Record<MapBranch, B>>>
          : never
        : T[P];
    };

declare module "immutable" {
  interface List<T> {
    first(): T | undefined;
    first<A>(iniitalValue: A): A;
    last(): T | undefined;
    last(initialValue: T): T;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface Record<TProps extends Object> {
    // toJS(): {
    // [P in keyof TProps]: TProps[P] extends List<infer A> ? A[] : TProps[P];
    // };
    toJS(): RecursiveImmutable<TProps>;
  }
}

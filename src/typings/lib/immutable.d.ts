import "immutable";

declare module "immutable" {
  interface List<T> {
    first(): T | undefined;
    first<A>(iniitalValue: A): A;
    last(): T | undefined;
    last(initialValue: T): T;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface Record<TProps extends Object> {
    toJS(): TProps;
  }
}

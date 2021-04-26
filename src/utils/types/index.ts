export type PickKey<T extends object, K extends keyof T> = K;
export type PickString<Keys extends string, K extends Keys> = K;
export type AnyArray = readonly unknown[];
export interface ConstructorOf<T, Params extends AnyArray = AnyArray> {
  new (...args: Params): T;
}

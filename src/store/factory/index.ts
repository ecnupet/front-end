import { observable } from "mobx";
import { AnyArray, ConstructorOf } from "../../utils/types";

export function createStore<T extends object>(store: T): T {
  return observable(Object.setPrototypeOf(store, Object.prototype));
}

export function createStoreWithClass<
  Constructor extends ConstructorOf<object, AnyArray>
>(
  constructor: Constructor,
  ...args: ConstructorParameters<Constructor>
): InstanceType<Constructor> {
  return createStore(new constructor(...args)) as never;
}

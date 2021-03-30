import { makeAutoObservable } from "mobx";
import { AnyArray, ConstructorOf } from "../../utils/types";

export function createStoreWithClass<
  Constructor extends ConstructorOf<object, AnyArray>
>(
  constructor: Constructor,
  ...args: ConstructorParameters<Constructor>
): InstanceType<Constructor> {
  return makeAutoObservable(new constructor(...args)) as never;
}

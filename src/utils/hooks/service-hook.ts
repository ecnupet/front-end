import { useLocalObservable } from "mobx-react-lite";
import { createService } from "../services";
import { ConstructorOf } from "../types";

export function useService<Constructor extends ConstructorOf<object>>(
  constructor: Constructor,
  ...args: ConstructorParameters<Constructor>
): InstanceType<Constructor> {
  const service = useLocalObservable(() => createService(constructor, ...args));
  return service as never;
}

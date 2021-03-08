import { ConstructorOf } from "../../types";

export function createService<Constructor extends ConstructorOf<object>>(
  constructor: Constructor,
  ...args: ConstructorParameters<Constructor>
): InstanceType<Constructor> {
  const service = new constructor(...args);
  return new Proxy(service, {
    get(target, key, reciever) {
      const result: unknown = Reflect.get(target, key, reciever);
      if (typeof result === "function") {
        return result.bind(target);
      }
      return result;
    },
    set(target, key, value, reciever) {
      return Reflect.set(target, key, value, reciever);
    },
  }) as never;
}

import { isDev } from "../../services";
import { configStore } from "../../store/config";
import { wait } from "./time";
export function callHook<T extends object>(target: T): T {
  if (isDev)
    return new Proxy(target, {
      get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        if (typeof result === "function") {
          return function (this: unknown) {
            configStore.getConfig("logDetails") &&
              console.log(`call method <${result.name}>`, arguments);
            const callResult = (result as Function).apply(this, arguments);
            if (callResult instanceof Promise) {
              return (async () => {
                await wait(configStore.getConfig("mockRequestDuration"));
                const unwrapped = await callResult;
                configStore.getConfig("logDetails") &&
                  console.log(`call method <${result.name}> result`, unwrapped);
                return unwrapped;
              })();
            }
            configStore.getConfig("logDetails") &&
              console.log("call method result", callResult);
            return callResult;
          };
        }
        return result;
      },
    });
  return target;
}

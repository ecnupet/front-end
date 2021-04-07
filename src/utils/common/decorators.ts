import { isDev } from "../../env";
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
              console.log(`call method <${key.toString()}>`, arguments);
            const callResult = (result as Function).apply(this, arguments);
            if (callResult instanceof Promise) {
              return (async () => {
                try {
                  await wait(configStore.getConfig("mockRequestDuration"));
                  const unwrapped = await callResult;
                  configStore.getConfig("logDetails") &&
                    console.log(
                      `call method <${key.toString()}> result`,
                      unwrapped
                    );
                  return unwrapped;
                } catch (error) {
                  return Promise.reject(error);
                }
              })();
            } else {
              configStore.getConfig("logDetails") &&
                console.log(
                  `call method <${key.toString()}> result`,
                  callResult
                );
              return callResult;
            }
          };
        }
        return result;
      },
    });
  return target;
}

export const RequestHook = <Params = any, Result = any>({
  paramRewrite,
  responseRewrite,
}: {
  paramRewrite?(param: Params): Params;
  responseRewrite?(response: Result): Result;
}) => {
  const decorator: MethodDecorator = (target, key, descriptor) => {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== "function") {
      throw new Error("Invalid decoration with `requestHook`!.");
    }
    // @ts-ignore
    descriptor.value = async function (params, ...args) {
      isDev &&
        console.log(
          `Hack in request method ${target.constructor.name}.${key.toString()}`
        );
      try {
        // 只重写第一个参数
        params = paramRewrite?.call(undefined, params) ?? params;
      } catch (error) {
        isDev && console.error("Rewrite params failed", error);
      }
      let result = await originalMethod.call(this, params, ...args.slice(1));
      try {
        result = responseRewrite?.call(undefined, result) ?? result;
      } catch (error) {
        isDev && console.error("Rewrite response failed", error);
      }
      return result;
    };
    return descriptor;
  };
  return decorator;
};

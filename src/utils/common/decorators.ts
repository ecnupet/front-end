export function callHook<T extends object>(target: T): T {
  if (process.env.NODE_ENV !== "production")
    return new Proxy(target, {
      get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        if (typeof result === "function") {
          return function (this: unknown) {
            console.log(`call method <${result.name}>`, arguments);
            const callResult = (result as Function).apply(this, arguments);
            if (callResult instanceof Promise) {
              callResult.then((callResult) => {
                console.log(`call method <${result.name}> result`, callResult);
              });
              return callResult;
            }
            console.log("call method result", callResult);
            return callResult;
          };
        }
        return result;
      },
    });
  return target;
}

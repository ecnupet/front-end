export function wait(sec: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
}

export function debounce<Fn extends (...args: any[]) => any>(
  fn: Fn,
  timeout: number
) {
  let timer: number | null = null;
  return function () {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      timer !== null && window.clearTimeout(timer);
      // @ts-ignore
      fn.apply(this, arguments);
    }, timeout);
  } as Fn;
}

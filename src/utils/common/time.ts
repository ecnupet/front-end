export function wait(sec: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
}

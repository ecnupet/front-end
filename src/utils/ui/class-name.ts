export const mergeClassName = (...classNames: (string | undefined)[]) => {
  return classNames.filter((s): s is string => !!s).join(" ");
};

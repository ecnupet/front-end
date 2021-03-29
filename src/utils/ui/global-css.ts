interface GlobalCSSClasses {
  row: never;
  "center-row": never;
  column: never;
  "center-column": never;
  "full-height": never;
  rest: never;
  scrollable: never;
}

export function globalCss<K extends keyof GlobalCSSClasses>(key: K) {
  return key;
}

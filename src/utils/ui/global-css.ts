interface GlobalCSSClasses {
  "center-row": string;
  "center-column": string;
}

export function globalCss<K extends keyof GlobalCSSClasses>(key: K) {
  return key;
}

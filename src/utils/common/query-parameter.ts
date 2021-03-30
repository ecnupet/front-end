const PARAM_KEY = "param";

export function parseQueryParameter<T extends object>(defaultValues: T): T {
  const result = JSON.parse(JSON.stringify(defaultValues)) as T;
  const url = new URL(window.location.href);
  const param = url.searchParams.get(PARAM_KEY) ?? btoa("{}");
  const decoded = atob(param);
  const parsedObject = JSON.parse(decoded);
  for (const key in parsedObject) {
    if (key in result) {
      // @ts-ignore
      result[key] = parsedObject[key];
    }
  }
  return result;
}

export function serializeQueryParameter<T extends object>(
  obj: T
): URLSearchParams {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM_KEY, btoa(JSON.stringify(obj)));
  return url.searchParams;
}

export function updateQueryParameter(
  dist: URLSearchParams,
  patch: URLSearchParams
) {
  patch.forEach((value, key) => {
    dist.set(key, value);
  });
}

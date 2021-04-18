import { ObjectKeys } from "../utils/common";
import { ModelDescriber, ValueType } from "./model-describer";

export function createDescriber<T extends object>(
  others: Omit<ModelDescriber<T>, "defaultValue">
): ModelDescriber<T> {
  const defaultValue = ObjectKeys(others.properties).reduce<Partial<T>>(
    (obj, key) => {
      ((obj[key] as unknown) as ValueType) = others.properties[key]
        .valueDescriber.defaultValue as ValueType;
      return obj;
    },
    {}
  ) as T;
  const result = {
    ...others,
    defaultValue,
  };
  // @ts-ignore
  window.result1 = result;
  return result;
}

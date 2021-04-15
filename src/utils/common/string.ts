import crypto from "crypto";

export function getPasswordNumberArray(password: string): number[] {
  const hash = crypto.createHash("sha256");
  const updated = hash.update(password);
  return updated.digest().toJSON().data;
}

export function pickKey<K extends string>(key: K) {
  return key;
}

export function pickKeyOf<T extends object>(key: keyof T) {
  return key;
}
export function concat<A extends string, B extends string>(a: A, b: B) {
  return `${a}${b}` as `${A}${B}`;
}
export function capitalize<Str extends string>(s: Str): Capitalize<Str> {
  return `${s.slice(0, 1).toUpperCase()}${s.slice(1)}` as never;
}

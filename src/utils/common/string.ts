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

import crypto from "crypto";

export function getPasswordNumberArray(password: string): number[] {
  const hash = crypto.createHash("sha256");
  const updated = hash.update(password);
  return updated.digest().toJSON().data;
}

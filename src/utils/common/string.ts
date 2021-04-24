export async function getPasswordNumberArray(
  password: string
): Promise<number[]> {
  const subtle = window.crypto.subtle;
  const hash = await subtle.digest(
    "sha-256",
    new TextEncoder().encode(password)
  );
  return Array.from(new Uint8Array(hash));
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
export function uncapitalize<Str extends string>(s: Str): Uncapitalize<Str> {
  return `${s.slice(0, 1).toLowerCase()}${s.slice(1)}` as never;
}

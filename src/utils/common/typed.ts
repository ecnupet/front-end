import { AxiosError } from "axios";

export const withType = <T>(obj: T): T => obj;
export function isAxiosError(obj: any): obj is AxiosError {
  return !!obj.isAxiosError;
}

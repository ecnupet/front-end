import { useState } from "react";
import { parseQueryParameter } from "../common";

export function useParams<T extends object>(defaultParam: T) {
  const [param] = useState(() => parseQueryParameter(defaultParam));
  return param;
}

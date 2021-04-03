import { useState } from "react";
import { parseQueryParameter } from "../common";

export function useParams<T extends object>(defultParam: T) {
  const [param] = useState(() => parseQueryParameter(defultParam));
  return param;
}

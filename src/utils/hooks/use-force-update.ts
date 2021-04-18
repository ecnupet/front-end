import { useReducer } from "react";

export function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  return forceUpdate;
}

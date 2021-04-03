/* eslint-disable */
import { useEffect, useReducer, useRef, useState } from "react";
import { globalErrorHandle } from "../services/global-error-handler";

export type PromiseState = "pending" | "fulfilled" | "rejected";
export function useRequest<T, Params extends readonly unknown[]>(
  requester: (...args: Params) => Promise<T>,
  params: Params
) {
  const [data, setData] = useState<T | null>(null);
  const [tryCount, retry] = useReducer((count) => count + 1, 0);
  const [state, setState] = useState<PromiseState>("pending");
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    setState("pending");
    requester(...params)
      .then((result) => {
        if (!active.current) {
          return;
        }
        setData(result);
        setState("fulfilled");
      })
      .catch((e) => {
        if (!active.current) {
          return;
        }
        globalErrorHandle(e);
        setState("rejected");
      });
    return () => {
      active.current = false;
    };
  }, [...params, tryCount]);
  return [data, state, retry] as const;
}

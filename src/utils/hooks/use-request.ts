import { useEffect, useState } from "react";

export function useRequest<T, Params extends readonly unknown[]>(
  requester: (...args: Params) => Promise<T>,
  params: Params
) {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<"pending" | "fulfilled" | "rejected">(
    "pending"
  );
  useEffect(() => {
    requester(...params)
      .then((result) => {
        setData(result);
        setState("fulfilled");
      })
      .catch((e) => {
        console.error(e);
        setState("rejected");
      });
  }, params);
  return [data, state] as const;
}

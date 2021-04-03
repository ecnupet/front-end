import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Center } from "../center";

interface PromiseBuilderProp<T> {
  promise: Promise<T>;
  renderPending?(): React.ReactNode;
  render(result: T): React.ReactNode;
  renderError?(err?: any): React.ReactNode;
  onDone?(result: T): void;
  onError?(err?: any): void;
}

export function PromiseBuilder<T>(props: PromiseBuilderProp<T>): JSX.Element {
  const [promiseState, setPromiseState] = useState<
    "pending" | "fulfilled" | "rejected"
  >("pending");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    let available = true;
    setPromiseState("pending");
    props.promise
      .then((result) => {
        if (!available) return;
        setData(result);
        setPromiseState("fulfilled");
        setTimeout(() => {
          props.onDone?.(result);
        }, 0);
      })
      .catch((err) => {
        if (!available) return;
        setError(err);
        setPromiseState("rejected");
        setTimeout(() => {
          props.onError?.(err);
        }, 0);
      });
    return () => {
      available = false;
    };
  }, [props]);
  return (
    <>
      {promiseState === "fulfilled"
        ? props.render(data!)
        : promiseState === "pending"
        ? props.renderPending?.() ?? (
            <Center style={{ left: "50%", top: "50%", position: "absolute" }}>
              <Spin></Spin>
            </Center>
          )
        : promiseState === "rejected"
        ? props.renderError?.(error)
        : null}
    </>
  );
}

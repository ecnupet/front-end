import { Spin } from "antd";
import { useState } from "react";

interface PromiseBuilderProp<T> {
  promise: Promise<T>;
  renderPending?(): JSX.Element;
  render(result: T): JSX.Element;
}

export function PromiseBuilder<T>(props: PromiseBuilderProp<T>) {
  const [added, setAdded] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<T | null>(null);
  if (!added) {
    setAdded(true);
    props.promise.then((result) => {
      setData(result);
      setDone(true);
    });
  }
  return done
    ? props.render(data!)
    : props.renderPending?.() ?? <Spin>加载中</Spin>;
}

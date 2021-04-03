import { Button, Result, Spin } from "antd";
import React from "react";
import { PromiseState } from "../../utils/hooks/use-request";

export interface IPromiseBuilderProp {
  state: PromiseState;
  retry?(): void;
}

export const PromiseBuilder: React.FC<IPromiseBuilderProp> = ({
  state,
  children,
  retry,
}) => {
  return (
    <Spin spinning={state === "pending"}>
      {state === "rejected" ? (
        <Result
          status="error"
          title="服务器抽风啦"
          extra={
            <Button onClick={retry} type="primary">
              重新加载
            </Button>
          }
        ></Result>
      ) : (
        children
      )}
    </Spin>
  );
};

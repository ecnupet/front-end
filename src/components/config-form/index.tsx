import { Form, Input, Switch } from "antd";
import { useEffect, useState } from "react";

interface ConfigFormProp<T> {
  config: T;
  onChange(config: T): void;
}

export function ConfigForm<T extends object>(
  prop: ConfigFormProp<T>
): JSX.Element {
  const [config, setConfig] = useState(prop.config);
  function handleUpdate<K extends keyof T>(key: K, value: T[K]) {
    setConfig({
      ...config,
      [key]: value,
    });
  }
  useEffect(() => {
    prop.onChange(config);
  }, [config, prop]);
  return (
    <Form>
      {Object.entries(config).map(([key, value]: [string, unknown]) => (
        <Form.Item label={key} key={key} fieldKey={key}>
          {typeof value === "number" ? (
            <Input
              value={value}
              type="number"
              onChange={(e) => {
                // @ts-ignore
                handleUpdate(key, +e.target.value);
              }}
            ></Input>
          ) : typeof value === "string" ? (
            <Input
              value={value}
              onChange={(e) => {
                // @ts-ignore
                handleUpdate(key, e.target.value);
              }}
            ></Input>
          ) : typeof value === "boolean" ? (
            <Switch
              checked={value}
              onChange={(e) => {
                // @ts-ignore
                handleUpdate(key, e);
              }}
            ></Switch>
          ) : null}
        </Form.Item>
      ))}
    </Form>
  );
}

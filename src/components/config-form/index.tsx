import React from "react";
import { AutoComplete, Form, Input, Switch } from "antd";
import { Observer } from "mobx-react-lite";

interface ConfigOption {
  displayName?: string;
  stringEnums?: string[];
}

interface ConfigFormProp<T extends object> {
  config: T;
  configOptions?: Partial<Record<keyof T, ConfigOption>>;
  onChange(config: T): void;
}

export function ConfigForm<T extends object>(
  prop: ConfigFormProp<T>
): React.ReactElement {
  function handleUpdate<K extends keyof T>(key: K, value: T[K]) {
    prop.onChange({ ...prop.config, [key]: value });
  }
  return (
    <Observer>
      {() => (
        <Form>
          {(Object.entries(prop.config) as [keyof T & string, any][]).map(
            ([key, value]) => (
              <Form.Item
                label={prop.configOptions?.[key]?.displayName ?? key}
                key={key}
                fieldKey={key}
              >
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
                  <AutoComplete
                    value={value}
                    onChange={(e) => {
                      // @ts-ignore
                      handleUpdate(key, e);
                    }}
                    options={prop.configOptions?.[
                      key
                    ]?.stringEnums?.map((value) => ({ value }))}
                  ></AutoComplete>
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
            )
          )}
        </Form>
      )}
    </Observer>
  );
}

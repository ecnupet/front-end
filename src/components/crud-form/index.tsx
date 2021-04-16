import {
  Button,
  Form,
  FormItemProps,
  Input,
  InputProps,
  Modal,
  Select,
  SelectProps,
  Switch,
  SwitchProps,
} from "antd";
import React, { useEffect } from "react";
import { capitalize, concat, ObjectKeys } from "../../utils/common";

export type CRUD = "create" | "update" | "retrieve" | "delete";
const TranslateCRUD: Record<CRUD, string> = {
  create: "创建",
  delete: "删除",
  retrieve: "查询",
  update: "更新",
};
export type CommonFieldItem<T extends object> = (
  initVal: T,
  props: {
    key?: React.Key;
    disabled?: boolean;
    disableKey?: boolean;
    primaryKey: string;
  }
) => React.ReactNode;
export interface CommonFieldDetailedItem<V> {
  render: (init: V, props?: { disabled?: boolean }) => React.ReactNode;
  valuePropName?: string;
}
export interface ICommonFormProp<T extends object> {
  onFinish?: (form: T) => void;
  fields: Array<CommonFieldItem<T>>;
  costom?: Array<React.ReactNode>;
  readonly?: boolean;
  disableKey?: boolean;
  primaryKey: string;
}

export interface ICRUDFormProp<T extends object> extends ICommonFormProp<T> {
  type: CRUD;
  modalName: string;
  handlers?: {
    [K in `on${Capitalize<CRUD>}`]?: (model: T) => void;
  };
  onClose: () => any;
}

export function Labeled<T extends object, K extends Extract<keyof T, string>>({
  field,
  fieldKey,
  label,
  formItemProps,
}: {
  fieldKey: K;
  field: CommonFieldDetailedItem<T[K]>;
  label?: string;
  formItemProps?: FormItemProps;
}): CommonFieldItem<T> {
  return (init, { key, disabled, disableKey, primaryKey }) => {
    const initValue = init[fieldKey];
    return (
      <Form.Item
        {...formItemProps}
        name={fieldKey}
        label={label}
        valuePropName={field.valuePropName ?? "value"}
        key={key}
      >
        {field.render(initValue, {
          disabled: disabled || (disableKey && fieldKey === primaryKey),
        })}
      </Form.Item>
    );
  };
}

export function Text({
  placeholder,
  inputProps,
}: {
  placeholder?: string;
  inputProps?: InputProps;
}): CommonFieldDetailedItem<string> {
  return {
    render: (_, prop) => (
      <Input
        {...inputProps}
        placeholder={placeholder}
        type="text"
        disabled={prop?.disabled ?? false}
      ></Input>
    ),
  };
}

export function Digital({
  placeholder,
  inputProps,
}: {
  placeholder?: string;
  inputProps?: InputProps;
}): CommonFieldDetailedItem<number> {
  return {
    render: (_, prop) => (
      <Input
        {...inputProps}
        placeholder={placeholder}
        type="number"
        disabled={prop?.disabled ?? false}
      ></Input>
    ),
  };
}

export function TextOrDigital({
  init,
  ...others
}: {
  placeholder?: string;
  init: string | number;
}): CommonFieldDetailedItem<string | number> {
  if (typeof init === "string") return Text(others) as never;
  if (typeof init === "number") return Digital(others) as never;
  throw new Error("Invalid usage with TextOrDigital");
}

export function Enum<Enum extends Record<string | number, string | number>>({
  enumObj,
  nameMapping,
  selectProps,
}: {
  enumObj: Enum;
  nameMapping?: Record<Enum[keyof Enum], string>;
  selectProps?: SelectProps<number>;
}): CommonFieldDetailedItem<Enum[keyof Enum]> {
  return {
    render: (_, prop) => (
      <Select {...selectProps} disabled={prop?.disabled ?? false}>
        {ObjectKeys(enumObj)
          /* eslint-disable-next-line */
          .filter((e): e is Enum[keyof Enum] => +e == e)
          .map((e) => {
            const enumValue = +e;
            return (
              <Select.Option key={enumValue} value={enumValue}>
                {nameMapping?.[e] ?? enumObj[e]}
              </Select.Option>
            );
          })}
      </Select>
    ),
  };
}

export function SingleSwitch(
  props?: SwitchProps
): CommonFieldDetailedItem<boolean> {
  return {
    render: (_, prop) => (
      <Switch {...props} disabled={prop?.disabled ?? false}></Switch>
    ),
    valuePropName: "checked",
  };
}

export function CommonForm<T extends object>(
  initVal: T,
  {
    fields,
    onFinish,
    costom,
    readonly,
    disableKey,
    primaryKey,
  }: ICommonFormProp<T>
): React.ReactNode {
  const [form] = Form.useForm<T>();
  useEffect(() => {
    form.setFieldsValue(initVal as never);
  }, [initVal, form]);
  return (
    <Form
      form={form}
      onFinish={(values) => {
        // Ant Design 的类型体操做的不行，Form的数字输入得自己转
        for (const key in values) {
          if (typeof initVal[key] === "number") {
            values[key] = +values[key] as never;
          }
        }
        onFinish?.call(undefined, values);
      }}
      labelCol={{ span: 4 }}
      initialValues={initVal}
    >
      {fields.map((field, i) =>
        field(initVal, { key: i, disabled: readonly, disableKey, primaryKey })
      )}
      {costom}
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ float: "right" }}>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
}

export function CRUDModal<T extends object>(
  initVal: T,
  { type, handlers, onClose, modalName, ...others }: ICRUDFormProp<T>,
  visable: boolean
) {
  return (
    <Modal
      visible={visable}
      onCancel={onClose}
      footer={false}
      title={`${TranslateCRUD[type]}${modalName}`}
      forceRender
    >
      {CommonForm(initVal, {
        ...others,
        onFinish(form) {
          handlers?.[concat("on", capitalize(type))]?.(form);
        },
        readonly: type === "delete" || type === "retrieve",
      })}
    </Modal>
  );
}

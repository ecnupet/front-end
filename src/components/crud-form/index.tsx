import { Button, Form, Input, Modal, Select, Switch } from "antd";
import React from "react";
import { capitalize, concat, ObjectKeys } from "../../utils/common";

type CRUD = "create" | "update" | "retrieve" | "delete";
const TranslateCRUD: Record<CRUD, string> = {
  create: "创建",
  delete: "删除",
  retrieve: "查询",
  update: "更新",
};
type CommonFieldItem<T extends object> = (
  initVal: T,
  form: Partial<T>
) => React.ReactNode;
interface CommonFieldDetailedItem<V> {
  render: (init: V, current?: V) => React.ReactNode;
  valuePropName?: string;
}
export interface ICommonFormProp<T extends object> {
  onFinish?: (form: T) => void;
  fields: Array<CommonFieldItem<T>>;
  costom?: Array<React.ReactNode>;
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
}: {
  fieldKey: K;
  field: CommonFieldDetailedItem<T[K]>;
  label?: string;
}): CommonFieldItem<T> {
  return (init, form) => {
    const initValue = init[fieldKey];
    const formValue = form[fieldKey];
    return (
      <Form.Item
        name={fieldKey}
        label={label}
        valuePropName={field.valuePropName}
      >
        {field.render(initValue, formValue)}
      </Form.Item>
    );
  };
}

export function Text({
  placeholder,
}: {
  placeholder?: string;
}): CommonFieldDetailedItem<string> {
  return {
    render: (init, current) => (
      <Input
        placeholder={placeholder}
        value={current ?? init}
        type="text"
      ></Input>
    ),
  };
}

export function Digital({
  placeholder,
}: {
  placeholder?: string;
}): CommonFieldDetailedItem<number> {
  return {
    render: (init, current) => (
      <Input
        placeholder={placeholder}
        value={current ?? init}
        type="number"
      ></Input>
    ),
  };
}

export function Enum<Enum extends Record<string | number, string | number>>({
  enumObj,
  nameMapping,
}: {
  enumObj: Enum;
  nameMapping?: Record<Enum[keyof Enum], string>;
}): CommonFieldDetailedItem<Enum[keyof Enum]> {
  return {
    render: (initVal, form) => (
      <Select value={initVal}>
        {ObjectKeys(enumObj)
          /* eslint-disable-next-line */
          .filter((e): e is Enum[keyof Enum] => +e == e)
          .map((e) => {
            const enumValue = +(form ?? e);
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

export function SingleSwitch(): CommonFieldDetailedItem<boolean> {
  return {
    render: (initVal, form) => <Switch checked={form ?? initVal}></Switch>,
    valuePropName: "checked",
  };
}

export function CommonForm<T extends object>(
  initVal: T,
  { fields, onFinish, costom }: ICommonFormProp<T>
): React.ReactNode {
  const [form] = Form.useForm<T>();
  const formValues = form.getFieldsValue();
  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }}>
      {fields.map((field, i) => (
        <div key={i}>{field(initVal, formValues)}</div>
      ))}
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
    >
      {CommonForm(initVal, {
        ...others,
        onFinish(form) {
          handlers?.[concat("on", capitalize(type))]?.(form);
        },
      })}
    </Modal>
  );
}

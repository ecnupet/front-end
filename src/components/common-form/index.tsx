import {
  Button,
  Form,
  Input,
  InputProps,
  Select,
  SelectProps,
  Switch,
  SwitchProps,
} from "antd";
import React, { useEffect } from "react";
import {
  EnumPropertyDescriber,
  FilePropertyDescriber,
  KeyOf,
  ModelDescriber,
  StringPropertyDescriber,
} from "../../models/model-describer";
import { ObjectEntries, ObjectKeys } from "../../utils/common";
import { useForceUpdate } from "../../utils/hooks/use-force-update";
import { QiniuUploader } from "../uploader";
import styles from "./style.module.css";

interface FormItemRenderer<T extends object, K extends KeyOf<T>> {
  render(props: {
    key?: React.Key;
    fieldKey: K;
    value: T[K];
    model: T;
    describer: ModelDescriber<T>;
  }): React.ReactNode | undefined;
}

interface CustomFormInputItemProps {
  switchProps?: Omit<SwitchProps, "onChange" | "checked">;
  inputProps?: Omit<InputProps, "onChange" | "value">;
  selectProps?: Omit<SelectProps<number>, "onChange" | "value">;
}

export interface ICommonFormProp<T extends object> {
  describer: ModelDescriber<T>;
  props?: CustomFormInputItemProps;
  customRenderer?: { [K in KeyOf<T>]?: FormItemRenderer<T, K> };
  onSubmit: (form: T) => any;
}

export const CommonForm = <T extends object>({
  describer,
  customRenderer,
  props,
  onSubmit,
}: React.PropsWithChildren<ICommonFormProp<T>>) => {
  const [form] = Form.useForm<T>();
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    form.setFieldsValue(
      (describer.currentValue ?? describer.defaultValue) as never
    );
    forceUpdate();
  }, [
    form,
    describer,
    describer.defaultValue,
    describer.currentValue,
    forceUpdate,
  ]);
  return (
    <Form
      form={form}
      onFinish={onSubmit}
      initialValues={describer.defaultValue}
      labelCol={{ span: 4 }}
      onValuesChange={(_, values) => {
        // @ts-expect-error
        form.setFieldsValue(values);
        forceUpdate();
      }}
    >
      {ObjectKeys(describer.properties)
        .sort((a, b) =>
          a === describer.primaryKey ? -1 : b === describer.primaryKey ? 1 : 0
        )
        .map((fieldKey, index) => {
          const { defaultValue, displayNames } = describer;
          const { required = true, validator } = describer.properties[fieldKey];
          const displayName = displayNames[fieldKey];
          const currentFormValues = form.getFieldsValue() ?? defaultValue;
          return (
            customRenderer?.[fieldKey]?.render({
              describer,
              fieldKey,
              model: currentFormValues,
              value: currentFormValues[fieldKey],
              key: index,
            }) ?? (
              <Form.Item
                key={index}
                rules={
                  !required
                    ? validator
                      ? [
                          {
                            validator(_, v, cb) {
                              const validateResult = validator(v);
                              !validateResult ? cb() : cb(validateResult);
                            },
                          },
                        ]
                      : undefined
                    : [{ required: true, message: `请输入${displayName}` }]
                }
                label={displayName}
                name={fieldKey}
                valuePropName={"value"}
              >
                {renderInputItem(describer, fieldKey, props)}
              </Form.Item>
            )
          );
        })}
      <Form.Item>
        <Button
          type="primary"
          className={styles["submit-button"]}
          htmlType="submit"
        >
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};

function renderInputItem<T extends object>(
  describer: ModelDescriber<T>,
  fieldKey: KeyOf<T>,
  props?: CustomFormInputItemProps
): React.ReactNode {
  const { valueDescriber, disabled } = describer.properties[fieldKey];
  const { type } = valueDescriber;
  if (type === "boolean") {
    return (
      <SwitchWrapper
        disabled={disabled}
        {...props?.switchProps}
      ></SwitchWrapper>
    );
  }
  const fieldName = describer.displayNames[fieldKey];
  const placeholder = `请输入${fieldName}`;
  if (type === "number") {
    return (
      <NumberInputWrapper
        disabled={disabled}
        type="number"
        placeholder={placeholder}
        {...props?.inputProps}
      ></NumberInputWrapper>
    );
  }
  if (type === "string") {
    const { textType = "short" } = valueDescriber as StringPropertyDescriber;
    if (textType === "short")
      return (
        <Input
          disabled={disabled}
          type="text"
          placeholder={placeholder}
          {...props?.inputProps}
        ></Input>
      );
    if (textType === "long") {
      return (
        <Input.TextArea
          disabled={disabled}
          placeholder={placeholder}
        ></Input.TextArea>
      );
    }
  }
  if (type === "file") {
    return (
      <QiniuUploader
        type={(valueDescriber as FilePropertyDescriber).fileType}
      ></QiniuUploader>
    );
  }
  if (type === "enum") {
    const { displayNameMapping } = valueDescriber as EnumPropertyDescriber<any>;
    return (
      <Select disabled={disabled} {...props?.selectProps}>
        {ObjectEntries(displayNameMapping).map(([optionKey, displayName]) => (
          <Select.Option value={+optionKey} key={+optionKey}>
            {displayName}
          </Select.Option>
        ))}
      </Select>
    );
  }
  throw new Error("Invalid parameters of getInputItem");
}

const NumberInputWrapper: React.FC<
  { onChange?: (value: number) => any } & Omit<InputProps, "onChange">
> = ({ value, onChange, ...props }) => {
  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        const value = +e.target.value || 0;
        onChange?.(value);
      }}
    ></Input>
  );
};

const SwitchWrapper: React.FC<
  { value?: boolean } & Omit<SwitchProps, "checked">
> = ({ value, ...others }) => {
  return <Switch checked={value} {...others}></Switch>;
};

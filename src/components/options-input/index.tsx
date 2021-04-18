import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input } from "antd";
import React from "react";
import { QuestionDisplayNameMapping } from "../../models";
import { InteractFactory } from "../../services";
import { ObjectEntries } from "../../utils/common";
import styles from "./style.module.css";

export interface IOptionsInputProp {
  disabled?: boolean;
  value?: Record<string, string>;
  onChange?: (record: Record<string, string>) => any;
}

export const OptionsInput: React.FC<IOptionsInputProp> = ({
  disabled,
  value = {},
  onChange = () => 0,
}) => {
  const options = ObjectEntries(value).sort(([a], [b]) =>
    a > b ? 1 : b > a ? -1 : 0
  );
  return (
    <>
      <Divider />
      {options.map(([option, text], index) => (
        <div key={index} className={styles["option-row"]}>
          <label>{option}</label>
          <Input
            disabled={disabled}
            value={text}
            onChange={(e) => {
              const newInput = e.target.value;
              e.stopPropagation();
              onChange({ ...value, [option]: newInput });
            }}
            placeholder={`请输入${QuestionDisplayNameMapping.options}`}
          ></Input>
          <Button
            disabled={disabled}
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
              if (options.length <= 1) {
                InteractFactory.getMessager().warning("至少一个选项");
                return;
              }
              const optionChars = alphabet(options.length - 1);
              let index = 0;
              onChange(
                options.reduce<Record<string, string>>(
                  (prev, [currentOption, text]) => {
                    if (currentOption !== option) {
                      prev[optionChars[index]!] = text;
                      index++;
                    }
                    return prev;
                  },
                  {}
                )
              );
            }}
          ></Button>
        </div>
      ))}
      <div>
        <Button
          disabled={disabled}
          block
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            if (options.length >= 26) {
              InteractFactory.getMessager().warning("选项过多");
              return;
            }
            onChange({ ...value, [nextChar(options.length)]: "" });
          }}
        >
          添加{QuestionDisplayNameMapping.options}
        </Button>
      </div>
      <Divider />
    </>
  );
};

function alphabet(count: number) {
  const result: string[] = [];
  const aCode = "A".charCodeAt(0);
  for (let i = 0; i < count; i++) {
    result.push(String.fromCharCode(aCode + i));
  }
  return result;
}

function nextChar(length: number) {
  return String.fromCharCode("A".charCodeAt(0) + length);
}

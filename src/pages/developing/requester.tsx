import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Select, Spin } from "antd";
import React, { useState } from "react";
import { axiosInstance } from "../../api";
import { CommonForm } from "../../components/common-form";
import styles from "../../components/options-input/style.module.css";
import { createDescriber } from "../../models/describer-factory";
import { ObjectEntries, pickKeyOf } from "../../utils/common";

enum RequestType {
  GET = 0,
  POST = 1,
}

const RequestTypeNameMapping: Record<RequestType, string> = {
  [RequestType.GET]: "GET",
  [RequestType.POST]: "POST",
};

interface RequestForm {
  method: RequestType;
  path: string;
  payload: Record<string, string | number>;
}

export const RequestFormComp: React.FC = () => {
  const [result, setResult] = useState<any>();
  const [requesting, setRequesting] = useState(false);
  return (
    <>
      <CommonForm
        describer={createDescriber<RequestForm>({
          displayNames: {
            method: "请求方法",
            path: "请求路径",
            payload: "请求参数",
          },
          modelName: "基于Axios的HTTP请求",
          primaryKey: "path",
          properties: {
            method: {
              propertyKey: "method",
              valueDescriber: {
                defaultValue: RequestType.GET,
                displayNameMapping: RequestTypeNameMapping,
                enumObject: RequestType,
                type: "enum",
              },
            },
            path: {
              propertyKey: "path",
              valueDescriber: {
                type: "string",
                defaultValue: "/api/pm/user/userInfo",
              },
            },
            payload: {
              propertyKey: "payload",
              // @ts-expect-error
              valueDescriber: { defaultValue: {}, type: "map" },
            },
          },
        })}
        customRenderer={{
          payload: {
            render({ key, value, describer }) {
              return (
                <Form.Item
                  key={key}
                  name={pickKeyOf<RequestForm>("payload")}
                  label={describer.displayNames.payload}
                >
                  <RecordInput value={value}></RecordInput>
                </Form.Item>
              );
            },
          },
        }}
        onSubmit={async (form: RequestForm) => {
          try {
            setRequesting(true);
            let result;
            switch (form.method) {
              case RequestType.GET:
                result = await axiosInstance.get(form.path, {
                  params: form.payload,
                });
                break;
              case RequestType.POST:
                result = await axiosInstance.post(form.path, form.payload);
                break;
              default:
                throw new Error("Invalid request type");
            }
            setResult(result.data);
          } catch (e) {
            setResult(e);
          } finally {
            setRequesting(false);
          }
        }}
      />
      <Spin spinning={requesting}>
        <label>请求结果</label>
        <pre>{JSON.stringify(result, undefined, 2)}</pre>
      </Spin>
    </>
  );
};

export interface IRecordInputProp {
  value?: Record<string, string | number>;
  onChange?: (record: Record<string, string | number>) => any;
}

export const RecordInput: React.FC<IRecordInputProp> = ({
  value = {},
  onChange = () => 0,
}) => {
  const options = ObjectEntries(value).sort(([a], [b]) =>
    a > b ? 1 : b > a ? -1 : 0
  );
  return (
    <>
      <Divider style={{ fontSize: 10, color: "gray" }}>使用列表输入</Divider>
      {options.map(([option, text], index) => {
        return (
          <div key={index} className={styles["option-row"]}>
            <label>键：</label>
            <Input
              value={option}
              onChange={(e) => {
                const newInput = e.target.value;
                e.stopPropagation();
                const newRecord = Object.assign({}, value);
                newRecord[newInput] = text;
                delete newRecord[option];
                onChange(newRecord);
              }}
              style={{ width: 80 }}
            ></Input>
            <label>值：</label>
            {typeof text === "string" ? (
              <Input
                value={text}
                onChange={(e) => {
                  const newInput = e.target.value;
                  e.stopPropagation();
                  onChange({ ...value, [option]: newInput });
                }}
              ></Input>
            ) : typeof text === "number" ? (
              <Input
                type="number"
                value={text}
                onChange={(e) => {
                  const newInput = e.target.value;
                  e.stopPropagation();
                  onChange({ ...value, [option]: +newInput });
                }}
              />
            ) : null}
            <Select
              style={{ width: 100 }}
              value={typeof text}
              onChange={(e) => {
                if (e === "number") {
                  let fieldValue = +value[option]!;
                  if (isNaN(fieldValue)) {
                    fieldValue = 0;
                  }
                  onChange({ ...value, [option]: fieldValue });
                }
                if (e === "string") {
                  onChange({ ...value, [option]: "" + value[option] });
                }
              }}
            >
              <Select.Option value="number">数字</Select.Option>
              <Select.Option value="string">字符串</Select.Option>
            </Select>
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                onChange(
                  options.reduce<Record<string, string | number>>(
                    (prev, [currentOption, text]) => {
                      if (currentOption !== option) {
                        prev[currentOption] = text;
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
        );
      })}
      <div>
        <Button
          block
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            const newRecord = { ...value, [`#${options.length}`]: "" };
            onChange(newRecord);
          }}
        >
          添加参数
        </Button>
      </div>
      <Divider style={{ fontSize: 10, color: "gray" }}>
        使用JSON字符串输入
      </Divider>
      <div>
        <Input.TextArea
          placeholder="输入参数JSON"
          value={JSON.stringify(value, undefined, 2)}
          onChange={(e) => {
            const text = e.target.value;
            try {
              const json = JSON.parse(text);
              onChange(json);
            } catch (error) {
              // No Operation
            }
          }}
        ></Input.TextArea>
      </div>
    </>
  );
};

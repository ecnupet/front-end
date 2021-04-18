import { Form, Popover, Select } from "antd";
import React from "react";
import { CRUDManager, processLongText } from "../../../components/crud-manager";
import { OptionsInput } from "../../../components/options-input";
import {
  NameOfQuestionType,
  QuestionDisplayNameMapping,
  QuestionType,
  SingleSelectQuestion,
  SingleSelectQuestionWithAnswer,
} from "../../../models";
import { createDescriber } from "../../../models/describer-factory";
import { BackendServiceFactory } from "../../../services";
import { ObjectEntries, ObjectKeys, pickKeyOf } from "../../../utils/common";

export const QuestionManage: React.FC = () => {
  return (
    <CRUDManager
      service={BackendServiceFactory.getCRUDService("Question")}
      describer={createDescriber<SingleSelectQuestionWithAnswer>({
        displayNames: QuestionDisplayNameMapping,
        modelName: "试题",
        primaryKey: "questionId",
        searchableKey: "description",
        properties: {
          description: {
            propertyKey: "description",
            valueDescriber: {
              defaultValue: "",
              type: "string",
              textType: "long",
            },
          },
          duration: {
            propertyKey: "duration",
            valueDescriber: { defaultValue: 10, type: "number" },
          },
          options: {
            propertyKey: "options",
            // @ts-expect-error
            valueDescriber: { defaultValue: {}, type: "map" },
          },
          questionId: {
            propertyKey: "questionId",
            valueDescriber: { defaultValue: -1, type: "number" },
          },
          type: {
            propertyKey: "type",
            valueDescriber: {
              defaultValue: QuestionType.InfectiousDisease,
              type: "enum",
              enumObject: QuestionType,
              displayNameMapping: NameOfQuestionType,
            },
          },
          answer: {
            propertyKey: "answer",
            valueDescriber: {
              defaultValue: "A",
              type: "string",
            },
          },
        },
      })}
      renderColumn={(model, fieldKey) => {
        if (fieldKey === "options") {
          return (
            <Popover
              content={ObjectEntries(model.options).map(
                ([option, text], index) => (
                  <p key={index}>
                    {option} {text}
                  </p>
                )
              )}
              trigger="hover"
            >
              {processLongText(
                ObjectEntries(model.options)
                  .map(([option, text]) => `${option}.${text}`)
                  .join(" ")
              )}
            </Popover>
          );
        }
        return undefined;
      }}
      formProps={{
        customRenderer: {
          options: {
            render({ describer, value, key }) {
              return (
                <Form.Item
                  key={key}
                  name={pickKeyOf<SingleSelectQuestion>("options")}
                  label={QuestionDisplayNameMapping.options}
                >
                  <OptionsInput
                    disabled={describer.properties.options.disabled}
                    value={value}
                  />
                </Form.Item>
              );
            },
          },
          answer: {
            render({ model, key }) {
              return (
                <Form.Item
                  key={key}
                  name={pickKeyOf<SingleSelectQuestionWithAnswer>("answer")}
                  label={QuestionDisplayNameMapping.answer}
                >
                  <Select>
                    {ObjectKeys(model.options ?? {}).map((option, index) => (
                      <Select.Option key={index} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            },
          },
        },
      }}
    ></CRUDManager>
  );
};

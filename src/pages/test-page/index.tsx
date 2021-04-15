import { Button } from "antd";
import React, { useState } from "react";
import {
  CRUDModal,
  Digital,
  Enum,
  Labeled,
  SingleSwitch,
  Text,
} from "../../components/crud-form";
import { ASPForm } from "../../components/forms/asp-form";
import { GinForm } from "../../components/forms/gin-form";
import { NameOfQuestionType, QuestionType } from "../../models";
export const TestPage: React.FC = () => {
  const [v, setV] = useState(false);
  return (
    <div>
      <ASPForm></ASPForm>
      <GinForm></GinForm>
      <Button
        onClick={() => {
          setV(true);
        }}
      >
        show crud
      </Button>
      {CRUDModal(
        { a: 1, b: "22", c: QuestionType.InfectiousDisease, d: true },
        {
          type: "create",
          modalName: "实例",
          fields: [
            Labeled({
              fieldKey: "a",
              field: Digital({ placeholder: "输入整数" }),
              label: "于a",
            }),
            Labeled({
              fieldKey: "b",
              field: Text({ placeholder: "文本" }),
              label: "哈哈",
            }),
            Labeled({
              fieldKey: "c",
              field: Enum({
                enumObj: QuestionType,
                nameMapping: NameOfQuestionType,
              }),
              label: "aaa",
            }),
            Labeled({ fieldKey: "d", label: "DD", field: SingleSwitch() }),
          ],
          handlers: {
            onCreate(m) {
              console.log("create", m);
            },
          },
          onClose() {
            setV(false);
          },
        },
        v
      )}
    </div>
  );
};

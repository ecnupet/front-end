import { Button } from "antd";
import React, { useState } from "react";
import { CommonForm } from "../../components/common-form";
import { ASPForm } from "../../components/forms/asp-form";
import { GinForm } from "../../components/forms/gin-form";
import { createDescriber } from "../../models/describer-factory";

enum Foo {
  bar = 1,
  baz = 2,
}

export const TestPage: React.FC = () => {
  const [, setV] = useState(false);
  return (
    <div>
      <ASPForm></ASPForm>
      <GinForm></GinForm>
      <CommonForm
        onSubmit={(form) => {
          console.log("submit");
          console.log(form);
        }}
        describer={createDescriber<{
          a: number;
          b: string;
          c: boolean;
          d: Foo;
        }>({
          modelName: "测试",
          displayNames: { a: "AAA", b: "BBB", c: "CCC", d: "DDD" },
          primaryKey: "a",
          searchableKey: "b",
          properties: {
            a: {
              propertyKey: "a",
              valueDescriber: { type: "number", defaultValue: 0 },
              required: true,
            },
            b: {
              propertyKey: "b",
              required: false,
              valueDescriber: { type: "string", defaultValue: "" },
            },
            c: {
              propertyKey: "c",
              required: true,
              valueDescriber: { type: "boolean", defaultValue: true },
            },
            d: {
              propertyKey: "d",
              valueDescriber: {
                type: "enum",
                enumObject: Foo,
                defaultValue: Foo.bar,
                displayNameMapping: { [Foo.bar]: "BAR", [Foo.baz]: "BAZ" },
              },
            },
          },
        })}
      ></CommonForm>
      <Button
        onClick={() => {
          setV(true);
        }}
      >
        show crud
      </Button>
    </div>
  );
};

import { Form } from "antd";
import React from "react";
import { PersonInfomation } from "../../../api";
import { CRUDManager } from "../../../components/crud-manager";
import { PasswordInput } from "../../../components/password-input";
import { createDescriber } from "../../../models/describer-factory";
import { BackendServiceFactory } from "../../../services";

export const UserManage: React.FC = () => {
  return (
    <CRUDManager
      describer={createDescriber<PersonInfomation>({
        displayNames: {
          authorization: "管理权限",
          id: "ID",
          userName: "用户名",
          password: "密码",
        },
        modelName: "用户信息",
        primaryKey: "id",
        searchableKey: "userName",
        properties: {
          id: {
            propertyKey: "id",
            valueDescriber: {
              defaultValue: -1,
              type: "number",
            },
          },
          userName: {
            propertyKey: "userName",
            valueDescriber: { type: "string", defaultValue: "" },
          },
          authorization: {
            propertyKey: "authorization",
            // @ts-expect-error
            valueDescriber: { type: "boolean", defaultValue: false },
          },
          password: {
            propertyKey: "password",
            valueDescriber: {
              // @ts-expect-error
              type: "array",
              defaultValue: [],
            },
            disabled: true,
          },
        },
      })}
      service={BackendServiceFactory.getCRUDService("UserService")}
      renderColumn={(model, fieldKey) => {
        if (fieldKey === "password") {
          return "*".repeat(~~(model[fieldKey].length / 2));
        }
        return null;
      }}
      formProps={{
        customRenderer: {
          password: {
            render({ fieldKey, describer }) {
              return (
                <Form.Item
                  name={fieldKey}
                  label={describer.displayNames.password}
                >
                  <PasswordInput />
                </Form.Item>
              );
            },
          },
        },
      }}
    ></CRUDManager>
  );
};

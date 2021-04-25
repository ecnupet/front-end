import React from "react";
import { ChargeProject } from "../../../api/info-manage";
import { CRUDManager } from "../../../components/crud-manager";
import { createDescriber } from "../../../models/describer-factory";
import { BackendServiceFactory } from "../../../services";

const ChargeProjectDisplayNames = {
  id: "ID",
  projectCharge: "费用",
  projectDescription: "项目描述",
  projectName: "项目名称",
};
export const ChargeProjectManage: React.FC = () => {
  return (
    <CRUDManager
      service={BackendServiceFactory.getCRUDService("ChargeProject")}
      describer={createDescriber<ChargeProject>({
        displayNames: ChargeProjectDisplayNames,
        modelName: "收费项目",
        primaryKey: "id",
        searchableKey: "projectName",
        properties: {
          id: {
            propertyKey: "id",
            valueDescriber: { type: "number", defaultValue: -1 },
          },
          projectCharge: {
            propertyKey: "projectCharge",
            valueDescriber: {
              type: "number",
              defaultValue: 0,
            },
          },
          projectDescription: {
            propertyKey: "projectDescription",
            valueDescriber: {
              type: "string",
              defaultValue: "",
              textType: "long",
            },
          },
          projectName: {
            propertyKey: "projectName",
            valueDescriber: { type: "string", defaultValue: "" },
          },
        },
      })}
    ></CRUDManager>
  );
};

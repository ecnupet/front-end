import React from "react";
import { Drug } from "../../../api/info-manage";
import { CRUDManager } from "../../../components/crud-manager";
import { DisplayNameMapping } from "../../../components/manage-table";
import { createDescriber } from "../../../models/describer-factory";
import { BackendServiceFactory } from "../../../services";

export const DrugManage: React.FC = () => {
  const displayNameMapping: DisplayNameMapping<Drug> = {
    iD: "ID",
    drugName: "药品名称",
    drugPrice: "药品价格",
    drugSave: "保存方法",
    drugUsage: "药品用途",
  };
  return (
    <CRUDManager
      service={BackendServiceFactory.getCRUDService("Drug")}
      describer={createDescriber<Drug>({
        displayNames: displayNameMapping,
        modelName: "药物",
        primaryKey: "iD",
        searchableKey: "drugName",
        properties: {
          drugName: {
            propertyKey: "drugName",
            valueDescriber: { defaultValue: "", type: "string" },
          },
          drugPrice: {
            propertyKey: "drugPrice",
            valueDescriber: { defaultValue: 1, type: "number" },
            validator: (value) => (value > 0 ? undefined : "价格必须为正数"),
          },
          drugSave: {
            propertyKey: "drugSave",
            valueDescriber: { defaultValue: "", type: "string" },
          },
          drugUsage: {
            propertyKey: "drugUsage",
            valueDescriber: {
              defaultValue: "",
              type: "string",
              textType: "long",
            },
          },
          iD: {
            propertyKey: "iD",
            valueDescriber: { defaultValue: -1, type: "number" },
          },
        },
      })}
    ></CRUDManager>
  );
};

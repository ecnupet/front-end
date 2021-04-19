import React from "react";
import { Drug } from "../../../api/info-manage";
import { CRUDManager } from "../../../components/crud-manager";
import { createDescriber } from "../../../models/describer-factory";
import { KeyOf } from "../../../models/model-describer";
import { BackendServiceFactory } from "../../../services";

export const DrugManage: React.FC = () => {
  const displayNameMapping: Record<KeyOf<Drug>, string> = {
    id: "ID",
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
        primaryKey: "id",
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
          id: {
            propertyKey: "id",
            valueDescriber: { defaultValue: -1, type: "number" },
          },
        },
      })}
    ></CRUDManager>
  );
};

import React from "react";
import { Drug } from "../../../api/info-manage";
import { Labeled, TextOrDigital } from "../../../components/crud-form";
import {
  DisplayNameMapping,
  ManageTable,
} from "../../../components/manage-table";
import { ObjectKeys } from "../../../utils/common";

export const DrugManage: React.FC = () => {
  const displayNameMapping: DisplayNameMapping<Drug> = {
    iD: "ID",
    drugName: "药品名称",
    drugPrice: "药品价格",
    drugSave: "保存方法",
    drugUsage: "药品用途",
  };
  return ManageTable("Drug", getDefaultDrug(), "iD", {
    columns: ObjectKeys(displayNameMapping).map((key) => ({
      dataIndex: key,
      title: displayNameMapping[key],
    })),
    modalName: "药品",
    fields: ObjectKeys(displayNameMapping).map((key) =>
      Labeled({
        label: displayNameMapping[key],
        fieldKey: key,
        formItemProps: {
          required: true,
          rules: [
            {
              validator(_, v, cb) {
                typeof v === "number" ? cb() : !v ? cb("此项不能为空") : cb();
              },
            },
          ],
        },
        field: TextOrDigital({
          placeholder: `请输入${displayNameMapping[key]}`,
          init: getDefaultDrug()[key],
        }),
      })
    ),
  });
};
function getDefaultDrug(): Drug {
  return {
    iD: 0,
    drugName: "",
    drugPrice: 0,
    drugSave: "",
    drugUsage: "",
  };
}

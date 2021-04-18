import { Modal } from "antd";
import React from "react";
import { ModelDescriber } from "../../models/model-describer";
import { ObjectEntries } from "../../utils/common";
import { CommonForm, ICommonFormProp } from "../common-form";

export type CRUD = "create" | "retrieve" | "update" | "delete";
export const TranslateCRUD: Record<CRUD, string> = {
  create: "创建",
  delete: "删除",
  retrieve: "查询",
  update: "更新",
};
export interface ICRUDModalProp<T extends object> {
  describer: ModelDescriber<T>;
  visable: boolean;
  type: CRUD;
  formProps?: Pick<ICommonFormProp<T>, "customRenderer" | "props">;
  onClose: () => void;
  onSumbit: (model: T, type: CRUD) => void;
}

export const CRUDModal: React.FC<ICRUDModalProp<any>> = <T extends object>({
  describer,
  onClose,
  onSumbit,
  visable,
  type,
  formProps,
}: React.PropsWithChildren<ICRUDModalProp<T>>) => {
  const desc = { ...describer };
  ObjectEntries(desc.properties).forEach(([key, prop]) => {
    desc.properties[key] = {
      ...prop,
      disabled:
        key === describer.primaryKey ||
        type === "delete" ||
        type === "retrieve",
    };
  });
  return (
    <Modal
      visible={visable}
      onCancel={onClose}
      title={`${TranslateCRUD[type]}${describer.modelName}`}
      forceRender
      getContainer={false}
      footer={false}
    >
      <CommonForm
        describer={desc}
        {...formProps}
        onSubmit={(form) => {
          onSumbit(form, type);
        }}
      ></CommonForm>
    </Modal>
  );
};

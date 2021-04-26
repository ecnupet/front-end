import { Table } from "antd";
import React from "react";
import { PersonInfomation } from "../../../api";
import { TableColumn } from "../../../components/crud-manager";
import { withType } from "../../../utils/common";
import { PickKey } from "../../../utils/types";

export type UserTableRecord = Omit<
  PersonInfomation,
  PickKey<PersonInfomation, "password">
>;

export const UserManage: React.FC = () => {
  return (
    <>
      <Table
        columns={[
          ...withType<TableColumn<UserTableRecord>[]>([
            {
              dataIndex: "id",
              title: "ID",
            },
            {
              dataIndex: "userName",
            },
            {
              dataIndex: "authorization",
            },
          ]),
          {
            key: "__operation__",
          },
        ]}
      ></Table>
    </>
  );
};

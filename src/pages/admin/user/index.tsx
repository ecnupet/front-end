import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Spin, Table, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { apiCaller, Auth, PersonInfomation } from "../../../api";
import { ResponseResultEnum } from "../../../api/info-manage";
import { TableColumn } from "../../../components/crud-manager";
import styles from "../../../components/crud-manager/style.module.css";
import { withType } from "../../../utils/common";
import { debounce } from "../../../utils/common/time";
import { usePage } from "../../../utils/hooks/use-page";
import { useRequest } from "../../../utils/hooks/use-request";
import { globalErrorHandle } from "../../../utils/services/global-error-handler";
import { PickKey } from "../../../utils/types";

export type UserTableRecord = Omit<
  PersonInfomation,
  PickKey<PersonInfomation, "password">
>;

export const NameOfAuth: Record<Auth, string> = {
  [Auth.Admin]: "管理员",
  [Auth.Normal]: "普通用户",
  [Auth.SuperAdmin]: "超级管理员",
};

export const UserManage: React.FC = () => {
  const [page, pageSize, count, setPageInfo] = usePage({
    page: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState("");
  const [tableData, tableRequestState] = useRequest(
    async (page: number, pageSize: number, keyword: string) => {
      try {
        const { data, state } = await apiCaller.get("/api/pm/admin/userlist", {
          page,
          pageSize,
          keyWord: keyword,
        });
        if (state === ResponseResultEnum.Success) {
          setPageInfo({ count: data.count });
          return data.records;
        }
      } catch (error) {
        globalErrorHandle(error);
      }
      return [];
    },
    [page, pageSize, keyword]
  );
  return (
    <>
      <Spin spinning={tableRequestState === "pending"}>
        <Tooltip overlay={`创建新用户`}>
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            type="primary"
            className={styles["create-button"]}
            onClick={() => {}}
          ></Button>
        </Tooltip>
        <Input
          className={styles["search-bar"]}
          suffix={<SearchOutlined />}
          placeholder={`搜索用户`}
          onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            setKeyword(e.target.value);
          }, 1000)}
        ></Input>

        <Table
          dataSource={tableData ?? []}
          pagination={{
            pageSize,
            current: page,
            total: count,
            onChange(page, pageSize) {
              setPageInfo({ page, pageSize });
            },
          }}
          columns={[
            ...withType<TableColumn<UserTableRecord>[]>([
              {
                dataIndex: "id",
                title: "ID",
              },
              {
                dataIndex: "userName",
                title: "用户名",
              },
              {
                dataIndex: "authorization",
                title: "权限",
                render(value: Auth) {
                  return <Tag>{NameOfAuth[value]}</Tag>;
                },
              },
            ]),
            {
              key: "__operation__",
              title: "操作",
              render() {
                return (
                  <>
                    <Button type="text">修改权限</Button>
                    <Button type="text">修改名称</Button>
                  </>
                );
              },
            },
          ]}
        ></Table>
      </Spin>
    </>
  );
};

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { withConfirm } from "antd/lib/modal/confirm";
import React, { useEffect, useState } from "react";
import {
  apiCaller,
  Auth,
  PersonAuthChangeForm,
  PersonCreateForm,
  PersonInfomation,
} from "../../../api";
import { ResponseResultEnum } from "../../../api/info-manage";
import { TableColumn } from "../../../components/crud-manager";
import styles from "../../../components/crud-manager/style.module.css";
import { InteractFactory } from "../../../services";
import {
  getPasswordNumberArray,
  ObjectEntries,
  pickKeyOf,
  withType,
} from "../../../utils/common";
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
  [Auth.Normal]: "普通用户",
  [Auth.Admin]: "后台管理员",
  [Auth.SuperAdmin]: "超级管理员",
};

export const UserManage: React.FC = () => {
  const [changeAuthModalVisable, setChangeAuthModalVisable] = useState(false);
  const [createUserModalVisable, setCreateUserModalVisable] = useState(false);
  const [user, setUser] = useState<UserTableRecord>();
  const [changeAuthForm] = Form.useForm<PersonAuthChangeForm>();
  const [createUserForm] = Form.useForm<PersonCreateForm>();
  const [page, pageSize, count, setPageInfo] = usePage({
    page: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    changeAuthForm.setFieldsValue({
      name: user?.userName,
      authorization: +(user?.authorization ?? 0),
    });
  }, [user, changeAuthForm]);
  const [tableData, tableRequestState, fetchTableData] = useRequest(
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

  const resetUserPassword = async (username: string) => {
    const { state, detail } = await apiCaller.post("/api/pm/admin/infochange", {
      name: username,
    });
    if (state === ResponseResultEnum.Success) {
      InteractFactory.getMessager().success(detail);
    } else {
      InteractFactory.getMessager().fail(detail);
    }
  };
  return (
    <>
      <Spin spinning={tableRequestState === "pending"}>
        <Tooltip overlay="创建新用户">
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            type="primary"
            className={styles["create-button"]}
            onClick={() => {
              setCreateUserModalVisable(true);
            }}
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
          rowKey={pickKeyOf<UserTableRecord>("id")}
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
              render(_, record) {
                return (
                  <>
                    <Button
                      type="text"
                      onClick={() => {
                        setChangeAuthModalVisable(true);
                        setUser(record);
                      }}
                    >
                      修改权限
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        Modal.confirm(
                          withConfirm({
                            async onOk() {
                              await resetUserPassword(record.userName);
                              fetchTableData();
                            },
                            title: "确认",
                            content: `确认重置用户 ${record.userName} 的密码吗？`,
                          })
                        );
                      }}
                    >
                      重置密码
                    </Button>
                  </>
                );
              },
            },
          ]}
        ></Table>
      </Spin>
      <Modal
        visible={changeAuthModalVisable}
        title="改变用户权限"
        forceRender
        onCancel={() => setChangeAuthModalVisable(false)}
        footer={false}
      >
        <Form
          form={changeAuthForm}
          onFinish={async (form) => {
            const { state, detail } = await apiCaller.post(
              "/api/pm/admin/infochange",
              form
            );
            if (state === ResponseResultEnum.Success) {
              InteractFactory.getMessager().success(detail);
              fetchTableData();
              setChangeAuthModalVisable(false);
            } else {
              InteractFactory.getMessager().fail(detail);
            }
          }}
        >
          <Form.Item
            name={pickKeyOf<PersonAuthChangeForm>("name")}
            label="用户名"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            required
            label="权限"
            rules={[{ required: true, message: "请选择权限" }]}
            getValueFromEvent={(e) => {
              return +e;
            }}
            name={pickKeyOf<PersonAuthChangeForm>("authorization")}
          >
            {renderAuthInput()}
          </Form.Item>
          <Form.Item>
            <Button style={{ float: "right" }} type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={createUserModalVisable}
        onCancel={() => setCreateUserModalVisable(false)}
        forceRender
        title="创建新用户"
        footer={false}
      >
        <Form
          form={createUserForm}
          onFinish={async (form) => {
            form.password = await getPasswordNumberArray(
              // @ts-expect-error
              form.password as string
            );
            const { detail, state } = await apiCaller.post(
              "/api/pm/admin/personcreate",
              form
            );
            if (state === ResponseResultEnum.Success) {
              InteractFactory.getMessager().success(detail);
              fetchTableData();
            } else {
              InteractFactory.getMessager().fail(detail);
            }
          }}
        >
          <Form.Item
            name={pickKeyOf<PersonCreateForm>("name")}
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name={pickKeyOf<PersonCreateForm>("password")}
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name={pickKeyOf<PersonCreateForm>("authorization")}
            label="权限"
            rules={[{ required: true, message: "请选择权限" }]}
          >
            {renderAuthInput()}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ float: "right" }}>
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
function renderAuthInput() {
  return (
    <Select>
      {ObjectEntries(NameOfAuth).map(([auth, name], i) => (
        <Select.Option key={i} value={+auth}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
}

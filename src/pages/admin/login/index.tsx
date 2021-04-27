import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { Center } from "../../../components/center";
import { NavBar } from "../../../components/nav-bar";
import { router } from "../../../routes";
import { BackendServiceFactory, InteractFactory } from "../../../services";
import { globalStore } from "../../../store";
import { pickKeyOf } from "../../../utils/common/string";
import { globalErrorHandle } from "../../../utils/services/global-error-handler";
import styles from "./style.module.css";

interface AdminLoginForm {
  username: string;
  password: string;
}

export const AdminLogin: React.FC = () => {
  const [form] = Form.useForm<AdminLoginForm>();
  useEffect(() => {
    if (globalStore.user.userName) {
      router.replace("/admin/home");
    }
  }, []);
  return (
    <div>
      <NavBar title="后台管理">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Button
            type="text"
            style={{ color: "#3b9ffd" }}
            onClick={() => {
              router.replace("/login");
            }}
          >
            普通登录
          </Button>
        </div>
      </NavBar>
      <Center className={styles["login-form"]}>
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              const service = BackendServiceFactory.getPersionManageService();
              const result = await service.login({
                uid: values.username,
                password: values.password,
              });
              const rights = await service.userInfo();
              if (rights.data.authorization) {
                InteractFactory.getMessager().success(result.detail);
                router.replace("/admin/home");
              } else {
                InteractFactory.getMessager().fail("您不是管理员");
              }
            } catch (error) {
              globalErrorHandle(error);
            }
          }}
        >
          <Form.Item>
            <Center>
              <LockOutlined className={styles.lock} />
            </Center>
          </Form.Item>
          <Form.Item label="账号" name={pickKeyOf<AdminLoginForm>("username")}>
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item label="口令" name={pickKeyOf<AdminLoginForm>("password")}>
            <Input type="password"></Input>
          </Form.Item>
          <Form.Item>
            <Center>
              <Button htmlType="submit" type="primary">
                登录
              </Button>
            </Center>
          </Form.Item>
        </Form>
      </Center>
    </div>
  );
};

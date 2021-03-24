import { Button, Form, FormInstance, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React from "react";
import { Center } from "../../components/center";
import { useService } from "../../utils/hooks";
import { LoginForm, LoginService } from "./service";
import styles from "./style.module.css";
import { mergeClassName } from "../../utils/ui/class-name";
import { globalCss } from "../../utils/ui/global-css";
import { Observer } from "mobx-react-lite";
export const LoginPage: React.FC = () => {
  const service = useService(LoginService);
  const [form] = Form.useForm<LoginForm>();
  return (
    <Center className={styles.page}>
      <div className={styles["page-title"]}>宠物医院学习系统</div>
      <div
        className={mergeClassName(
          styles["pet-background"],
          globalCss("center-column")
        )}
      >
        <Center className={styles["form-block"]}>
          {renderForm(form, service)}
        </Center>
      </div>
    </Center>
  );
};

const renderForm = (form: FormInstance<LoginForm>, service: LoginService) => {
  return (
    <Form
      className={styles["login-form"]}
      initialValues={{ remember: true }}
      onFinish={service.handleSubmit}
      form={form}
    >
      <Form.Item>
        <Observer>
          {() => (
            <label className={styles["login-title"]}>
              {service.isLogin ? "登录您的账号" : "注册新账号"}
            </label>
          )}
        </Observer>
      </Form.Item>
      <Form.Item
        name="uid"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Observer>
          {() => (
            <>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: "100%" }}
              >
                {service.isLogin ? "登录" : "注册"}
              </Button>
              {service.isLogin ? "没有" : "已有"}
              账号？
              <Button type="link" onClick={service.handleChangeFormType}>
                {service.isLogin ? "注册一个" : "立即登录"}
              </Button>
            </>
          )}
        </Observer>
      </Form.Item>
    </Form>
  );
};

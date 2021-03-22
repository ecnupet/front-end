import { Button, Form, Input } from "antd";
import Password from "antd/lib/input/Password";
import React from "react";
import { useService } from "../../utils/hooks";
import { LoginForm, LoginService } from "./service";
import classes from "./style.module.css";
export const LoginPage: React.FC = () => {
  const service = useService(LoginService);
  const [form] = Form.useForm<LoginForm>();
  //   service.useForm(form);
  return (
    <div className={classes["login-form"]}>
      <Form
        form={form}
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        onFinish={service.onSubmit}
        initialValues={{
          uid: 1,
          password: 2,
        }}
      >
        <Form.Item label="用户名" name="uid">
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Password />
        </Form.Item>
        <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 } }}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

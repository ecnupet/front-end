import { Button, Form } from "antd";
import React from "react";
import { ASPForm } from "../../components/forms/asp-form";
import { GinForm } from "../../components/forms/gin-form";
import { QiniuUploader } from "../../components/uploader";

export const TestPage: React.FC = () => {
  const [form] = Form.useForm<{ image: string }>();
  return (
    <div>
      <ASPForm></ASPForm>
      <GinForm></GinForm>
      <Form form={form} onFinish={(f) => console.log(f)}>
        <Form.Item name="image">
          <QiniuUploader type={"image"}></QiniuUploader>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

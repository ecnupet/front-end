import React, { useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { Button, Form, Spin, Upload } from "antd";
import styles from "./style.module.css";
import { globalErrorHandle } from "../../../utils/services/global-error-handler";
import { axiosInstance } from "../../../api";

interface IGinForm {
  file: File;
}

export const GinForm: React.FC = () => {
  // 表单对象，传给Form的form
  const [form] = useForm<IGinForm>();
  // 组件状态，第一个是当前状态，第二个是设置状态的set函数，修改状态必须通过set函数，直接修改不会触发组件重渲染
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <p className={styles.title}>Gin Form</p>
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={async (form) => {
            // 提交表单的回调函数
            console.log(form);
            try {
              setLoading(true);
              // GET请求，参数传给对象params属性
              // const result = await axiosInstance.get<IAdminLoginResult>("https://backend.ecnu.space/api/pm/user/login", { params: form });
              // POST请求，参数直接传
              const result = await axiosInstance.post("/api/tl/quiz", {});
              console.log(result);
            } catch (error) {
              globalErrorHandle(error);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            name="file"
            label="文件"
            getValueFromEvent={(e) => {
              return e.file;
            }}
          >
            <Upload
              beforeUpload={(file, fileList) => {
                console.log(file, fileList);
                return false;
              }}
            >
              <Button>点击选择文件上传</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            {/* 提交表单的按钮需要指定htmlType为submit */}
            <Button htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

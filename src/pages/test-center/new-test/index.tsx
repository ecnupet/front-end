import { Button, Form, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import { QuestionType } from "../../../models";
import { useService } from "../../../utils/hooks";
import { NewTestForm, NewTestService } from "./service";
import styles from "./style.module.css";

export const NewTestPage: React.FC = () => {
  const [form] = useForm<NewTestForm>();
  const service = useService(NewTestService);
  return (
    <section>
      <header className={styles.header}>开始新测试</header>
      <main className={styles.main}>
        <Form
          form={form}
          onFinish={(form) =>
            service.handleCreateNewTest({
              types: (form.types ?? []).map((type) => +type),
            })
          }
        >
          <Form.Item label="选择分类" name="types" required>
            <Select
              size="large"
              mode="tags"
              showSearch={true}
              options={service.allTypes.map((type) => ({
                label: QuestionType[type],
                value: type.toString(),
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              开始考试
            </Button>
          </Form.Item>
        </Form>
      </main>
      <footer className={styles.footer}>
        选择题目分类和后点击开始考试，系统将会生成一份试卷，并开始计时。
      </footer>
    </section>
  );
};

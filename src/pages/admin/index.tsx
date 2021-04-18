import { Menu } from "antd";
import React, { useState } from "react";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { renderHeader } from "../test-center";
import { DrugManage } from "./drug";
import { QuestionManage } from "./question";
import styles from "./style.module.css";

const subRoutes: {
  title: string;
  component: React.ComponentType;
  key: string;
}[] = [
  { title: "药品管理", key: "drug", component: DrugManage },
  { title: "试题管理", key: "question", component: QuestionManage },
];

export const AdminHomePage: React.FC = () => {
  const [route, setRoute] = useState(subRoutes[0]!);
  return (
    <ManageStyleLayout title="管理后台" headerChildren={renderHeader()}>
      <section className={styles.section}>
        <aside className={styles.menu}>
          <Menu
            selectedKeys={[route.key]}
            onSelect={(info) => {
              setRoute(subRoutes.find((route) => route.key === info.key)!);
            }}
          >
            {subRoutes.map((route) => (
              <Menu.Item key={route.key}>{route.title}</Menu.Item>
            ))}
          </Menu>
        </aside>
        <main className={styles.main}>
          <route.component />
        </main>
      </section>
    </ManageStyleLayout>
  );
};

import { Divider, Layout, Menu } from "antd";
import React from "react";
import styles from "./style.module.css";

export const TestCenterPageLayout: React.FC = (prop) => {
  return (
    <Layout className={styles.layout}>
      <Layout.Header>
        <div className={styles.logo} />
        <Menu theme="dark" mode="horizontal">
          <span className={styles.title}>试题中心</span>
        </Menu>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        <Divider></Divider>
        <div className={styles["site-layout-content"]}>{prop.children}</div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        ECNU Pet ©2021 Powered by Ant Design
      </Layout.Footer>
    </Layout>
  );
};

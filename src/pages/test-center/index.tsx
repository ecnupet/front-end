import { Menu } from "antd";
import React from "react";
import { AccessManage } from "../../components/access-manage";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { RoutePaths, router } from "../../route";
import { mergeClassName } from "../../utils/ui/class-name";
import { globalCss } from "../../utils/ui/global-css";
import styles from "./style.module.css";

const subRoutes: Array<{
  path: RoutePaths;
  title: string;
}> = [
  {
    path: "/test-center/new-test",
    title: "开始测验",
  },
  {
    path: "/test-center/my-tests",
    title: "我的测试",
  },
  {
    path: "/test-center/statistics",
    title: "数据统计",
  },
];

function renderHeader() {
  return (
    <div className={styles["rest-header"]}>
      <AccessManage></AccessManage>
    </div>
  );
}

export const TestCenterPage: React.FC = (prop) => {
  return (
    <ManageStyleLayout title="试题中心" headerChildren={renderHeader()}>
      <section className={mergeClassName(styles.section, globalCss("rest"))}>
        <aside
          className={mergeClassName(styles.aside, globalCss("full-height"))}
        >
          <Menu className={styles.menu}>
            {subRoutes.map((route) => (
              <Menu.Item
                key={route.path}
                onClick={() => router.push(route.path)}
              >
                {route.title}
              </Menu.Item>
            ))}
          </Menu>
        </aside>
        <main className={mergeClassName(styles.main, globalCss("rest"))}>
          {prop.children}
        </main>
      </section>
    </ManageStyleLayout>
  );
};

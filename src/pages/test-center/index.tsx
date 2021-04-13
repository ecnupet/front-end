import { Menu } from "antd";
import { Observer } from "mobx-react-lite";
import React from "react";
import { AccessManage } from "../../components/access-manage";
import { BackToHome } from "../../components/back-to-home";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { UserCenter } from "../../components/user-center";
import { RoutePaths } from "../../routes";
import { globalStore } from "../../store";
import { useService } from "../../utils/hooks";
import { mergeClassName } from "../../utils/ui/class-name";
import { globalCss } from "../../utils/ui/global-css";
import { TestCenterService } from "./service";
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

export function renderHeader() {
  return (
    <div className={styles["rest-header"]}>
      <AccessManage />
      <UserCenter />
    </div>
  );
}

export const TestCenterPage: React.FC = (prop) => {
  const service = useService(TestCenterService);
  return (
    <ManageStyleLayout title="试题中心" headerChildren={renderHeader()}>
      <section className={mergeClassName(styles.section, globalCss("rest"))}>
        <aside
          className={mergeClassName(styles.aside, globalCss("full-height"))}
        >
          <Observer>
            {() => (
              <Menu
                className={styles.menu}
                selectedKeys={[globalStore.route.path]}
              >
                {subRoutes.map((route) => (
                  <Menu.Item
                    key={route.path}
                    onClick={() => service.switchTo(route.path)}
                  >
                    {route.title}
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </Observer>
        </aside>
        <main className={mergeClassName(styles.main, globalCss("rest"))}>
          {prop.children}
        </main>
      </section>
      <BackToHome></BackToHome>
    </ManageStyleLayout>
  );
};

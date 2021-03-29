import React from "react";
import Sider from "antd/lib/layout/Sider";
import { Menu } from "antd";

export const TestCenter: React.FC = () => {
  return (
    <div>
      <Sider>
        <Menu>
          <Menu.Item>开始考试</Menu.Item>
          <Menu.Item>考试记录</Menu.Item>
          <Menu.Item>成绩统计</Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};

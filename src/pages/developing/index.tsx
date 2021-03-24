import React from "react";
import { Spin } from "antd";
import { Center } from "../../components/center";

export const DevelopingPage: React.FC = () => (
  <Center>
    <Spin>
      <div style={{ width: 1000, height: 1000, fontSize: 100 }}>前端摸鱼中</div>
    </Spin>
  </Center>
);

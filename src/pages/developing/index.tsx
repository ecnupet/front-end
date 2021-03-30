import React from "react";
import { Button, Spin } from "antd";
import { Center } from "../../components/center";
import axios from "axios";
import { apiCaller } from "../../api";
import { router } from "../../routes";
// import { router } from "../../route";

export const DevelopingPage: React.FC = () => (
  <Center style={{ flexDirection: "column" }}>
    <Button
      onClick={async () => {
        try {
          const result = await apiCaller.post(
            "/api/pm/user/logout",
            undefined as never
          );
          console.log(result);
          router.replace("/login");
        } catch (error) {
          (window as any).err = error;
          console.log(error);
        }
        // router.replace("/login")
      }}
    >
      退出登录
    </Button>
    <Button
      onClick={() => {
        /*
        axios.options("http://localhost:5000").then((res) => {
          console.log(res.headers);
        });
        //*/
        axios.defaults.headers = {
          // "Access-Controll-Allow-Origin": "*",
          // "Access-Control-Allow-Headers":"Authorization,Origin,X-Requested-With,Content-Type,Accept,Referer",
          "Content-Type": "application/json",
        };
        const userInfo = {
          name: "test1",
          password: [1],
        };
        //*
        axios
          .post("https://localhost:5001/api/user/login", userInfo)
          .then((res) => {
            console.log(res.data);
            console.log(res.headers);
          })
          .catch(console.error);
        //*/
      }}
    >
      测试按钮
    </Button>
    <Spin>
      <div style={{ width: 1000, height: 1000, fontSize: 100 }}>前端摸鱼中</div>
    </Spin>
  </Center>
);

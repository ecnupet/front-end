import { Button } from "antd";
import React, { useState } from "react";
import { axiosInstance, baseURLs } from "../../api";
import { Center } from "../../components/center";
import * as qiniu from "qiniu-js";
import { ConfigForm } from "../../components/config-form";
import { configStore } from "../../store/config";
import { Observer } from "mobx-react-lite";
import { router } from "../../routes";
export const DevelopingPage: React.FC = () => {
  const [file, setFile] = useState("");
  return (
    <Center style={{ flexDirection: "column" }}>
      <h1>开发者专用页面</h1>
      <div>
        <div>
          <Button
            onClick={() => {
              router.goBack();
            }}
          >
            返回上页
          </Button>
          <Button
            onClick={() => {
              router.replace("/");
            }}
          >
            回首页
          </Button>
        </div>
        <div>
          <input
            type="file"
            value={file}
            onChange={function (e) {
              // @ts-ignore
              window.t = e.target.files[0];
              setFile(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              console.log(qiniu);
              // @ts-expect-error
              const file: File = window.t;
              const response =
                // {
                //   token:
                //     "zw2vHSsFk9wFKgUNmbOmopCR757f0SQB18G0tgwI:npPvVQR6r6CNYJeTIw8lm22WrV8=:eyJzY29wZSI6ImVjbnVwZXQ6MTIzLmpwZyIsImRlYWRsaW5lIjoxNjE3MjEyMzg0LCJjYWxsYmFja1VybCI6Imh0dHA6Ly9lY251LnNwYWNlL2FwaS9xaW5pdS9ub3RpZnkiLCJjYWxsYmFja0JvZHkiOiJrZXk9JChrZXkpXHUwMDI2aGFzaD0kKGV0YWcpXHUwMDI2YnVja2V0PSQoYnVja2V0KVx1MDAyNmZzaXplPSQoZnNpemUpXHUwMDI2bmFtZT0kKHg6bmFtZSkifQ==",
                // };
                await axiosInstance.get(
                  "https://backend.ecnu.space/api/qiniu/image_token",
                  {
                    params: {
                      filename: file.name,
                    },
                  }
                );
              console.log(response);
              const ob = qiniu.upload(file, "123.jpg", response.data.token);
              const uploadResult = await new Promise<any>((resolve, reject) => {
                ob.subscribe({
                  next() {
                    //@ts-ignore
                    console.log(arguments);
                  },
                  complete() {
                    // @ts-ignore
                    resolve(arguments);
                  },
                  error() {
                    // @ts-ignore
                    reject(arguments);
                  },
                });
              });
              console.log(uploadResult);
            }}
          >
            测试上传文件到七牛云
          </Button>
        </div>
      </div>
      <div>
        <p>配置选项</p>
        <Button
          onClick={() => {
            console.log(configStore);
            configStore.cleanUp();
          }}
        >
          重置配置
        </Button>
        <Observer>
          {() => (
            <ConfigForm
              config={configStore.config}
              onChange={(config) => {
                configStore.updateConfig(config);
              }}
              configOptions={{
                baseURL: {
                  displayName: "请求基路径",
                  stringEnums: baseURLs,
                },
                mockUserName: {
                  displayName: "临时接入的用户名（请求参数）",
                  stringEnums: ["Darren"],
                },
                enableGlobalMock: {
                  displayName: "使用Mock数据",
                },
                logDetails: {
                  displayName: "输出Mock调用API的日志",
                },
                mockRequestDuration: {
                  displayName: "Mock请求模拟延迟（秒）",
                },
              }}
            ></ConfigForm>
          )}
        </Observer>
      </div>
    </Center>
  );
};

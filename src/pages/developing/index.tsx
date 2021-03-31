import { Button, AutoComplete, Switch } from "antd";
import React, { useState } from "react";
import { axiosInstance } from "../../api";
import { Center } from "../../components/center";
import { router } from "../../routes";
import * as qiniu from "qiniu-js";
import { getGlobalServiceType, setGlobalServiceType } from "../../services";
import { ConfigForm } from "../../components/config-form";
import { configStore } from "../../store/config";
export const DevelopingPage: React.FC = () => {
  const [baseURL, setBaseURL] = useState(axiosInstance.defaults.baseURL);
  const [baseURLInput, setBaseURLInput] = useState("");
  const [globalMock, setGlobalMock] = useState(
    getGlobalServiceType() === "mock"
  );
  const [globalBackend, setGlobalBackend] = useState(
    getGlobalServiceType() === "real"
  );
  const [file, setFile] = useState("");
  return (
    <Center style={{ flexDirection: "column" }}>
      <h1>开发者专用页面</h1>
      <div>
        <Button
          onClick={() => {
            router.goBack();
          }}
        >
          回到前一页
        </Button>
        <Button
          onClick={() => {
            router.push("/");
          }}
        >
          首页
        </Button>
      </div>
      <div>
        <p>BaseURL</p>
        <div>
          当前的baseURL:<span style={{ color: "red" }}>{baseURL || "空"}</span>
        </div>
        <Button
          onClick={() => {
            setBaseURL(baseURLInput);
            axiosInstance.defaults.baseURL = baseURLInput;
          }}
        >
          切换BaseURL
        </Button>
        <AutoComplete
          style={{ width: 200 }}
          value={baseURLInput}
          onChange={(value) => {
            setBaseURLInput(value);
          }}
          onSelect={(value) => {
            setBaseURLInput(value);
          }}
          options={[
            {
              value: "https://backend.ecnu.space",
            },
            {
              value: "http://localhost:5000",
            },
            {
              value: "https://localhost:5001",
            },
          ]}
        ></AutoComplete>
      </div>
      <div>
        <p>数据mock</p>
        <div>
          开启全局mock
          <Switch
            checked={globalMock}
            onChange={(e) => {
              setGlobalMock(e);
              if (e) {
                setGlobalServiceType("mock");
                setGlobalBackend(false);
              }
            }}
          ></Switch>
        </div>
        <div>
          开启全局接入服务端
          <Switch
            checked={globalBackend}
            onChange={(e) => {
              setGlobalBackend(e);
              if (e) {
                setGlobalServiceType("real");
                setGlobalMock(false);
              }
            }}
          ></Switch>
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
        <p>其他配置</p>
        <ConfigForm
          config={configStore.config}
          onChange={(config) => {
            configStore.updateConfig(config);
          }}
        ></ConfigForm>
      </div>
    </Center>
  );
};

import { Button, Modal } from "antd";
import React, { useState } from "react";
import { axiosInstance, baseURLs } from "../../api";
import { Center } from "../../components/center";
import * as qiniu from "qiniu-js";
import { ConfigForm } from "../../components/config-form";
import { configStore } from "../../store/config";
import { Observer } from "mobx-react-lite";
import { router } from "../../routes";
import { RequestFormComp } from "./requester";
import { InteractFactory } from "../../services";
export const DevelopingPage: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [v, setV] = useState(false);
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
          <Button
            danger={true}
            onClick={() => {
              router.push("/test-page");
            }}
          >
            组件测试页面
          </Button>
        </div>
        <div>
          <input
            type="file"
            onChange={function (e) {
              // @ts-ignore
              setFile(e.target.files?.[0]);
            }}
          />
          <Button
            onClick={async () => {
              const key = file!.name;
              console.log(key);
              const response = await axiosInstance.get("/api/qiniu/uptoken", {
                params: {
                  filename: key,
                },
              });
              const token = response.data.token;
              console.log(token);
              const ob = qiniu.upload(file!, key, token);
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
              InteractFactory.getMessager().success(
                "上传成功！" + JSON.stringify(uploadResult)
              );
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
        <Button onClick={() => setV(true)}>发起测试请求</Button>
        <Modal
          style={{ width: 1000 }}
          visible={v}
          forceRender
          title="发起测试请求"
          footer={false}
          onCancel={() => setV(false)}
        >
          <RequestFormComp></RequestFormComp>
        </Modal>
      </div>
    </Center>
  );
};

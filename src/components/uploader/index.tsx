import { Button, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import * as qiniu from "qiniu-js";
import { axiosInstance } from "../../api";
import styles from "./style.module.css";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";
import { InteractFactory } from "../../services";
import { configStore } from "../../store/config";
import { wait } from "../../utils/common/time";
import { FileTypes } from "../../models/model-describer";

export interface IQiniuUploaderProp {
  type: FileTypes;
  value?: string;
  onChange?: (fileURL?: string) => any;
}

export const QiniuUploader: React.FC<IQiniuUploaderProp> = ({
  onChange,
  value,
  type,
}) => {
  const [previewFile, setPreviewFile] = useState<string>();
  const [previewing, setPreviewing] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    setFileList(
      // @ts-expect-error
      [value]
        .filter((url): url is string => !!url)
        .map((url, index) => ({
          uid: `${index}`,
          name: url,
          status: "done",
          url,
        }))
    );
  }, [value]);
  return (
    <>
      {type === "image" && (
        <Upload
          name="avatar"
          className={styles["avatar-uploader"]}
          listType="picture-card"
          fileList={fileList}
          onPreview={(file) => {
            console.log(file);
            setPreviewing(true);
            setPreviewFile(file.url);
          }}
          onRemove={(file) => {
            setFileList(fileList.filter((f) => f.uid !== file.uid));
            onChange?.();
          }}
          customRequest={async (e) => {
            const { file } = e;
            const {
              data: { path, token },
            } = await axiosInstance.get<{ token: string; path: string }>(
              "/api/qiniu/uptoken"
            );

            if (file) {
              const observable = qiniu.upload(file as File, path, token);
              observable.subscribe({
                async complete() {
                  if (configStore.getConfig("enableGlobalMock")) {
                    await wait(configStore.getConfig("mockRequestDuration"));
                  }
                  onChange?.(`https://cdn.ecnu.space/${path}`);
                },
                error(err) {
                  InteractFactory.getMessager().internalError("图片上传失败！");
                  console.error(err);
                },
                next(progress) {
                  console.log("progress", progress.total.percent);
                  setFileList([
                    // @ts-expect-error
                    {
                      uid: `${fileList.length + 1}`,
                      status: "uploading",
                      percent: progress.total.percent,
                      size: progress.total.size,
                    },
                  ]);
                },
              });
            }
          }}
        >
          {fileList.length > 0 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          )}
        </Upload>
      )}
      {type === "video" && (
        <Upload
          name="avatar"
          className={styles["avatar-uploader"]}
          listType="text"
          fileList={fileList}
          onPreview={(file) => {
            console.log(file);
            setPreviewing(true);
            setPreviewFile(file.url);
          }}
          onRemove={(file) => {
            setFileList(fileList.filter((f) => f.uid !== file.uid));
            onChange?.();
          }}
          customRequest={async (e) => {
            const { file } = e;
            const {
              data: { path, token },
            } = await axiosInstance.get<{ token: string; path: string }>(
              "/api/qiniu/uptoken"
            );

            if (file) {
              const observable = qiniu.upload(file as File, path, token);
              observable.subscribe({
                async complete() {
                  if (configStore.getConfig("enableGlobalMock")) {
                    await wait(configStore.getConfig("mockRequestDuration"));
                  }
                  onChange?.(`https://cdn.ecnu.space/${path}`);
                },
                error(err) {
                  InteractFactory.getMessager().internalError("视频上传失败！");
                  console.error(err);
                },
                next(progress) {
                  console.log("progress", progress.total.percent);
                  setFileList([
                    // @ts-expect-error
                    {
                      uid: `${fileList.length + 1}`,
                      status: "uploading",
                      percent: progress.total.percent,
                      size: progress.total.size,
                    },
                  ]);
                },
              });
            }
          }}
        >
          {fileList.length > 0 ? null : (
            <div>
              <Button icon={<UploadOutlined />}>上传视频</Button>
            </div>
          )}
        </Upload>
      )}
      <Modal
        footer={false}
        visible={previewing}
        onCancel={() => {
          setPreviewing(false);
        }}
      >
        {type === "image" && (
          <img alt="preview" className={styles.preview} src={previewFile} />
        )}
        {type === "video" && (
          <video className={styles.preview} controls>
            <source src={previewFile}></source>
          </video>
        )}
      </Modal>
    </>
  );
};

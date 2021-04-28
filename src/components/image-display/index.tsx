import { PictureOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React, { useState } from "react";
import styles from "./style.module.css";

export interface IImageDisplayProp {
  width: number;
  height: number;
  url: string | undefined | null;
}

export const ImageDisplay: React.FC<IImageDisplayProp> = ({
  height,
  width,
  url,
}) => {
  const [preview, setPreview] = useState(false);
  return (
    <div
      style={{ height, width }}
      className={!url ? styles.container : undefined}
    >
      {!!url ? (
        <img
          src={url}
          alt="display"
          className={styles.image}
          onClick={() => setPreview(true)}
        />
      ) : (
        <div className={styles.placeholder} style={{ fontSize: width / 3 }}>
          <PictureOutlined />
        </div>
      )}
      <Modal
        visible={preview}
        footer={false}
        onCancel={() => setPreview(false)}
        title="预览"
      >
        <img
          src={url ?? undefined}
          alt="display"
          className={styles.preview}
        ></img>
      </Modal>
    </div>
  );
};

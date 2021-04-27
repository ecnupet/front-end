import { Row, Typography } from "antd";
import React from "react";
import { RoomProcess } from "../../api/info-manage";
import styles from "./style.module.css";

export interface IProgressDisplayProp {
  process: RoomProcess;
}

export const ProgressDisplay: React.FC<IProgressDisplayProp> = ({
  process: { process, name, image, video },
}) => {
  return (
    <div>
      <Typography.Title level={3}>{name}</Typography.Title>
      <Typography.Title level={4}>介绍</Typography.Title>
      <div className={styles.introduce}>
        <pre>{process}</pre>
        <img className={styles.image} src={image} alt="introduction" />
      </div>
      {!!video && (
        <>
          <Typography.Title level={4}>视频资源</Typography.Title>
          <video className={styles.video} controls src={video}></video>
        </>
      )}
      <Row></Row>
    </div>
  );
};

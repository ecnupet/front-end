import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./style.module.css";

export interface IBooleanDisplayProp {
  value: boolean;
}

export const BooleanDisplay: React.FC<IBooleanDisplayProp> = ({ value }) => {
  return value ? (
    <CheckCircleOutlined className={styles.truthy} />
  ) : (
    <CloseCircleOutlined className={styles.falsy} />
  );
};

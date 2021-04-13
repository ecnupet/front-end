import { HomeFilled } from "@ant-design/icons";
import React from "react";
import { router } from "../../routes";
import { Center } from "../center";
import styles from "./style.module.css";

export const BackToHome: React.FC = () => {
  return (
    <Center
      className={styles["back-to-home"]}
      onClick={() => {
        router.replace("/home");
      }}
    >
      <HomeFilled />
    </Center>
  );
};

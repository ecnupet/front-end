import { Observer } from "mobx-react-lite";
import React from "react";
import { globalStore } from "../../store";
import styles from "./style.module.css";

export const UserCenter: React.FC = () => {
  return (
    <Observer>
      {() => {
        const { userName } = globalStore.user;
        return userName ? (
          <>
            <span className={styles["logged-in"]}>欢迎，{userName}</span>
          </>
        ) : (
          <div className={styles["not-logged-in"]}>未登录</div>
        );
      }}
    </Observer>
  );
};

import { Observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { globalStore } from "../../store";
import styles from "./style.module.css";

export const UserCenter: React.FC = () => {
  useEffect(() => {
    !globalStore.user.userName && globalStore.user.fetch();
  });
  return (
    <Observer>
      {() => {
        const { userName } = globalStore.user;
        return userName ? (
          <div className={styles["logged-in"]}>欢迎，{userName}</div>
        ) : (
          <div className={styles["not-logged-in"]}>未登录</div>
        );
      }}
    </Observer>
  );
};

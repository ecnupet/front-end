import React from "react";
import { Center } from "../center";
import { PandaSvg } from "../panda-logo";
import styles from "./style.module.css";

interface NavBarProp {
  logo?: React.ReactNode;
  title: string;
}

export const NavBar: React.FC<NavBarProp> = (props) => {
  return (
    <header className={styles.header}>
      <div className={styles["nav-bar"]}>
        {props.logo ?? (
          <Center>
            <PandaSvg />
          </Center>
        )}
        <span className={styles.title}>{props.title}</span>
        {props.children}
      </div>
    </header>
  );
};

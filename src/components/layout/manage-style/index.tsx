import React, { ReactNode } from "react";
import { NavBar } from "../../nav-bar";
import styles from "./style.module.css";

interface ManageStyleLayoutProp {
  title: string;
  headerChildren?: ReactNode;
}

export const ManageStyleLayout: React.FC<ManageStyleLayoutProp> = (prop) => {
  return (
    <section className={styles.section}>
      <NavBar title={prop.title}>{prop.headerChildren}</NavBar>
      <main className={styles.main}>{prop.children}</main>
      <footer className={styles.footer}>
        ECNU Pet ©2021 Powered by Ant Design & Material Design
      </footer>
    </section>
  );
};

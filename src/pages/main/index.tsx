import React from "react";
import FormOutlined from "@ant-design/icons/lib/icons/FormOutlined";
import { router } from "../../routes";
import styles from "./style.module.css";
import { Center } from "../../components/center";
import PictureOutlined from "@ant-design/icons/lib/icons/PictureOutlined";
import BookOutlined from "@ant-design/icons/lib/icons/BookOutlined";
import { mergeClassName } from "../../utils/ui/class-name";
import { NavBar } from "../../components/nav-bar";
import { renderHeader } from "../test-center";
export const MainPage: React.FC = () => {
  return (
    <>
      <NavBar title="首页">{renderHeader()}</NavBar>
      <div className={styles.page}>
        <div
          className={mergeClassName(styles["module-button"], styles.hospital)}
          onClick={() => {
            router.push("/vtour");
          }}
        >
          <Center className={styles.center}>
            <PictureOutlined style={{ fontSize: 100 }} />
            医院导览
          </Center>
        </div>
        <div
          className={mergeClassName(
            styles["module-button"],
            styles["test-center"]
          )}
          onClick={() => {
            router.push("/test-center");
          }}
        >
          <Center className={styles.center}>
            <FormOutlined style={{ fontSize: 100 }} />
            试题中心
          </Center>
        </div>
        <div
          className={mergeClassName(
            styles["module-button"],
            styles["case-center"]
          )}
          onClick={() => {
            alert("开发中，敬请期待");
          }}
        >
          <Center className={styles.center}>
            <BookOutlined style={{ fontSize: 100 }} />
            病例中心
          </Center>
        </div>
      </div>
    </>
  );
};

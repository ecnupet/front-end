import React from "react";
import { mergeClassName } from "../../utils/ui/class-name";
import styles from "./style.module.css";

export const Center: React.FC<JSX.IntrinsicElements["div"]> = (props) => {
  return (
    <div
      {...props}
      className={mergeClassName(props.className, styles["center-container"])}
    >
      {props.children}
    </div>
  );
};

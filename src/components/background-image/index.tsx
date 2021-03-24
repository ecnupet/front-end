import React from "react";
import { mergeClassName } from "../../utils/ui/class-name";
import styles from "./style.module.css";

export const BackgroundImage: React.FC<React.ImgHTMLAttributes<any>> = (
  props
) => {
  return (
    <img
      {...props}
      alt={props.alt}
      className={mergeClassName(props.className, styles["background-image"])}
    ></img>
  );
};

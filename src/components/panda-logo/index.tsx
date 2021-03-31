import React from "react";
import panda from "../../assets/panda.svg";
import { router } from "../../routes";

export const PandaSvg: React.FC = () => (
  <img
    src={panda}
    alt="panda.svg"
    onClick={() => {
      router.push("/developing");
    }}
  ></img>
);

import { AntdMessager } from "./antd-message";
import { Messager } from "./schema";

const antdMessager: Messager = new AntdMessager();

export const InteractFactory = {
  getMessager() {
    return antdMessager;
  },
};

import { Messager } from "./schema";
import { message as antdMessage } from "antd";
export class AntdMessager implements Messager {
  internalError(cause: string): void {
    antdMessage.error(cause);
  }
  success(message: string): void {
    antdMessage.success(message);
  }
  fail(reason: string): void {
    antdMessage.error(reason);
  }
  warning(info: string): void {
    antdMessage.warning(info);
  }
  info(info: string): void {
    antdMessage.info(info);
  }
}

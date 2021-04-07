import { isDev } from "../../env";
import { InteractFactory } from "../../services/interact/factory";
import { isAxiosError } from "../common";

export function globalErrorHandle(error: any) {
  let message = "系统错误";
  if (isAxiosError(error)) {
    const { response } = error;
    const data = response?.data;
    message =
      data?.detail ??
      (response && getErrorMessageOfCode(response.status)) ??
      message;
  }
  InteractFactory.getMessager().internalError(message);
  isDev && console.error(error);
}

export function getErrorMessageOfCode(status: number | string) {
  const code = status.toString();
  if (code.startsWith("4")) {
    if (code === "401") {
      return "请先登录";
    }
    if (code === "404") {
      return "资源不存在";
    }
    if (code === "400") {
      return "未知错误，请报告bug";
    }
  }
  if (code.startsWith("5")) {
    if (code === "500") {
      return "服务器抽风啦";
    }
  }
  return "未知错误";
}

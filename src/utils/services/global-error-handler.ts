import { InteractFactory } from "../../services/interact/factory";

export function globalErrorHandle(error: any) {
  InteractFactory.getMessager().internalError("系统错误");
  console.error(error);
}

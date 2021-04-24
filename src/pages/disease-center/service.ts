import { apiCaller, ResponseResultEnum } from "../../api";
import { Disease } from "../../api/info-manage";
import { globalStore } from "../../store";

export function getDiseases(): Promise<Disease[]> {
  return apiCaller.get("/api/im/diseaseget", {}).then(
    (res) => {
      if (res.state !== ResponseResultEnum.Success) {
        globalStore.user.logout();
        return Promise.reject(res.detail);
      }
      return res.data;
    },
    () => {
      return Promise.reject("网络错误");
    }
  );
}

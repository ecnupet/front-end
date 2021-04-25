import { apiCaller, ResponseResultEnum } from "../../api";
import { Case, Disease } from "../../api/info-manage";
import { globalStore } from "../../store";

export function getDiseases(): Promise<Disease[]> {
  return apiCaller.get("/api/im/diseaseget", {}).then(
    (res) => {
      if (res.state === ResponseResultEnum.Unauthorized) {
        globalStore.user.logout();
      }
      if (res.state !== ResponseResultEnum.Success) {
        return Promise.reject(res.detail);
      }
      return res.data;
    },
    () => {
      return Promise.reject("网络错误");
    }
  );
}

export interface DiseaseAllStage {
  introduce: Case | null;
  clinicalReception: Case | null;
  check: Case | null;
  diagnosis: Case | null;
  therapeuticSchedule: Case | null;
}

export function getDiseaseCase(id: number): Promise<DiseaseAllStage> {
  return apiCaller.get("/api/im/diseasecase", { diseaseID: id }).then(
    (res) => {
      if (res.state === ResponseResultEnum.Unauthorized) {
        globalStore.user.logout();
      }
      if (res.state !== ResponseResultEnum.Success) {
        return Promise.reject(res.detail);
      }
      return res.data;
    },
    () => {
      return Promise.reject("网络错误");
    }
  );
}

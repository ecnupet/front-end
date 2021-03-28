import { apiCaller } from "../../api";
import { getPasswordNumberArray } from "../../utils/common";
import { BackendService, ResponseResultModel } from "./schema";

export class RealBackendService implements BackendService {
  async register(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>> {
    const result = await apiCaller.post("/api/user/logon", {
      name: form.uid,
      password: getPasswordNumberArray(form.password),
    });
    return result;
  }
  async login(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>> {
    const result = await apiCaller.post("/api/user/login", {
      name: form.uid,
      password: getPasswordNumberArray(form.password),
    });
    return result;
  }
}

import { makeAutoObservable } from "mobx";
import { router } from "../../routes";
import { BackendServiceFactory } from "../../services/backend";
import { InteractFactory } from "../../services/interact/factory";

export class AccessManageService {
  constructor() {
    makeAutoObservable(this);
  }

  async handleLogout() {
    await BackendServiceFactory.getBackendService().logout();
    InteractFactory.getMessager().success("退出登录成功");
    router.replace("/login");
  }
}

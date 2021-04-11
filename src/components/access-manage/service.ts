import { makeAutoObservable } from "mobx";
import { BackendServiceFactory } from "../../services";
import { InteractFactory } from "../../services";
import { globalStore } from "../../store";

export class AccessManageService {
  constructor() {
    makeAutoObservable(this);
  }

  async handleLogout() {
    try {
      await BackendServiceFactory.getPersionManageService().logout();
      InteractFactory.getMessager().success("退出登录成功");
    } catch (e) {
      throw e;
    } finally {
      globalStore.user.logout();
    }
  }
}

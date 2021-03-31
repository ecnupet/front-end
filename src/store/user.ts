import { makeAutoObservable } from "mobx";
import { BackendServiceFactory } from "../services";

class UserStore {
  constructor() {
    makeAutoObservable(this);
    this.fetch();
  }

  userName = "";

  setUserName(name: string) {
    this.userName = name;
  }

  isAdmin = false;

  setIsAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }

  async fetch() {
    const {
      data: { isAdmin, name },
    } = await BackendServiceFactory.getPersionManageService().userInfo();

    this.setUserName(name);
    this.setIsAdmin(isAdmin === 1);
  }

  logout() {
    this.userName = "";
  }
}

export const userStore = new UserStore();

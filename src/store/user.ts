import { makeAutoObservable } from "mobx";
import { router } from "../routes";
import { BackendServiceFactory } from "../services";
import { USERNAME } from "./keys";

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  userName = localStorage.getItem(USERNAME) ?? "";

  setUserName(name: string) {
    this.userName = name;
    localStorage.setItem(USERNAME, name);
  }

  isAdmin = false;

  setIsAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }

  async fetch() {
    try {
      const {
        data: { authorization: isAdmin, name },
      } = await BackendServiceFactory.getPersionManageService().userInfo();
      this.setUserName(name);
      this.setIsAdmin(isAdmin === 1);
    } catch (error) {
      this.logout();
    }
  }

  logout() {
    this.userName = "";
    document.cookie = "";
    localStorage.removeItem(USERNAME);
    router.push("/login");
  }
}

export const userStore = new UserStore();

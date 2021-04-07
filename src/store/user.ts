import { makeAutoObservable } from "mobx";
import { BackendServiceFactory } from "../services";
import { USERNAME } from "./keys";

class UserStore {
  constructor() {
    makeAutoObservable(this);
    this.fetch();
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
    const {
      data: { isAdmin, name },
    } = await BackendServiceFactory.getPersionManageService().userInfo();

    this.setUserName(name);
    this.setIsAdmin(isAdmin === 1);
  }

  logout() {
    this.userName = "";
    // document.cookie = "";
    localStorage.removeItem(USERNAME);
  }
}

export const userStore = new UserStore();

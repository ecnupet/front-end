import { makeAutoObservable } from "mobx";
import { Auth } from "../api";
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

  authentication = Auth.Normal;

  setAuthentication(auth: Auth) {
    this.authentication = auth;
  }

  async fetch() {
    try {
      const {
        data: { authorization, name },
      } = await BackendServiceFactory.getPersionManageService().userInfo();
      this.setUserName(name);
      this.setAuthentication(authorization);
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

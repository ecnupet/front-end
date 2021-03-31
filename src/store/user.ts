import { makeAutoObservable } from "mobx";
import { BackendServiceFactory } from "../services";

class UserStore {
  constructor() {
    makeAutoObservable(this);
    this.fetch();
  }

  userName = "";
  isAdmin = false;

  async fetch() {
    const {
      data: { isAdmin, name },
    } = await BackendServiceFactory.getBackendService(
      /* TODO real */ "mock"
    ).userInfo();
    this.userName = name;
    this.isAdmin = isAdmin === 1;
  }
}

export const userStore = new UserStore();

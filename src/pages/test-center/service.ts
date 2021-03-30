import { makeAutoObservable } from "mobx";
import { RoutePaths, router } from "../../routes";

export class TestCenterService {
  constructor() {
    makeAutoObservable(this);
  }

  switchTo(path: RoutePaths) {
    if (path !== router.location.pathname) {
      router.push(path);
    }
  }
}

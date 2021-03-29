import { makeAutoObservable } from "mobx";

export class TestCenterService {
  constructor() {
    makeAutoObservable(this);
  }
}

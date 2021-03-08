import { makeAutoObservable } from "mobx";
import { router } from "../../route";

export class AboutService {
  constructor() {
    makeAutoObservable(this);
  }

  handleJump() {
    router.push("/home");
  }

  selfCount = 0;

  handleAddSelfCount() {
    this.selfCount++;
  }
}

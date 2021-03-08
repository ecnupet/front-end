import { action, makeAutoObservable } from "mobx";
import { router } from "../../route";
import { globalStore } from "../../store";

export const handleJump = () => {
  router.push("/about");
};

export const handleAddGlobalCount = action(() => {
  globalStore.counter.count++;
});

export class HomeService {
  constructor() {
    makeAutoObservable(this);
  }

  selfCount = 0;

  handleAddSelfCount() {
    this.selfCount++;
  }
}

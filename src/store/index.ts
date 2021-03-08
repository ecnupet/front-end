import { counter } from "./counter";
import { createStoreWithClass } from "./factory";

class GlobalStore {
  counter = counter;
}

export const globalStore = createStoreWithClass(GlobalStore);

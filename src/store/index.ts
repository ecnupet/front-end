import { counter } from "./counter";
import { createStoreWithClass } from "./factory";
import { routeStore } from "./route";

class GlobalStore {
  counter = counter;
  route = routeStore;
}

export const globalStore = createStoreWithClass(GlobalStore);

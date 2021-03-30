import { counter } from "./counter";
import { createStoreWithClass } from "./factory";
import { routeStore } from "./route";
import { userStore } from "./user";

class GlobalStore {
  counter = counter;
  route = routeStore;
  user = userStore;
}

export const globalStore = createStoreWithClass(GlobalStore);

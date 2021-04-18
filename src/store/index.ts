import { createStoreWithClass } from "./factory";
import { routeStore } from "./route";
import { userStore } from "./user";

class GlobalStore {
  route = routeStore;
  user = userStore;
}

export const globalStore = createStoreWithClass(GlobalStore);

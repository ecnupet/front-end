import { RoutePaths } from "../route";
import { createStoreWithClass } from "./factory";

class RouteStore {
  path: RoutePaths = "/";
  setPath(path: RoutePaths) {
    this.path = path;
  }
}

export const routeStore = createStoreWithClass(RouteStore);

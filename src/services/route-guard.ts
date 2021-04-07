import { getCurrentPath, RoutePaths, router } from "../routes";
import { globalStore } from "../store";
import { changeTitle } from "../utils/ui/title";

export const routeGuard = {
  on() {
    window.addEventListener("hashchange", onRouteChange);
  },
  off() {
    window.removeEventListener("hashchange", onRouteChange);
  },
  apply() {
    onRouteChange();
  },
};
const routesNeedAuth: RoutePaths[] = [
  "/home",
  "/take-test",
  "/test-center",
  "/test-result",
];
function onRouteChange() {
  changeTitle();
  const route = getCurrentPath();
  if (routesNeedAuth.find((path) => route.startsWith(path))) {
    globalStore.user.fetch().catch(() => {
      router.push("/login");
    });
  }
  globalStore.route.setPath(route);
}

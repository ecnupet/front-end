import { changeTitle } from "../utils/ui/title";

export const routeGuard = {
  on() {
    window.addEventListener("hashchange", onRouteChange);
  },
  off() {
    window.removeEventListener("hashchange", onRouteChange);
  },
};

function onRouteChange() {
  changeTitle();
}
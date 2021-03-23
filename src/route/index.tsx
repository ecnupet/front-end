import React from "react";
import { createHashHistory, History } from "history";
import { AboutPage } from "../pages/about";
import { HomePage } from "../pages/home";
import { PickKey } from "../utils/types";
import { LoginPage } from "../pages/login";
import { Redirect } from "react-router";
type State = unknown;
export const routerHistory = createHashHistory<State>();
type Routes = Record<string, React.ComponentType>;
function defineRouteMapping<T extends Routes>(mapping: T) {
  return mapping;
}
/**
 * 在这里定义路由
 */
export const routeMapping = defineRouteMapping({
  "/home": HomePage,
  "/about": AboutPage,
  "/login": LoginPage,
  "/": () => <Redirect to="/login"></Redirect>,
} as const);

export const routes = Object.entries(routeMapping);

type HistoryProxy<
  TRoutes extends Routes = typeof routeMapping,
  TState = State
> = Omit<History<TState>, PickKey<History<TState>, "push" | "replace">> & {
  push(path: keyof TRoutes, state?: TState): void;
  // push(location: LocationDescriptor<TState>): void;
  replace(path: keyof TRoutes, state?: TState): void;
  // replace(location: LocationDescriptor<TState>): void;
};

/**
 * 本质就是react-router的history，但有路由的类型约束
 */
export const router: HistoryProxy = routerHistory;
const initPath = window.location.hash.replace("#", "");
router.replace(initPath as never);

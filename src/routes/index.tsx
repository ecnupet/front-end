import React from "react";
import { createHashHistory, History } from "history";
import { PickKey } from "../utils/types";
import { LoginPage } from "../pages/login";
import { Redirect } from "react-router";
import { DevelopingPage } from "../pages/developing";
import { TestCenterPage } from "../pages/test-center";
import { NewTestPage } from "../pages/test-center/new-test";
import { MyTestsPage } from "../pages/test-center/my-tests";
import { StatisticsPage } from "../pages/test-center/statistics";
import { TakeTestPage } from "../pages/take-test";
import { isDev } from "../env";
import { TestResultPage } from "../pages/test-result";
import { GuidePage } from "../pages/guide";
import { HomePage } from "../pages/home";
import { TestPage } from "../pages/test-page";
import { AdminLogin } from "../pages/admin/login";
import { AdminHomePage } from "../pages/admin";
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
  "/": () => <Redirect to="/login"></Redirect>,
  "/developing": DevelopingPage,
  "/home": HomePage,
  "/login": LoginPage,
  "/test-center": () => <TestCenterPage />,
  "/test-center/new-test": () => (
    <TestCenterPage>
      <NewTestPage></NewTestPage>
    </TestCenterPage>
  ),
  "/test-center/my-tests": () => (
    <TestCenterPage>
      <MyTestsPage></MyTestsPage>
    </TestCenterPage>
  ),
  "/test-center/statistics": () => (
    <TestCenterPage>
      <StatisticsPage></StatisticsPage>
    </TestCenterPage>
  ),
  "/take-test": TakeTestPage,
  "/test-result": TestResultPage,
  "/vtour": GuidePage,
  "/admin": () => <Redirect to="/admin/login"></Redirect>,
  "/admin/login": AdminLogin,
  "/admin/home": () => <AdminHomePage></AdminHomePage>,
  "/test-page": TestPage,
} as const);

export const routes = Object.entries(routeMapping);
export type RoutePaths = keyof typeof routeMapping;
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
export function getCurrentPath() {
  return router.location.pathname as RoutePaths;
}
const initPath = window.location.hash.replace("#", "");
router.replace(initPath as never);
if (isDev) (window as any).__router__ = router;

import { RoutePaths, router } from "../../routes";

const PROJECT = "宠物医院学习系统";

const titles: Record<RoutePaths, string> = {
  "/": "跳转中",
  "/developing": "开发中",
  "/home": "主页",
  "/login": `${PROJECT} - 登录`,
  "/disease-center": `${PROJECT} - 病例中心`,
  "/disease-center/stage": `${PROJECT} - 病例阶段`,
  "/test-center": `${PROJECT} - 测试中心`,
  "/test-center/my-tests": `${PROJECT} - 我的测试`,
  "/test-center/new-test": `${PROJECT} - 开始测试`,
  "/test-center/statistics": `${PROJECT} - 数据统计`,
  "/take-test": `${PROJECT} - 测试`,
  "/test-result": `${PROJECT} - 测试结果详情`,
  "/vtour": `${PROJECT} - 医院导览`,
  "/test-page": `${PROJECT} - 测试页面`,
  "/admin": `${PROJECT} - 管理后台`,
  "/admin/home": `${PROJECT} - 后台主页`,
  "/admin/login": `${PROJECT} - 后台登录`,
};

export function getDocumentTitle(path: RoutePaths) {
  return titles[path];
}

export function changeTitle() {
  const key = router.location.pathname as RoutePaths;
  document.title = getDocumentTitle(key) ?? "404 Not Found";
}

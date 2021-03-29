import { RoutePaths, router } from "../../route";

const PROJECT = "宠物医院学习系统";

const titles: Record<RoutePaths, string> = {
  "/": "跳转中",
  "/about": "关于我们",
  "/developing": "开发中",
  "/home": "主页",
  "/login": `${PROJECT} - 登录`,
  "/test-center": `${PROJECT} - 测试中心`,
  "/test-center/my-tests": `${PROJECT} - 我的测试`,
  "/test-center/new-test": `${PROJECT} - 开始测试`,
  "/test-center/statistics": `${PROJECT} - 数据统计`,
};

export function getDocumentTitle(path: RoutePaths) {
  return titles[path];
}

export function changeTitle() {
  const key = router.location.pathname as RoutePaths;
  document.title = getDocumentTitle(key);
}

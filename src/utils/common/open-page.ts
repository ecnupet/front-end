import { RoutePaths } from "../../routes";
import {
  serializeQueryParameter,
  updateQueryParameter,
} from "./query-parameter";

export function openPage(path: RoutePaths, params?: object) {
  const url = new URL(window.location.origin);
  url.hash = `#${path}`;
  if (params) {
    updateQueryParameter(url.searchParams, serializeQueryParameter(params));
  }
  return window.open(url.toString(), "");
}

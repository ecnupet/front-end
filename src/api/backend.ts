import axios from "axios";
import { autorun } from "mobx";
import { configStore } from "../store/config";
import {
  APIMapping as PersonManage,
  ParameterInfo,
  RequestMethodVerbs,
} from "./person-manage";
import { APIMapping as InfoManage } from "./info-manage";
type APIMapping = PersonManage & InfoManage;
axios.defaults.headers = {
  "content-type": "application/json; charset=utf-8",
  "X-Requested-With": "XMLHttpRequest",
};
axios.defaults.withCredentials = true;

autorun(() => {
  axios.defaults.baseURL = configStore.config.baseURL;
});

export const baseURLs: string[] = [
  "https://backend.ecnu.space",
  "http://localhost:5000",
  "https://localhost:5001",
];
export const axiosInstance = axios;

type ExtractMethod<
  K extends keyof APIMapping,
  Method extends RequestMethodVerbs
> = {
  [Key in K]: ReturnType<APIMapping[Key]>["method"] extends Method
    ? Key
    : never;
}[K];

interface APICaller {
  post<K extends ExtractMethod<keyof APIMapping, "post">>(
    key: K,
    data: {
      [Key in Extract<
        keyof ReturnType<APIMapping[K]>["parameters"],
        number
      >]: ReturnType<APIMapping[K]>["parameters"][Key] extends infer T
        ? T extends ParameterInfo<any, any, any>
          ? T["type"]
          : never
        : never;
    }[0]
  ): Promise<ReturnType<APIMapping[K]>["responseType"]["value"]>;
  get<K extends ExtractMethod<keyof APIMapping, "get">>(
    key: K,
    params: {
      [Key in Extract<
        keyof ReturnType<APIMapping[K]>["parameters"],
        number
      > as ReturnType<APIMapping[K]>["parameters"][Key]["name"]]: ReturnType<
        APIMapping[K]
      >["parameters"][Key] extends infer T
        ? T extends ParameterInfo<any, "query", any>
          ? T["type"]
          : never
        : never;
    }
  ): Promise<ReturnType<APIMapping[K]>["responseType"]["value"]>;
  delete<K extends ExtractMethod<keyof APIMapping, "delete">>(
    key: K,
    params: {
      [Key in Extract<
        keyof ReturnType<APIMapping[K]>["parameters"],
        number
      >]: ReturnType<APIMapping[K]>["parameters"][Key] extends infer T
        ? T extends ParameterInfo<any, any, any>
          ? T["type"]
          : never
        : never;
    }[0]
  ): Promise<ReturnType<APIMapping[K]>["responseType"]["value"]>;
}

class RealAPICaller implements APICaller {
  async delete<K extends "/api/pm/admin/user">(
    key: K,
    params: {
      [Key in Extract<
        keyof ReturnType<APIMapping[K]>["parameters"],
        number
      > as ReturnType<APIMapping[K]>["parameters"][Key]["name"]]: ReturnType<
        APIMapping[K]
      >["parameters"][Key] extends infer T
        ? T extends ParameterInfo<any, "query", any>
          ? T["type"]
          : never
        : never;
    }
  ): Promise<ReturnType<APIMapping[K]>["responseType"]["value"]> {
    const result = await axiosInstance.delete(key, { data: params });
    return result.data;
  }
  async get<K extends ExtractMethod<keyof APIMapping, "get">>(
    key: K,
    params: {
      [Key in Extract<
        keyof ReturnType<APIMapping[K]>["parameters"],
        number
      >]: ReturnType<APIMapping[K]>["parameters"][Key] extends infer T
        ? T extends ParameterInfo<any, any, any>
          ? T["type"]
          : never
        : never;
    }[0]
  ): Promise<ReturnType<APIMapping[K]>["responseType"]["value"]> {
    const response = await axiosInstance.get(key, { params });
    return response.data;
  }
  async post<K extends ExtractMethod<keyof APIMapping, "post">>(
    key: K,
    data: any
  ) {
    const response = await axiosInstance.post(key, data);
    return response.data;
  }
}

export const apiCaller: APICaller = new RealAPICaller();

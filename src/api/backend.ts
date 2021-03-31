import axios from "axios";
import { APIMapping, ParameterInfo, RequestMethodVerbs } from "./schema";
axios.defaults.headers = {
  "content-type": "application/json; charset=utf-8",
  "X-Requested-With": "XMLHttpRequest",
};
axios.defaults.baseURL =
  process.env.NODE_ENV !== "development"
    ? "https://localhost:5001"
    : "https://backend.ecnu.space";
axios.defaults.withCredentials = true;
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
      >]: ReturnType<APIMapping[K]>["parameters"][Key] extends infer T
        ? T extends ParameterInfo<any, any, any>
          ? T["type"]
          : never
        : never;
    }[0]
  ): Promise<ReturnType<APIMapping[K]>["responseType"]["value"]>;
}

class RealAPICaller implements APICaller {
  async get<K extends "/api/pm/user/userinfo">(
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
    return response.data as any;
  }
}

export const apiCaller: APICaller = new RealAPICaller();

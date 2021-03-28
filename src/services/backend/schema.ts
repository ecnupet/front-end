export enum ResponseResultEnum {
  Success = 0,
  Fail = 1,
  Exist = 2,
  NotFound = 3,
  Invalid = 4,
  Valid = 5,
  Authorized = 6,
  Unauthorized = 7,
  TimedOut = 8,
}

export interface ResponseResultModel<TResult> {
  state: ResponseResultEnum;
  detail: string;
  data: TResult;
}

export interface BackendService {
  register(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>>;
  login(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>>;
}

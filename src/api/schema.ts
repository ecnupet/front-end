export interface PersonLogonForm {
  name: string;
  password: Array<number>;
}

export interface PersonLoginForm {
  name: string;
  password: Array<number>;
}

export interface PersonPasswordChangeForm {
  name: string;
  newPassword: Array<number>;
}

export interface PersonDeleteForm {
  userName: string;
}

export interface ActionResult<TValue> {
  value: TValue;
}
export interface ResponseResultModel<TResult> {
  state: ResponseResultEnum;
  detail: string;
  data: TResult;
}
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
export type RequestMethodVerbs =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options";
export type ParameterPositionKinds =
  | "query"
  | "route"
  | "body"
  | "form"
  | "header";
export interface ParameterInfo<
  Name extends string,
  Position extends ParameterPositionKinds,
  Type
> {
  name: Name;
  position: Position;
  type: Type;
}
export interface APIInfo<
  Name extends string,
  Method extends RequestMethodVerbs,
  Parameters extends readonly ParameterInfo<
    string,
    ParameterPositionKinds,
    unknown
  >[],
  Response
> {
  name: Name;
  method: Method;
  parameters: Parameters;
  responseType: Response;
}
export interface APIMapping {
  ["/api/user/logon"](): APIInfo<
    "PersonLogon",
    "post",
    [ParameterInfo<"personLogonForm", "body", PersonLogonForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/user/login"](): APIInfo<
    "PersonLogin",
    "post",
    [ParameterInfo<"personLogin", "body", PersonLoginForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/admin/userinfo"](): APIInfo<
    "PersonChangeSerect",
    "post",
    [
      ParameterInfo<
        "personPasswordChangeForm",
        "body",
        PersonPasswordChangeForm
      >
    ],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/admin/user"](): APIInfo<
    "DeleteUser",
    "delete",
    [ParameterInfo<"personDeleteForm", "body", PersonDeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/user/logout"](): APIInfo<
    "PersonLogout",
    "post",
    [],
    ActionResult<ResponseResultModel<any>>
  >;
}

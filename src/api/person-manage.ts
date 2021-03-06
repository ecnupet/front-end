export interface PersonLogonForm {
  name: string;
  password: Array<number>;
}

export interface PersonLoginForm {
  name: string;
  password: Array<number>;
}

export interface PersonAuthChangeForm {
  name: string;
  authorization: Auth;
}

export interface PersonSecretResetForm {
  name: string;
}

export interface PersonCreateForm {
  name: string;
  password: Array<number>;
  authorization: Auth;
}

export interface PersonDeleteForm {
  userName: string;
}

export interface ActionResult<TValue> {
  value: TValue;
}
export enum Auth {
  Normal = 0,
  Admin = 1,
  SuperAdmin = 2,
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
export interface PersonInfoResponse {
  name: string;
  authorization: number;
}

export interface AuthCheckResponse {
  authorization: string;
  id: string;
  name: string;
  message: boolean;
}

export interface SearchResult<T> {
  count: number;
  records: Array<T>;
}
export interface PersonInfomation {
  id: number;
  userName: string;
  password: Array<number>;
  authorization: Auth;
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
  ["/api/pm/user/logon"](): APIInfo<
    "PersonLogon",
    "post",
    [ParameterInfo<"personLogonForm", "body", PersonLogonForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/user/login"](): APIInfo<
    "PersonLogin",
    "post",
    [ParameterInfo<"personLogin", "body", PersonLoginForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/user/userinfo"](): APIInfo<
    "PersonInfoGet",
    "get",
    [],
    ActionResult<ResponseResultModel<PersonInfoResponse>>
  >;
  ["/api/pm/admin/infochange"](): APIInfo<
    "PersonInfoChange",
    "post",
    [ParameterInfo<"personAuthForm", "body", PersonAuthChangeForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/admin/secretreset"](): APIInfo<
    "PersonSecretReset",
    "post",
    [ParameterInfo<"personSecretResetForm", "body", PersonSecretResetForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/admin/personcreate"](): APIInfo<
    "PersonCreate",
    "post",
    [ParameterInfo<"personCreateForm", "body", PersonCreateForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/admin/userlist"](): APIInfo<
    "UserSearchAsync",
    "get",
    [
      ParameterInfo<"page", "query", number>,
      ParameterInfo<"pageSize", "query", number>,
      ParameterInfo<"keyWord", "query", string>
    ],
    ActionResult<ResponseResultModel<SearchResult<PersonInfomation>>>
  >;
  ["/api/pm/admin/user"](): APIInfo<
    "DeleteUser",
    "delete",
    [ParameterInfo<"personDeleteForm", "body", PersonDeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/auth/check"](): APIInfo<
    "AuthCheck",
    "get",
    [],
    ActionResult<ResponseResultModel<AuthCheckResponse>>
  >;
  ["/api/pm/user/logout"](): APIInfo<
    "PersonLogout",
    "post",
    [],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/pm/user/test"](): APIInfo<
    "Test",
    "get",
    [],
    ActionResult<ResponseResultModel<any>>
  >;
}

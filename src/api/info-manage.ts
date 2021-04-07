export interface Drug {
  iD: number;
  drugName: string;
  drugPrice: number;
  drugUsage: string;
  drugSave: string;
}

export interface DrugPostForm {
  drugName: string;
  drugPrice: number;
  drugUsage: string;
  drugSave: string;
}

export interface Case {
  iD: number;
  caseName: string;
  caseStage: CaseStages;
  description: string;
  image: string;
  video: string;
  caseType: string;
}

export interface CaseForm {
  caseName: string;
  caseStage: CaseStages;
  description: string;
  image: string;
  video: string;
  caseType: string;
}

export interface RoomProcess {
  iD: number;
  name: string;
  process: string;
  fatherID: number;
  video: string;
  image: string;
}

export interface ProcessForm {
  name: string;
  video: string;
  image: string;
  process: string;
  route: string;
}

export interface ChargeProject {
  iD: number;
  projectName: string;
  projectDescription: string;
  projectCharge: string;
}

export interface ChargeProjectForm {
  projectName: string;
  projectDescription: string;
  projectCharge: string;
}

export interface ActionResult<TValue> {
  value: TValue;
}
export enum CaseStages {
  Introduce = 0,
  ClinicalReception = 1,
  Check = 2,
  Diagnosis = 3,
  TherapeuticSchedule = 4,
}
export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface ResponseResultModel<TResult> {
  state: ResponseResultEnum;
  detail: string;
  data: TResult;
}
export interface DrugData {
  drugName: string;
  drugPrice: number;
  drugUsage: string;
  drugSave: string;
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
export interface CaseName {
  name: string;
  caseType: string;
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
  ["/api/im/drug"](): APIInfo<
    "DrugInfoGetAsync",
    "get",
    [ParameterInfo<"drugID", "query", string>],
    ActionResult<ResponseResultModel<DrugData>>
  >;
  ["/api/im/case"](): APIInfo<
    "CaseInfoGetAsync",
    "get",
    [
      ParameterInfo<"caseName", "query", string>,
      ParameterInfo<"stage", "query", string>
    ],
    ActionResult<ResponseResultModel<Case>>
  >;
  ["/api/im/casename"](): APIInfo<
    "CaseNamesGetAsync",
    "get",
    [],
    ActionResult<ResponseResultModel<Array<CaseName>>>
  >;
  ["/api/im/process"](): APIInfo<
    "ProcessGet",
    "get",
    [ParameterInfo<"processRoute", "query", string>],
    ActionResult<ResponseResultModel<RoomProcess>>
  >;
  ["/api/im/chargeprojectnames"](): APIInfo<
    "ChargeProjectNamesGetAsync",
    "get",
    [],
    ActionResult<ResponseResultModel<Array<string>>>
  >;
  ["/api/im/chargeproject"](): APIInfo<
    "ChargeProjectGetAsync",
    "get",
    [ParameterInfo<"projectName", "query", string>],
    ActionResult<ResponseResultModel<ChargeProject>>
  >;
  ["/api/im/drugupdate"](): APIInfo<
    "DrugUpdateAsync",
    "post",
    [ParameterInfo<"drug", "body", Drug>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/drugadd"](): APIInfo<
    "DrugAddAsync",
    "post",
    [ParameterInfo<"drugPostForm", "body", DrugPostForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/caseupdate"](): APIInfo<
    "CaseUpdateAsync",
    "post",
    [ParameterInfo<"cases", "body", Case>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/caseadd"](): APIInfo<
    "CaseAddAsync",
    "post",
    [ParameterInfo<"cases", "body", CaseForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/processupdate"](): APIInfo<
    "ProcessUpdateAsync",
    "post",
    [ParameterInfo<"process", "body", RoomProcess>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/processadd"](): APIInfo<
    "ProcessAddAsync",
    "post",
    [ParameterInfo<"process", "body", ProcessForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/chargeprojectupdate"](): APIInfo<
    "ChargeProjectUpdateAsync",
    "post",
    [ParameterInfo<"chargeProject", "body", ChargeProject>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/chargeProjectadd"](): APIInfo<
    "ChargeProjectAddAsync",
    "post",
    [ParameterInfo<"charge", "body", ChargeProjectForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/AuthCheck"](): APIInfo<
    "AuthCheck",
    "get",
    [ParameterInfo<"cookies", "query", Array<any>>],
    any
  >;
  ["/WeatherForecast/Get"](): APIInfo<"Get", "get", [], Array<WeatherForecast>>;
}

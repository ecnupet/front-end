export interface DiseasePostForm {
  diseaseName: string;
  diseaseType: string;
}

export interface Disease {
  id: number;
  diseaseName: string;
  diseaseType: string;
}

export interface DeleteForm {
  id: number;
}

export interface Drug {
  id: number;
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
  id: number;
  diseaseId: number;
  caseStage: CaseStages;
  description: string;
  image: string;
  video: string;
}

export interface CaseForm {
  diseaseId: number;
  caseStage: CaseStages;
  description: string;
  image: string;
  video: string;
}

export interface RoomProcess {
  id: number;
  name: string;
  process: string;
  fatherId: number;
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
  id: number;
  projectName: string;
  projectDescription: string;
  projectCharge: number;
}

export interface ChargeProjectForm {
  projectName: string;
  projectDescription: string;
  projectCharge: number;
}

export interface Document {
  id: number;
  documentName: string;
  description: string;
}

export interface DocumentForm {
  documentName: string;
  description: string;
}

export interface Vaccine {
  id: number;
  name: string;
  description: string;
  image: string;
  video: string;
}

export interface InspectionProject {
  id: number;
  name: string;
  description: string;
  image: string;
  video: string;
}

export interface InspectionForm {
  name: string;
  description: string;
  image: string;
  video: string;
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
export interface DiseaseAllStage {
  introduce: Case;
  clinicalReception: Case;
  check: Case;
  diagnosis: Case;
  therapeuticSchedule: Case;
}

export interface SearchResult<T> {
  count: number;
  records: Array<T>;
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
  ["/api/im/diseaseadd"](): APIInfo<
    "DiseaseAddAsync",
    "post",
    [ParameterInfo<"diseasePostForm", "body", DiseasePostForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/diseaseget"](): APIInfo<
    "DiseaseGetAsync",
    "get",
    [],
    ActionResult<ResponseResultModel<Array<Disease>>>
  >;
  ["/api/im/diseaseupdate"](): APIInfo<
    "DiseaseUpdateAsync",
    "post",
    [ParameterInfo<"disease", "body", Disease>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/diseasedelete"](): APIInfo<
    "DiseaseDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/drug"](): APIInfo<
    "DrugSearchAsync",
    "get",
    [
      ParameterInfo<"page", "query", number>,
      ParameterInfo<"pageSize", "query", number>,
      ParameterInfo<"keyword", "query", string>
    ],
    ActionResult<ResponseResultModel<SearchResult<Drug>>>
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
  ["/api/im/drugdelete"](): APIInfo<
    "DrugDeleteAsync",
    "post",
    [ParameterInfo<"deleteForm", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/diseasecase"](): APIInfo<
    "DiseaseStageGetAsync",
    "get",
    [ParameterInfo<"diseaseID", "query", number>],
    ActionResult<ResponseResultModel<DiseaseAllStage>>
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
  ["/api/im/casedelete"](): APIInfo<
    "CaseDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/process"](): APIInfo<
    "ProcessGet",
    "get",
    [ParameterInfo<"processRoute", "query", string>],
    ActionResult<ResponseResultModel<RoomProcess>>
  >;
  ["/api/im/processall"](): APIInfo<
    "ProcessAllGet",
    "get",
    [],
    ActionResult<ResponseResultModel<Array<RoomProcess>>>
  >;
  ["/api/im/processdelete"](): APIInfo<
    "ProcessDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
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
  ["/api/im/chargeprojectdelete"](): APIInfo<
    "ChargeProjectDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/chargeProjectadd"](): APIInfo<
    "ChargeProjectAddAsync",
    "post",
    [ParameterInfo<"charge", "body", ChargeProjectForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/chargeprojectsearch"](): APIInfo<
    "ChargeProjectSearchAsync",
    "get",
    [
      ParameterInfo<"page", "query", number>,
      ParameterInfo<"pageSize", "query", number>,
      ParameterInfo<"keyWord", "query", string>
    ],
    ActionResult<ResponseResultModel<SearchResult<ChargeProject>>>
  >;
  ["/api/im/docupdate"](): APIInfo<
    "DocumentUpdateAsync",
    "post",
    [ParameterInfo<"document", "body", Document>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/docdelete"](): APIInfo<
    "DocumentDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/docadd"](): APIInfo<
    "DocumentAddAsync",
    "post",
    [ParameterInfo<"document", "body", DocumentForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/docsearch"](): APIInfo<
    "DocumentSearchAsync",
    "get",
    [
      ParameterInfo<"page", "query", number>,
      ParameterInfo<"pageSize", "query", number>,
      ParameterInfo<"keyWord", "query", string>
    ],
    ActionResult<ResponseResultModel<SearchResult<Document>>>
  >;
  ["/api/im/vaccineupdate"](): APIInfo<
    "VaccineUpdateAsync",
    "post",
    [ParameterInfo<"vaccine", "body", Vaccine>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/vaccinedelete"](): APIInfo<
    "VaccineDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/vaccineadd"](): APIInfo<
    "VaccineAddAsync",
    "post",
    [ParameterInfo<"vaccine", "body", Vaccine>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/vaccinesearch"](): APIInfo<
    "VaccineSearchAsync",
    "get",
    [
      ParameterInfo<"page", "query", number>,
      ParameterInfo<"pageSize", "query", number>,
      ParameterInfo<"keyWord", "query", string>
    ],
    ActionResult<ResponseResultModel<SearchResult<Vaccine>>>
  >;
  ["/api/im/inspectionupdate"](): APIInfo<
    "InspectionUpdateAsync",
    "post",
    [ParameterInfo<"inspection", "body", InspectionProject>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/inspectiondelete"](): APIInfo<
    "InspectionDeleteAsync",
    "post",
    [ParameterInfo<"delete", "body", DeleteForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/inspectionadd"](): APIInfo<
    "InspectionAddAsync",
    "post",
    [ParameterInfo<"inspection", "body", InspectionForm>],
    ActionResult<ResponseResultModel<any>>
  >;
  ["/api/im/inspectionsearch"](): APIInfo<
    "InspectionSearchAsync",
    "get",
    [
      ParameterInfo<"page", "query", number>,
      ParameterInfo<"pageSize", "query", number>,
      ParameterInfo<"keyWord", "query", string>
    ],
    ActionResult<ResponseResultModel<SearchResult<InspectionProject>>>
  >;
}

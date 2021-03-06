import { autorun } from "mobx";
import { ChargeProject, Disease, Drug } from "../../api/info-manage";
import { SingleSelectQuestionWithAnswer } from "../../models";
import { configStore } from "../../store/config";
import { callHook } from "../../utils/common";
import {
  RealDrugCRUDService,
  RealBackendService,
  RealQuizService,
  RealQuestionCRUDService,
  RealDiseaseService,
  RealChargeProjectService,
} from "./impl";
import {
  mockBackendService,
  mockChargeProjectService,
  mockDiseaseService,
  mockDrugService,
  mockQuestionService,
  mockQuizService,
} from "./mock";
import { CRUDService, PersonManageService, QuizService } from "./schema";

const realService: PersonManageService = new RealBackendService();
const mockService: PersonManageService = mockBackendService;
const realQuizService: QuizService = new RealQuizService();
const realDrugService: RealDrugCRUDService = new RealDrugCRUDService();
const realQuestionService: CRUDService<SingleSelectQuestionWithAnswer> = new RealQuestionCRUDService();
const realDiseaseService: CRUDService<Disease> = new RealDiseaseService();
const realChargeProjectService: CRUDService<ChargeProject> = new RealChargeProjectService();
export type ServiceType = "real" | "mock";
export interface CRUDServiceMapping {
  Drug: Record<ServiceType, CRUDService<Drug, number>>;
  Question: Record<
    ServiceType,
    CRUDService<SingleSelectQuestionWithAnswer, number>
  >;
  Disease: Record<ServiceType, CRUDService<Disease, number>>;
  ChargeProject: Record<ServiceType, CRUDService<ChargeProject, number>>;
}

export type ModelTypeOfService<
  S extends CRUDServices
> = CRUDServiceMapping[S] extends Record<
  ServiceType,
  CRUDService<infer T, number>
>
  ? T
  : never;

const crudServices: CRUDServiceMapping = {
  Drug: {
    mock: mockDrugService,
    real: realDrugService,
  },
  Question: {
    mock: mockQuestionService,
    real: realQuestionService,
  },
  Disease: {
    mock: mockDiseaseService,
    real: realDiseaseService,
  },
  ChargeProject: {
    mock: mockChargeProjectService,
    real: realChargeProjectService,
  },
};

export type CRUDServices = keyof CRUDServiceMapping;

let defaultServiceType: ServiceType = "real";
let globalServiceType: ServiceType | undefined = undefined;
autorun(() => {
  defaultServiceType = configStore.getConfig("enableGlobalMock")
    ? "mock"
    : "real";
  globalServiceType = configStore.getConfig("enableGlobalMock")
    ? "mock"
    : "real";
});
export const BackendServiceFactory = {
  getPersionManageService(type?: ServiceType) {
    globalServiceType && (type = globalServiceType);
    return callHook(
      {
        real: realService,
        mock: mockService,
      }[type ?? defaultServiceType]
    );
  },
  getQuizService(type?: ServiceType) {
    globalServiceType && (type = globalServiceType);
    return callHook(
      {
        real: realQuizService,
        mock: mockQuizService,
      }[type ?? defaultServiceType]
    );
  },
  getCRUDService<Service extends CRUDServices>(
    service: Service,
    type?: ServiceType
  ): CRUDServiceMapping[Service][ServiceType] {
    return callHook(crudServices[service][type ?? defaultServiceType]);
  },
};

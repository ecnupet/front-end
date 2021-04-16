import { autorun } from "mobx";
import { Drug } from "../../api/info-manage";
import { configStore } from "../../store/config";
import { callHook } from "../../utils/common";
import {
  RealDrugCRUDService,
  RealBackendService,
  RealQuizService,
} from "./impl";
import { mockBackendService, mockDrugService, mockQuizService } from "./mock";
import { CRUDService, PersonManageService, QuizService } from "./schema";

const realService: PersonManageService = new RealBackendService();
const mockService: PersonManageService = mockBackendService;
const realQuizService: QuizService = new RealQuizService();
const realDrugService: RealDrugCRUDService = new RealDrugCRUDService();
export type ServiceType = "real" | "mock";
export interface CRUDServiceMapping {
  Drug: Record<ServiceType, CRUDService<Drug, number>>;
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
  getCRUDService(service: CRUDServices, type?: ServiceType) {
    return callHook(crudServices[service][type ?? defaultServiceType]);
  },
};

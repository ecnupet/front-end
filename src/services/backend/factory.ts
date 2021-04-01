import { autorun } from "mobx";
import { configStore } from "../../store/config";
import { callHook } from "../../utils/common";
import { RealBackendService, RealQuizService } from "./impl";
import { mockBackendService, mockQuizService } from "./mock";
import { PersonManageService, QuizService } from "./schema";

const realService: PersonManageService = new RealBackendService();
const mockService: PersonManageService = mockBackendService;
const realQuizService: QuizService = new RealQuizService();
type ServiceType = "real" | "mock";
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
};

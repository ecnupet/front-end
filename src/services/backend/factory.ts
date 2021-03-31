import { RealBackendService, RealQuizService } from "./impl";
import { MockBackendService, mockQuizService } from "./mock";
import { PersonManageService, QuizService } from "./schema";

const realService: PersonManageService = new RealBackendService();
const mockService: PersonManageService = new MockBackendService();
const realQuizService: QuizService = new RealQuizService();
type ServiceType = "real" | "mock";

let defaultServiceType: ServiceType = "real";

export function setDefaultServiceType(type: ServiceType) {
  defaultServiceType = type ?? defaultServiceType;
}

export const BackendServiceFactory = {
  getPersionManageService(type?: ServiceType) {
    return {
      real: realService,
      mock: mockService,
    }[type ?? defaultServiceType];
  },
  getQuizService(type?: ServiceType) {
    return {
      real: realQuizService,
      mock: mockQuizService,
    }[type ?? defaultServiceType];
  },
};

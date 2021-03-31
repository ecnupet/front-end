import { RealBackendService, RealQuizService } from "./impl";
import { MockBackendService, mockQuizService } from "./mock";
import { PersonManageService, QuizService } from "./schema";

const realService: PersonManageService = new RealBackendService();
const mockService: PersonManageService = new MockBackendService();
const realQuizService: QuizService = new RealQuizService();
type ServiceType = "real" | "mock";

export const BackendServiceFactory = {
  getBackendService(type: ServiceType = "real") {
    return {
      real: realService,
      mock: mockService,
    }[type];
  },
  getQuizService(type: ServiceType = "real") {
    return {
      real: realQuizService,
      mock: mockQuizService,
    }[type];
  },
};

import { RealBackendService, RealQuizService } from "./impl";
import { MockBackendService, MockQuizService } from "./mock";
import { BackendService, QuizService } from "./schema";

const realService: BackendService = new RealBackendService();
const mockService: BackendService = new MockBackendService();
const realQuizService: QuizService = new RealQuizService();
const mockQuizService: QuizService = new MockQuizService();
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

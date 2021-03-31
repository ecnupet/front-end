import { RealBackendService, RealQuizService } from "./impl";
import { mockBackendService, mockQuizService } from "./mock";
import { PersonManageService, QuizService } from "./schema";

const realService: PersonManageService = new RealBackendService();
const mockService: PersonManageService = mockBackendService;
const realQuizService: QuizService = new RealQuizService();
type ServiceType = "real" | "mock";
const DEFAULT_SERVICE_TYPE_KEY = "";
const GLOBAL_SERVICE_TYPE_KEY = "";
function normalizeType(type: unknown, defaultValue?: ServiceType): ServiceType {
  if (type === "real" || type === "mock") {
    return type;
  }
  return defaultValue!;
}
let defaultServiceType: ServiceType = normalizeType(
  localStorage.getItem(DEFAULT_SERVICE_TYPE_KEY),
  "real"
);
let globalServiceType: ServiceType | undefined = normalizeType(
  localStorage.getItem(GLOBAL_SERVICE_TYPE_KEY)
);
export function getDefaultServiceType() {
  return defaultServiceType;
}
export function setDefaultServiceType(type: ServiceType) {
  defaultServiceType = type ?? defaultServiceType;
  localStorage.setItem(DEFAULT_SERVICE_TYPE_KEY, defaultServiceType);
}
export function getGlobalServiceType() {
  return globalServiceType;
}
export function setGlobalServiceType(type?: ServiceType) {
  globalServiceType = type;
  globalServiceType &&
    localStorage.setItem(GLOBAL_SERVICE_TYPE_KEY, globalServiceType);
}

export const BackendServiceFactory = {
  getPersionManageService(type?: ServiceType) {
    globalServiceType && (type = globalServiceType);
    return {
      real: realService,
      mock: mockService,
    }[type ?? defaultServiceType];
  },
  getQuizService(type?: ServiceType) {
    globalServiceType && (type = globalServiceType);
    return {
      real: realQuizService,
      mock: mockQuizService,
    }[type ?? defaultServiceType];
  },
};

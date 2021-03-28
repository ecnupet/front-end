import { RealBackendService } from "./impl";
import { MockBackendService } from "./mock";
import { BackendService } from "./schema";

const realService: BackendService = new RealBackendService();
const mockService: BackendService = new MockBackendService();

export const BackendServiceFactory = {
  getBackendService(type: "real" | "mock" = "real") {
    return {
      real: realService,
      mock: mockService,
    }[type];
  },
};

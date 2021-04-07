import { isDev } from "../env";
import { createStoreWithClass } from "./factory";
import { CONFIG_KEY } from "./keys";

interface DevToolsConfig {
  enableGlobalMock: boolean;
  baseURL: string;
  mockUserName: string;
  mockRequestDuration: number;
  logDetails: boolean;
}

export class ConfigStore {
  static readonly CONFIG_KEY = CONFIG_KEY;
  config: DevToolsConfig = this.getDefaultConfig();
  constructor() {
    this.load();
  }
  getDefaultConfig(): DevToolsConfig {
    return {
      logDetails: true,
      mockRequestDuration: 0.5,
      mockUserName: "Darren",
      baseURL: "https://backend.ecnu.space",
      enableGlobalMock: false,
    };
  }

  load() {
    const loadConfig = JSON.parse(
      localStorage.getItem(ConfigStore.CONFIG_KEY) ?? "{}"
    );
    Object.entries(loadConfig).forEach(([key, value]) => {
      if (key in this.config) {
        // @ts-ignore
        this.config[key] = value;
      }
    });
    this.save();
  }

  save() {
    localStorage.setItem(ConfigStore.CONFIG_KEY, JSON.stringify(this.config));
  }

  getConfig<K extends keyof DevToolsConfig>(key: K) {
    return this.config[key];
  }

  updateConfig(patch: Partial<DevToolsConfig>) {
    for (const key in patch) {
      if (key in this.config) {
        // @ts-ignore
        this.config[key] = patch[key];
      }
    }
    this.save();
  }

  cleanUp() {
    localStorage.removeItem(ConfigStore.CONFIG_KEY);
    this.updateConfig(this.getDefaultConfig());
  }
}

const configStore = createStoreWithClass(ConfigStore);
if (isDev) {
  (window as any).__config__ = configStore;
}
export { configStore };

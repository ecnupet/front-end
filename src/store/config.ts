import { createStoreWithClass } from "./factory";

interface DevToolsConfig {
  mockUserName: string;
  mockRequestDuration: number;
  logDetails: boolean;
}

export class ConfigStore {
  static readonly CONFIG_KEY = "dev-config";
  config: DevToolsConfig = {
    logDetails: true,
    mockRequestDuration: 0.5,
    mockUserName: "Darren",
  };
  constructor() {
    this.load();
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

  setConfig<K extends keyof DevToolsConfig>(key: K, value: DevToolsConfig[K]) {
    this.config[key] = value;
    this.save();
  }

  updateConfig(patch: Partial<DevToolsConfig>) {
    Object.assign(this.config, patch);
    this.save();
  }
}

export const configStore = createStoreWithClass(ConfigStore);

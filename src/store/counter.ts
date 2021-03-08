import { createStoreWithClass } from "./factory";

class CounterStore {
  count = 0;
}

export const counter = createStoreWithClass(CounterStore);

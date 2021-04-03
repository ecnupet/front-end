import { useState } from "react";
import { createService } from "../services";
import { ConstructorOf } from "../types";

export function useService<Constructor extends ConstructorOf<object>>(
  constructor: Constructor,
  ...args: ConstructorParameters<Constructor>
): InstanceType<Constructor> {
  const [service] = useState(() => createService(constructor, ...args));
  return service as never;
}

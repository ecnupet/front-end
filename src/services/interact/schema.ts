export interface Messager {
  success(message: string): void;
  fail(reason: string): void;
  warning(info: string): void;
  info(info: string): void;
  internalError(cause: string): void;
}

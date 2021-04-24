export type KeyOf<T extends object> = Extract<keyof T, string>;
export type StandardEnum<T> = {
  [id: string]: T | string;
  [nu: number]: string;
};

export type PropertyDescribers<T extends object> = {
  [K in KeyOf<T>]: ModalProperty<T, K>;
};

export interface ModelDescriber<T extends object> {
  readonly modelName: string;
  readonly defaultValue: T;
  readonly displayNames: Record<KeyOf<T>, string>;
  readonly primaryKey: KeyOf<T>;
  readonly searchableKey?: KeyOf<T>;
  readonly properties: PropertyDescribers<T>;
  readonly currentValue?: T;
}

export type ValueType = string | number | boolean;
export type MapValueTypeToString<V extends ValueType> = V extends string
  ? "string" | "file"
  : V extends boolean
  ? "boolean"
  : "number" | "enum";
export type BasePropertyTypeDescriber<V extends ValueType> = {
  readonly defaultValue: V;
};

export interface StringPropertyDescriber
  extends BasePropertyTypeDescriber<string> {
  readonly type: "string";
  readonly textType?: "short" | "long";
}

export interface NumberPropertyDescriber
  extends BasePropertyTypeDescriber<number> {
  readonly type: "number";
}

export interface BooleanPropertyDescriber
  extends BasePropertyTypeDescriber<boolean> {
  readonly type: "boolean";
}

export interface EnumPropertyDescriber<Enum extends number>
  extends BasePropertyTypeDescriber<Enum> {
  readonly type: "enum";
  readonly enumObject: StandardEnum<Enum>;
  readonly displayNameMapping: Record<Enum, string>;
}

export type FileTypes = "image" | "video" | "others";

export interface FilePropertyDescriber
  extends BasePropertyTypeDescriber<string> {
  readonly type: "file";
  readonly fileType: FileTypes;
}

export interface PropertyTypeDescriberMapping<V> {
  string: StringPropertyDescriber;
  number: NumberPropertyDescriber;
  boolean: BooleanPropertyDescriber;
  // @ts-expect-error
  enum: EnumPropertyDescriber<V>;
  file: FilePropertyDescriber;
}

export interface ModalProperty<T extends object, K extends KeyOf<T>> {
  readonly propertyKey: K;
  readonly valueDescriber: PropertyTypeDescriberMapping<
    T[K] /* @ts-expect-error */
  >[MapValueTypeToString<T[K]>];
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly validator?: (value: T[K]) => string | undefined;
}

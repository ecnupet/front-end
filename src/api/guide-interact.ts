export interface DrugQueryMessage {
  queryObject: "drug";
}
export interface ChargeProjectQueryMessage {
  queryObject: "charge-project";
}
export interface RoomProcessQueryMessage {
  queryObject: "room-process";
  /**
   * process的访问路径，科室，科室内物品
   * [某科室]，[某科室, 某物品]
   */
  path: string[];
}

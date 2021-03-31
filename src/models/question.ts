/**
 * 题目类型（知识分类tag）枚举
 */
export enum QuestionType {
  /**
   * 传染病
   */
  InfectiousDisease = 0,
  /**
   * 寄生虫病
   */
  ParasiticDisease = 1,
  /**
   * 内科疾病
   */
  InternalDisease = 2,
  /**
   * 外产科疾病
   */
  ObstetricDisease = 3,
  /**
   * 宠物常用手术知识
   */
  SurgicalKnowledge = 4,
  /**
   * 宠物免疫知识
   */
  PetImmunity = 5,
}

export const NameOfQuestionType: Record<QuestionType, string> = {
  [QuestionType.InfectiousDisease]: "传染病",
  [QuestionType.ParasiticDisease]: "寄生虫病",
  [QuestionType.InternalDisease]: "内科疾病",
  [QuestionType.ObstetricDisease]: "外产科疾病",
  [QuestionType.SurgicalKnowledge]: "宠物常用手术知识",
  [QuestionType.PetImmunity]: "宠物免疫知识",
};

/**
 * 题目（选择题）
 */
export interface SingleSelectQuestion {
  /**
   * 题目ID
   */
  questionId: number;
  /**
   * 题目描述（题干）
   */
  description: string;
  /**
   * 题目类型（是知识分类，类似于tag）
   */
  type: QuestionType;
  /**
   * 选项
   */
  options: Record<string, string>;
  /**
   * 答题时间限制（单位秒）
   */
  duration: number;
}

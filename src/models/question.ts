/**
 * 题目类型（知识分类tag）枚举
 */
export enum QuestionType {
  Dog = 1,
  Cat = 2,
}

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

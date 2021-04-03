import { PersonInfoResponse } from "../../api";
import { QuestionType, SingleSelectQuestion } from "../../models";

export enum ResponseResultEnum {
  Success = 0,
  Fail = 1,
  Exist = 2,
  NotFound = 3,
  Invalid = 4,
  Valid = 5,
  Authorized = 6,
  Unauthorized = 7,
  TimedOut = 8,
}

export interface ResponseResultModel<TResult> {
  state: ResponseResultEnum;
  detail: string;
  data: TResult;
}

export interface NewQuizParams {
  userName: string;
  types: QuestionType[];
}
export interface NewQuizResult {
  questionId: number[];
  quizId: number;
}

export interface QuestionDetailParams {
  questionId: number;
}

export interface CheckQuestionParams {
  userName?: string;
  quizId: number;
  questionId: number;
  answer: string | null;
  /**
   * 答题花费时间，单位秒，整数
   */
  timeSpent: number;
}

export interface CheckQuestionResult {}

export interface PageQueryParams {
  page: number;
  pageSize: number;
}

export interface CommonParams {
  /**
   * 未来将被移除
   */
  userName?: string;
}

/**
 * 查询考试历史记录（分页查询）参数
 */
export interface QuizHistoryParams extends PageQueryParams, CommonParams {}

/**
 * 考试历史记录（单条的JSON格式）查询结果
 */
export interface QuizHistoryResult {
  quizId: number;
  types: QuestionType[];
  /**
   * 开始考试的时间
   */
  startTime: string;
  /**
   * 考试花费的时间
   */
  costTime: string;
  /**
   * 分数
   */
  point: number;
}

/**
 * 单次考试记录详情
 */
export interface QuizHistoryDetailParams extends CommonParams {
  quizId: number;
}

export interface QuizHistoryDetailResult {
  /**
   * 开始考试的时间
   */
  startTime: string;
  /**
   * 考试花费的时间
   */
  costTime: string;
  /**
   * 各道考题评判结果
   */
  results: Array<
    SingleSelectQuestion & {
      answer: string;
      choice: string;
      spend: number;
    }
  >;
}

export interface QuetionCorrectRateParams extends CommonParams {}

export interface QuizHistoryCountParams extends CommonParams {}

export interface QuizHistoryCountResult {
  number: number;
}

export interface PersonManageService {
  register(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>>;
  login(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>>;
  logout(): Promise<ResponseResultModel<any>>;
  userInfo(): Promise<ResponseResultModel<PersonInfoResponse>>;
}

export interface QuizService {
  /**
   * 创建新的考试
   * @param param 创建参数
   */
  newQuiz(param: NewQuizParams): Promise<ResponseResultModel<NewQuizResult>>;
  /**
   * 提交做题的答案
   * @param params 校验参数
   */
  checkQuestion(
    params: CheckQuestionParams
  ): Promise<ResponseResultModel<CheckQuestionResult>>;
  /**
   * 查询问题详细信息
   * @param params 查询参数
   */
  questionDetail(
    params: QuestionDetailParams
  ): Promise<ResponseResultModel<SingleSelectQuestion>>;
  /**
   * 考试记录分页查询
   * @param params 查询参数
   */
  quizHistory(
    params: QuizHistoryParams
  ): Promise<ResponseResultModel<QuizHistoryResult[]>>;
  /**
   * 考试记录数量查询
   * @param params 查询参数
   */
  quizHistoryCount(
    params: QuizHistoryCountParams
  ): Promise<ResponseResultModel<QuizHistoryCountResult>>;
  /**
   * 单个考试记录详情查询
   * @param params 查询参数
   */
  quizHistoryDetail(
    params: QuizHistoryDetailParams
  ): Promise<ResponseResultModel<QuizHistoryDetailResult>>;
}

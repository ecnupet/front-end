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
  type: QuestionType;
}
export interface NewQuizResult {
  questionId: number[];
  quizId: number;
}

export interface QuestionDetailParams {
  questionId: number;
}

export interface CheckQuestionParams {
  quizId: number;
  questionId: number;
  answer: string;
  timeSpent: number;
}

export interface CheckQuestionResult {
  correct: boolean;
}

export interface BackendService {
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
  newQuiz(param: NewQuizParams): Promise<ResponseResultModel<NewQuizResult>>;
  checkQuestion(
    params: CheckQuestionParams
  ): Promise<ResponseResultModel<CheckQuestionResult>>;
  questionDetail(
    params: QuestionDetailParams
  ): Promise<ResponseResultModel<SingleSelectQuestion>>;
}

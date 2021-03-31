import { PersonInfoResponse } from "../../api";
import { QuestionType, SingleSelectQuestion } from "../../models";
import { RealBackendService, RealQuizService } from "./impl";
import {
  NewQuizParams,
  ResponseResultModel,
  NewQuizResult,
  QuestionDetailParams,
} from "./schema";

export class MockBackendService extends RealBackendService {
  async login(): Promise<ResponseResultModel<any>> {
    return {
      state: 0,
      data: {},
      detail: "登录成功",
    };
  }

  async userInfo(): Promise<ResponseResultModel<PersonInfoResponse>> {
    return {
      detail: "",
      state: 0,
      data: {
        isAdmin: 0,
        name: "Darren",
      },
    };
  }

  async logout(): Promise<ResponseResultModel<any>> {
    return {
      data: null,
      detail: "",
      state: 0,
    };
  }

  async register(): Promise<ResponseResultModel<any>> {
    return {
      data: null,
      detail: "",
      state: 0,
    };
  }
}
export class MockQuizService extends RealQuizService {
  async newQuiz(
    params: NewQuizParams
  ): Promise<ResponseResultModel<NewQuizResult>> {
    console.log(params);
    return {
      data: {
        questionId: [1, 2, 3],
        quizId: 0,
      },
      detail: "xxx",
      state: 0,
    };
  }

  async questionDetail(
    params: QuestionDetailParams
  ): Promise<ResponseResultModel<SingleSelectQuestion>> {
    return {
      detail: "",
      state: 0,
      data: {
        description: `This is description.
Question ID = ${params.questionId}
Line3.
Line4.`,
        duration: 20,
        options: {
          A: "Wrong",
          B: "Right",
          C: "Wrong",
          D: "Wrong",
        },
        questionId: params.questionId,
        type: QuestionType.Cat,
      },
    };
  }
}

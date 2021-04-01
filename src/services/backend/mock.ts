import { PersonInfoResponse } from "../../api";
import { QuestionType, SingleSelectQuestion } from "../../models";
import { configStore } from "../../store/config";
import { withType } from "../../utils/common";
import { RealQuizService } from "./impl";
import {
  NewQuizParams,
  ResponseResultModel,
  NewQuizResult,
  QuestionDetailParams,
  QuizService,
  QuizHistoryResult,
  PersonManageService,
} from "./schema";

export const mockBackendService: PersonManageService = {
  async login(): Promise<ResponseResultModel<any>> {
    return {
      state: 0,
      data: {},
      detail: "登录成功",
    };
  },

  async userInfo(): Promise<ResponseResultModel<PersonInfoResponse>> {
    return {
      detail: "",
      state: 0,
      data: {
        isAdmin: 0,
        name: configStore.getConfig("mockUserName") || "Darren",
      },
    };
  },

  async logout(): Promise<ResponseResultModel<any>> {
    return {
      data: null,
      detail: "",
      state: 0,
    };
  },

  async register(): Promise<ResponseResultModel<any>> {
    return {
      data: null,
      detail: "",
      state: 0,
    };
  },
};
export class MockQuizService extends RealQuizService {
  async newQuiz(
    params: NewQuizParams
  ): Promise<ResponseResultModel<NewQuizResult>> {
    return {
      data: {
        questionId: [1, 2, 3],
        quizId: 0,
      },
      detail: params.userName,
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
        type: QuestionType.InfectiousDisease,
      },
    };
  }
}

function success<T>(data: T): ResponseResultModel<T> {
  return {
    state: 0,
    detail: "Mock 请求成功",
    data,
  };
}

const mockOptions = {
  A: "Correct",
  B: "Wrong",
  C: "Confusing",
  D: "xxx",
};
export const mockQuizService: QuizService = {
  async checkQuestion() {
    return success({
      correct: true,
    });
  },
  async newQuiz() {
    return success({
      quizId: 1,
      questionId: [2, 3, 4],
    });
  },
  async questionDetail(params) {
    return success({
      description: `This is question ${params.questionId}`,
      duration: 10,
      type: QuestionType.InfectiousDisease,
      questionId: params.questionId,
      options: mockOptions,
    });
  },
  async quizHistory() {
    return success([
      withType<QuizHistoryResult>({
        quizId: 1,
        costTime: "7s",
        point: 100,
        startTime: "2021-3-31",
        types: [QuestionType.InfectiousDisease],
      }),
      withType<QuizHistoryResult>({
        quizId: 2,
        costTime: "19s",
        point: 100,
        startTime: "2021-3-31",
        types: [QuestionType.InfectiousDisease, QuestionType.ObstetricDisease],
      }),
    ]);
  },
  async quizHistoryDetail() {
    return success({
      costTime: "",
      results: [
        {
          questionId: 1,
          answer: "A",
          choice: "B",
          description: "Desc",
          duration: 10,
          options: mockOptions,
          spend: 7,
          type: QuestionType.InfectiousDisease,
        },
        {
          questionId: 2,
          answer: "A",
          choice: "B",
          description: "Desc",
          duration: 10,
          options: mockOptions,
          spend: 7,
          type: QuestionType.InfectiousDisease,
        },
        {
          questionId: 3,
          answer: "A",
          choice: "B",
          description: "Desc",
          duration: 10,
          options: mockOptions,
          spend: 7,
          type: QuestionType.InfectiousDisease,
        },
      ],
      startTime: "2021-3-31",
    });
  },
};

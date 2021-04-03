import { PersonInfoResponse } from "../../api";
import { QuestionType, SingleSelectQuestion } from "../../models";
import { configStore } from "../../store/config";
import { RealQuizService } from "./impl";
import {
  ResponseResultModel,
  NewQuizResult,
  QuestionDetailParams,
  QuizService,
  QuizHistoryResult,
  PersonManageService,
  PageQueryParams,
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
  async newQuiz(): Promise<ResponseResultModel<NewQuizResult>> {
    return success({
      questionId: [1, 2, 3],
      quizId: 0,
    });
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
function mockList<T extends object>(
  model: T,
  idKey: keyof T,
  count: number,
  idType: "string" | "number" = "number"
): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(
      Object.assign({}, model, {
        [idKey]: idType === "number" ? i : i.toString(),
      })
    );
  }
  return result;
}
/**
 * 分页查询mock，页号从1开始
 * @param source 数据源
 * @param param1 分页查询参数
 * @returns 分页切片
 */
function pageQuery<T extends object>(
  source: T[],
  { page, pageSize }: PageQueryParams
) {
  const start = (page - 1) * pageSize;
  return source.slice(start, start + pageSize);
}
const histories = mockList<QuizHistoryResult>(
  {
    quizId: 1,
    costTime: "7s",
    point: 100,
    startTime: "2021-3-31",
    types: [QuestionType.InfectiousDisease],
  },
  "quizId",
  20
);
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
  async quizHistory(param) {
    return success(pageQuery(histories, param));
  },
  async quizHistoryCount() {
    return success({
      number: 20,
    });
  },
  async quizHistoryDetail() {
    return success({
      costTime: "",
      results: mockList(
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
        "questionId",
        100
      ).map((result) => ({
        ...result,
        choice: ["A", "B", "C", "D", null][~~(Math.random() * 5)]!,
      })),
      startTime: "2021-3-31",
    });
  },
};

import { PersonInfomation, PersonInfoResponse } from "../../api";
import { ChargeProject, Disease, Drug } from "../../api/info-manage";
import {
  QuestionType,
  SingleSelectQuestion,
  SingleSelectQuestionWithAnswer,
} from "../../models";
import { configStore } from "../../store/config";
import { ObjectEntries } from "../../utils/common";
import { RealQuizService } from "./impl";
import {
  ResponseResultModel,
  NewQuizResult,
  QuestionDetailParams,
  QuizService,
  QuizHistoryResult,
  PersonManageService,
  PageQueryParams,
  CRUDService,
  PageQueryResult,
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
        authorization: 1,
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

function notfound<T>(): ResponseResultModel<T> {
  return {
    state: 3,
    data: (null as unknown) as T,
    detail: "未找到",
  };
}

const mockOptions = {
  A: "Correct",
  B: "Wrong",
  C: "Confusing",
  D: "xxx",
};

function simulate<T>(obj: T): T {
  if (typeof obj === "boolean") {
    return ((Math.random() < 0.5) as unknown) as T;
  }
  if (typeof obj === "number") {
    return ((Math.random() * obj) as unknown) as T;
  }
  if (typeof obj === "string") {
    return ([...obj].sort(() => Math.random() - 0.5).join("") as unknown) as T;
  }
  if (Array.isArray(obj)) {
    return (obj
      .map((o) => simulate(o))
      .sort(() => Math.random() - 0.5) as unknown) as T;
  }
  return ObjectEntries(obj).reduce<Partial<T>>((prev, [key, value]) => {
    prev[key] = simulate(value);
    return prev;
  }, {}) as T;
}

function mockList<T extends object>(
  model: T,
  idKey: keyof T,
  count: number,
  idType: "string" | "number" = "number"
): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(
      Object.assign({}, simulate(model), {
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
  async questionGeneralStatistics() {
    return success({
      averageAnswerTime: 15.67,
      totalCommitCount: 300,
      totalCorrectCount: 250,
      totalNoAnswerCount: 20,
      totalWrongCount: 30,
    });
  },
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

class AbstractCRUDService<T extends object> implements CRUDService<T> {
  database: T[] = [];
  constructor(public readonly idKey: keyof T) {}
  private nextId() {
    return 1 + Math.max(0, ...this.database.map((data) => +data[this.idKey]));
  }
  async create(model: Partial<T>): Promise<ResponseResultModel<any>> {
    this.database.push({ ...model, [this.idKey]: this.nextId() } as T);
    return success(null);
  }
  async retrieve(id: number): Promise<ResponseResultModel<T>> {
    const record = this.database.find(
      (data) => ((data[this.idKey] as unknown) as number) === id
    );
    return record ? success(record) : notfound();
  }
  async query(
    params: PageQueryParams
  ): Promise<ResponseResultModel<PageQueryResult<T>>> {
    return success({
      count: this.database.length,
      records: pageQuery(this.database, params),
    });
  }
  async count(): Promise<ResponseResultModel<number>> {
    return success(this.database.length);
  }
  async update(model: Partial<T>): Promise<ResponseResultModel<any>> {
    const record = this.database.find(
      (data) => data[this.idKey] === model[this.idKey]
    );
    if (record) {
      Object.assign(record, model);
      return success(null);
    }
    return notfound();
  }
  async delete(id: number): Promise<ResponseResultModel<any>> {
    const record = this.database.findIndex(
      (data) => data[this.idKey] === (id as never)
    );
    if (record !== -1) {
      this.database.splice(record, 1);
      return success(null);
    }
    return notfound();
  }
}

const drugs: Drug[] = mockList<Drug>(
  {
    id: 0,
    drugUsage: "电脑配件",
    drugSave: "避光保存",
    drugPrice: 100,
    drugName: "kusuri",
  },
  "id",
  100,
  "number"
);
class MockDrugService extends AbstractCRUDService<Drug> {
  database = drugs;
}
export const mockDrugService: CRUDService<Drug> = new MockDrugService("id");

const questions = mockList<SingleSelectQuestionWithAnswer>(
  {
    questionId: 0,
    description: "这道题选A",
    duration: 10,
    options: mockOptions,
    type: QuestionType.InfectiousDisease,
    answer: "A",
  },
  "questionId",
  100,
  "number"
);
class MockQuestionService extends AbstractCRUDService<SingleSelectQuestionWithAnswer> {
  database = questions;
}
export const mockQuestionService = new MockQuestionService("questionId");
const diseases = mockList<Disease>(
  {
    id: 0,
    diseaseName: "某不科学的疾病",
    diseaseType: "某不知名的类型",
  },
  "id",
  100
);
class MockDiseaseService extends AbstractCRUDService<Disease> {
  database = diseases;
}

export const mockDiseaseService = new MockDiseaseService("id");

const chargeProjects = mockList<ChargeProject>(
  {
    id: 0,
    projectCharge: 0,
    projectDescription: "",
    projectName: "",
  },
  "id",
  100,
  "number"
);

class MockChargeProjectService extends AbstractCRUDService<ChargeProject> {
  database = chargeProjects;
}

export const mockChargeProjectService = new MockChargeProjectService("id");

const userInformation = mockList<PersonInfomation>(
  {
    id: 0,
    authorization: 1,
    password: [],
    userName: "Darren",
  },
  "id",
  100,
  "number"
);

class MockPersonInformationService extends AbstractCRUDService<PersonInfomation> {
  database = userInformation;
}

export const mockPersonInformationService = new MockPersonInformationService(
  "id"
);

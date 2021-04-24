import { apiCaller, axiosInstance, PersonInfoResponse } from "../../api";
import { Drug } from "../../api/info-manage";
import {
  SingleSelectQuestion,
  SingleSelectQuestionWithAnswer,
} from "../../models";
import { getPasswordNumberArray, RequestHook } from "../../utils/common";
import {
  PersonManageService,
  CheckQuestionParams,
  CheckQuestionResult,
  NewQuizParams,
  NewQuizResult,
  QuestionDetailParams,
  QuizHistoryDetailParams,
  QuizHistoryDetailResult,
  QuizHistoryParams,
  QuizHistoryResult,
  QuizService,
  ResponseResultModel,
  QuizHistoryCountParams,
  QuizHistoryCountResult,
  QuetionStatisticsResult,
  CRUDService,
  PageQueryResult,
  SearchParams,
} from "./schema";

export class RealBackendService implements PersonManageService {
  async userInfo(): Promise<ResponseResultModel<PersonInfoResponse>> {
    const result = await apiCaller.get(
      "/api/pm/user/userinfo",
      undefined as never
    );
    return result;
  }
  async register(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>> {
    const result = await apiCaller.post("/api/pm/user/logon", {
      name: form.uid,
      password: await getPasswordNumberArray(form.password),
    });
    return result;
  }
  async login(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>> {
    const result = await apiCaller.post("/api/pm/user/login", {
      name: form.uid,
      password: await getPasswordNumberArray(form.password),
    });
    return result;
  }
  async logout() {
    const result = await apiCaller.post(
      "/api/pm/user/logout",
      undefined as never
    );
    return result;
  }
}

export class RealQuizService implements QuizService {
  async questionGeneralStatistics(): Promise<
    ResponseResultModel<QuetionStatisticsResult>
  > {
    const result = await axiosInstance.get("/api/tl/statistics");
    return result.data;
  }
  async quizHistoryCount(
    params: QuizHistoryCountParams
  ): Promise<ResponseResultModel<QuizHistoryCountResult>> {
    const result = await axiosInstance.get("/api/tl/quiz/history/num", {
      params,
    });
    return result.data;
  }
  async questionDetail(
    params: QuestionDetailParams
  ): Promise<ResponseResultModel<SingleSelectQuestion>> {
    const result = await axiosInstance.get("/api/tl/question/detail", {
      params,
    });
    return result.data;
  }
  async newQuiz(
    params: NewQuizParams
  ): Promise<ResponseResultModel<NewQuizResult>> {
    const result = await axiosInstance.post("/api/tl/quiz/new", params);
    return result.data;
  }
  async checkQuestion(
    params: CheckQuestionParams
  ): Promise<ResponseResultModel<CheckQuestionResult>> {
    const result = await axiosInstance.post("/api/tl/quiz/correct", params);
    return result.data;
  }
  async quizHistory(
    params: QuizHistoryParams
  ): Promise<ResponseResultModel<QuizHistoryResult[]>> {
    const result = await axiosInstance.get("/api/tl/quiz/history", {
      params,
    });
    return result.data;
  }
  async quizHistoryDetail(
    params: QuizHistoryDetailParams
  ): Promise<ResponseResultModel<QuizHistoryDetailResult>> {
    const result = await axiosInstance.get("/api/tl/quiz/history/detail", {
      params,
    });
    return result.data;
  }
}

export class RealDrugCRUDService implements CRUDService<Drug> {
  async query(
    params: SearchParams
  ): Promise<ResponseResultModel<PageQueryResult<Drug>>> {
    // @ts-expect-error
    return await apiCaller.get("/api/im/drug", params);
  }
  @RequestHook<Partial<Drug>>({
    paramRewrite(drug) {
      delete drug.id;
      return drug;
    },
  })
  async create(model: Drug): Promise<ResponseResultModel<any>> {
    return await apiCaller.post("/api/im/drugadd", model);
  }
  retrieve(): Promise<ResponseResultModel<Drug>> {
    throw new Error("Method not implemented.");
  }
  async update(model: Drug): Promise<ResponseResultModel<any>> {
    return await apiCaller.post("/api/im/drugupdate", model);
  }
  async delete(id: number): Promise<ResponseResultModel<any>> {
    return await apiCaller.post("/api/im/drugdelete", { id });
  }
}

export class RealQuestionCRUDService
  implements CRUDService<SingleSelectQuestionWithAnswer> {
  @RequestHook<Partial<SingleSelectQuestionWithAnswer>>({
    paramRewrite(param) {
      delete param.questionId;
      return param;
    },
  })
  async create(
    model: Partial<SingleSelectQuestionWithAnswer>
  ): Promise<ResponseResultModel<any>> {
    const result = await axiosInstance.post(
      "/api/tl/admin/question/insert",
      model
    );
    return result.data;
  }
  retrieve(): Promise<ResponseResultModel<SingleSelectQuestionWithAnswer>> {
    throw new Error("Method not implemented.");
  }
  async query(
    params: SearchParams
  ): Promise<
    ResponseResultModel<PageQueryResult<SingleSelectQuestionWithAnswer>>
  > {
    const result = await axiosInstance.get("/api/tl/admin/question", {
      params,
    });
    return result.data;
  }
  async update(
    model: Partial<SingleSelectQuestionWithAnswer>
  ): Promise<ResponseResultModel<any>> {
    const result = await axiosInstance.post(
      "/api/tl/admin/question/update",
      model
    );
    return result.data;
  }
  async delete(id: number): Promise<ResponseResultModel<any>> {
    const result = await axiosInstance.post("/api/tl/admin/question/delete", {
      questionId: id,
    });
    return result.data;
  }
}

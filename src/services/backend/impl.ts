import { apiCaller, axiosInstance, PersonInfoResponse } from "../../api";
import { Drug } from "../../api/info-manage";
import { SingleSelectQuestion } from "../../models";
import { getPasswordNumberArray } from "../../utils/common";
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
  PageQueryParams,
  PageQueryResult,
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
      password: getPasswordNumberArray(form.password),
    });
    return result;
  }
  async login(form: {
    uid: string;
    password: string;
  }): Promise<ResponseResultModel<any>> {
    const result = await apiCaller.post("/api/pm/user/login", {
      name: form.uid,
      password: getPasswordNumberArray(form.password),
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
  query(
    params: PageQueryParams
  ): Promise<ResponseResultModel<PageQueryResult<Drug>>> {
    console.log(params);
    throw new Error("Method not implemented.");
  }
  create(model: Partial<Drug>): Promise<ResponseResultModel<any>> {
    console.log(model);
    throw new Error("Method not implemented.");
  }
  retrieve(id: number): Promise<ResponseResultModel<Drug>> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
  update(model: Partial<Drug>): Promise<ResponseResultModel<any>> {
    console.log(model);
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<ResponseResultModel<any>> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
}

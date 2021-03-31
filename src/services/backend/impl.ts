import { apiCaller, axiosInstance, PersonInfoResponse } from "../../api";
import { SingleSelectQuestion } from "../../models";
import { getPasswordNumberArray } from "../../utils/common";
import {
  BackendService,
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
} from "./schema";

export class RealBackendService implements BackendService {
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
  async questionDetail(
    params: QuestionDetailParams
  ): Promise<ResponseResultModel<SingleSelectQuestion>> {
    const result = await axiosInstance.get("/api/tl/quiz/detail", { params });
    return result.data;
  }
  async newQuiz(
    params: NewQuizParams
  ): Promise<ResponseResultModel<NewQuizResult>> {
    const result = await axiosInstance.get("/api/tl/quiz/new", {
      params,
    });
    return result.data;
  }

  async checkQuestion(
    params: CheckQuestionParams
  ): Promise<ResponseResultModel<CheckQuestionResult>> {
    const result = await axiosInstance.get("/api/tl/quiz/correct", {
      params,
    });
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

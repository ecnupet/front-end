import { apiCaller, axiosInstance, PersonInfoResponse } from "../../api";
import { SingleSelectQuestion } from "../../models";
import { globalStore } from "../../store";
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
  CommonParams,
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
  @RequestHook<CommonParams>({
    paramRewrite: (params) => ({
      ...params,
      userName: globalStore.user.userName,
    }),
  })
  async quizHistoryCount(
    params: QuizHistoryCountParams
  ): Promise<ResponseResultModel<QuizHistoryCountResult>> {
    const result = await axiosInstance.get("/api/tl/quiz/history/num", {
      params,
    });
    return result.data;
  }
  @RequestHook<CommonParams>({
    paramRewrite: (params) => ({
      ...params,
      userName: globalStore.user.userName,
    }),
  })
  async questionDetail(
    params: QuestionDetailParams
  ): Promise<ResponseResultModel<SingleSelectQuestion>> {
    const result = await axiosInstance.get("/api/tl/question/detail", {
      params,
    });
    return result.data;
  }
  @RequestHook<CommonParams>({
    paramRewrite: (params) => ({
      ...params,
      userName: globalStore.user.userName,
    }),
  })
  async newQuiz(
    params: NewQuizParams
  ): Promise<ResponseResultModel<NewQuizResult>> {
    const result = await axiosInstance.post("/api/tl/quiz/new", params);
    return result.data;
  }
  @RequestHook<CommonParams>({
    paramRewrite: (params) => ({
      ...params,
      userName: globalStore.user.userName,
    }),
  })
  async checkQuestion(
    params: CheckQuestionParams
  ): Promise<ResponseResultModel<CheckQuestionResult>> {
    const result = await axiosInstance.post("/api/tl/quiz/correct", params);
    return result.data;
  }
  @RequestHook<CommonParams>({
    paramRewrite: (params) => ({
      ...params,
      userName: globalStore.user.userName,
    }),
  })
  async quizHistory(
    params: QuizHistoryParams
  ): Promise<ResponseResultModel<QuizHistoryResult[]>> {
    const result = await axiosInstance.get("/api/tl/quiz/history", {
      params,
    });
    return result.data;
  }
  @RequestHook<CommonParams>({
    paramRewrite: (params) => ({
      ...params,
      userName: globalStore.user.userName,
    }),
  })
  async quizHistoryDetail(
    params: QuizHistoryDetailParams
  ): Promise<ResponseResultModel<QuizHistoryDetailResult>> {
    const result = await axiosInstance.get("/api/tl/quiz/history/detail", {
      params,
    });
    return result.data;
  }
}

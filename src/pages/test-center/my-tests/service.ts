import { makeAutoObservable } from "mobx";
import {
  BackendServiceFactory,
  QuizHistoryDetailResult,
  QuizHistoryResult,
} from "../../../services";
import { openPage } from "../../../utils/common";

export class MyTestsService {
  constructor() {
    makeAutoObservable(this);
  }

  page = 1;
  pageSize = 5;
  totalCount = 0;
  setTotalCount(count: number) {
    this.totalCount = count;
  }
  modalVisable = false;

  historyDetail: QuizHistoryDetailResult | null = null;

  pendingRequest: Promise<QuizHistoryResult[]> = Promise.resolve([]);

  fetchQuizHistory(page: number, pageSize: number) {
    this.pendingRequest = this.requestQuizHistory(page, pageSize);
  }

  async fetchQuisHistoryCount() {
    const result = await BackendServiceFactory.getQuizService().quizHistoryCount(
      {}
    );
    this.setTotalCount(result.data.number);
    return result.data;
  }

  async requestQuizHistory(page: number, pageSize: number) {
    const result = await BackendServiceFactory.getQuizService().quizHistory({
      page,
      pageSize,
    });
    return result.data;
  }

  handleChangePage(page: number, pageSize?: number) {
    console.log("page change");
    this.pageSize = pageSize ?? this.pageSize;
    this.page = page;
  }

  async handleOpenDetail(quizId: number) {
    openPage("/test-result", { quizId });
  }

  handleCloseModal() {
    this.modalVisable = false;
  }
}

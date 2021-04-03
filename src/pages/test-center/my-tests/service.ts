import { makeAutoObservable } from "mobx";
import {
  BackendServiceFactory,
  QuizHistoryDetailResult,
  QuizHistoryResult,
} from "../../../services";
import { globalStore } from "../../../store";

export class MyTestsService {
  constructor() {
    makeAutoObservable(this);
  }

  page = 1;
  pageSize = 5;
  modalVisable = false;
  historyDetail: QuizHistoryDetailResult | null = null;

  pendingRequest: Promise<QuizHistoryResult[]> = Promise.resolve([]);

  fetchQuizHistory(page: number, pageSize: number) {
    this.pendingRequest = this.requestQuizHistory(page, pageSize);
  }

  private async requestQuizHistory(page: number, pageSize: number) {
    const result = await BackendServiceFactory.getQuizService().quizHistory({
      userName: globalStore.user.userName,
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
    const result = await BackendServiceFactory.getQuizService().quizHistoryDetail(
      { quizId }
    );
    this.handleShowDetail(result.data);
  }

  handleShowDetail(detail: QuizHistoryDetailResult) {
    this.historyDetail = detail;
    this.modalVisable = true;
  }

  handleCloseModal() {
    this.modalVisable = false;
  }
}

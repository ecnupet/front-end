import { makeAutoObservable } from "mobx";
import { QuestionType } from "../../../models";
import { BackendServiceFactory } from "../../../services";
import { globalStore } from "../../../store";
import { openPage, withType } from "../../../utils/common";
import { TakeTestParameters } from "../../take-test";

export interface NewTestForm {
  types: QuestionType[];
}

export class NewTestService {
  constructor() {
    makeAutoObservable(this);
  }

  selectedTypes: QuestionType[] = [];
  selectedCount: number = 0;
  allTypes: QuestionType[] = Object.values(QuestionType).filter(
    (v) => typeof v === "number"
  ) as never;
  async fetchAllTypes() {
    this.allTypes = [];
  }

  async handleCreateNewTest(form: NewTestForm) {
    const username = globalStore.user.userName;
    const {
      data: { questionId, quizId },
    } = await BackendServiceFactory.getQuizService().newQuiz({
      types: form.types,
      userName: username,
    });
    openPage(
      "/take-test",
      withType<TakeTestParameters>({ questionIds: questionId, quizId })
    );
  }
}

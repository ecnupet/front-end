import { makeAutoObservable, toJS } from "mobx";
import { TakeTestParameters } from ".";
import { QuestionType, SingleSelectQuestion } from "../../models";
import { BackendServiceFactory, InteractFactory } from "../../services";
import { parseQueryParameter } from "../../utils/common";

export class TakeTestService {
  constructor() {
    const params = parseQueryParameter(TakeTestService.getDefault());
    const { questionIds } = params;
    this.setQuestionIds(questionIds);
    makeAutoObservable(this);
  }
  questionIds: number[] = [];
  setQuestionIds(ids: number[]) {
    this.questionIds = ids;
  }
  question: SingleSelectQuestion = TakeTestService.getDefaultQuestion();
  index: number = 0;
  selectedAnswer = "";
  get no() {
    return this.index + 1;
  }
  get done() {
    return this.index === this.questionIds.length;
  }
  setQuestion(question: SingleSelectQuestion) {
    this.question = question;
  }
  async fetchQuestionDetail() {
    const detail = await BackendServiceFactory.getQuizService(
      /* TODO real */ "mock"
    ).questionDetail({ questionId: this.questionIds[this.index]! });
    this.setQuestion(detail.data);
  }

  nextQuestion() {
    this.submitAnswer();
    if (this.index < this.questionIds.length - 1) {
      this.index++;
    } else {
      InteractFactory.getMessager().success(
        "您已完成所有题目！三秒后窗口自动关闭"
      );
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }

  handleSelect(option: string) {
    this.selectedAnswer = option;
  }

  handleTimeout() {
    InteractFactory.getMessager().warning("本题时间已用完！");
    this.nextQuestion();
  }

  submitAnswer() {
    console.log(this.selectedAnswer, toJS(this.question));
  }

  static getDefaultQuestion(): SingleSelectQuestion {
    return {
      description: "",
      duration: 10,
      options: {
        A: "Option A",
        B: "Option B",
      },
      questionId: 0,
      type: QuestionType.InfectiousDisease,
    };
  }
  static getDefault(): TakeTestParameters {
    return {
      questionIds: [0, 1, 2],
      quizId: -1,
    };
  }
}

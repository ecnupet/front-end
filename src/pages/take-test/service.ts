import { makeAutoObservable } from "mobx";
import { TakeTestParameters } from ".";
import { QuestionType, SingleSelectQuestion } from "../../models";
import { BackendServiceFactory, InteractFactory } from "../../services";
import { parseQueryParameter } from "../../utils/common";

export class TakeTestService {
  constructor() {
    const params = parseQueryParameter(TakeTestService.getDefault());
    const { questionIds, quizId } = params;
    this.questionIds = questionIds;
    this.quizId = quizId;
    makeAutoObservable(this);
  }
  private questionIds: number[] = [];
  private quizId: number;
  index: number = 0;
  get count() {
    return this.questionIds.length;
  }
  get questionId() {
    return this.questionIds[this.index]!;
  }
  selectedAnswer: string | null = null;
  get no() {
    return this.index + 1;
  }
  get done() {
    return this.index === this.questionIds.length;
  }
  private enterTime: Date | null = null;
  currentQuestion: SingleSelectQuestion | null = null;
  async fetchQuestionDetail(questionId: number) {
    const detail = await BackendServiceFactory.getQuizService().questionDetail({
      questionId,
    });
    this.handleEnter(detail.data);
    return detail.data;
  }

  handleEnter(question: SingleSelectQuestion) {
    this.enterTime = new Date();
    this.currentQuestion = question;
  }
  handleLeave() {
    this.enterTime = null;
  }

  async handleToNextQuestion() {
    await this.handleSubmitAnswer();
    this.selectedAnswer = null;
    this.handleLeave();
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
    if (this.enterTime === null) return;
    InteractFactory.getMessager().warning("本题时间已用完！");
    this.handleToNextQuestion();
  }

  async handleSubmitAnswer() {
    const now = Date.now();
    await BackendServiceFactory.getQuizService().checkQuestion({
      answer: this.selectedAnswer,
      questionId: this.questionIds[this.index]!,
      quizId: this.quizId,
      timeSpend: Math.round((now - +this.enterTime!) / 1000),
    });
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
      questionIds: [],
      quizId: -1,
    };
  }
}

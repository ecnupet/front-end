import { Button, Progress, Spin } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import { observer } from "mobx-react";
import React from "react";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { SingleSelectQuestionComponent } from "../../components/single-select-question";
import { SingleSelectQuestion } from "../../models";
import { useService } from "../../utils/hooks";
import { PromiseState, useRequest } from "../../utils/hooks/use-request";
import { TakeTestService } from "./service";
import styles from "./style.module.css";

export interface TakeTestParameters {
  questionIds: number[];
  quizId: number;
}

export const TakeTestPage: React.FC = observer(() => {
  const service = useService(TakeTestService);
  const { count } = service;
  const [question, state] = useRequest(service.fetchQuestionDetail, [
    service.questionId,
  ]);
  return render(
    service,
    count,
    question ?? {
      description: "",
      duration: 0,
      options: {},
      questionId: -1,
      type: -1,
    },
    state
  );
});
function render(
  service: TakeTestService,
  length: number,
  question: SingleSelectQuestion,
  state: PromiseState
): JSX.Element {
  return (
    <ManageStyleLayout title="测试">
      <section className={styles.pane}>
        <header className={styles.header}>
          <Progress
            type="line"
            percent={~~((service.no * 100) / length)}
            format={(percent) =>
              `${Math.round(((percent ?? 0) * length) / 100)} / ${length}`
            }
          ></Progress>
          <h2>第{service.no}题</h2>
        </header>
        <main className={styles.main}>
          <Spin spinning={state === "pending"}>
            <Countdown
              value={+new Date() + 1000 * question.duration}
              onFinish={service.handleTimeout}
            ></Countdown>
            <SingleSelectQuestionComponent
              question={question}
              onSelect={service.handleSelect}
            ></SingleSelectQuestionComponent>
          </Spin>
        </main>
        <footer className={styles.footer}>
          <Button type="primary" onClick={service.handleToNextQuestion}>
            下一题
          </Button>
        </footer>
      </section>
    </ManageStyleLayout>
  );
}

import { Button, Progress } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { SingleSelectQuestionComponent } from "../../components/single-select-question";
import { QuestionType } from "../../models";
import { useService } from "../../utils/hooks";
import { TakeTestService } from "./service";
import styles from "./style.module.css";

export interface TakeTestParameters {
  questionIds: number[];
  quizId: number;
}

export const TakeTestPage: React.FC = observer(() => {
  const service = useService(TakeTestService);
  useEffect(() => {
    service.fetchQuestionDetail();
  }, [service, service.index]);
  const {
    questionIds: { length },
    no,
    question,
  } = service;
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
          <h2>第{no}题</h2>
          <span>分类： </span>
          <span className={styles.category}>
            #{QuestionType[question.type]}
          </span>
          <Countdown
            value={+new Date() + 1000 * question.duration}
            onFinish={service.handleTimeout}
          ></Countdown>
        </header>
        <main className={styles.main}>
          <SingleSelectQuestionComponent
            question={service.question}
            onSelect={service.handleSelect}
          ></SingleSelectQuestionComponent>
        </main>
        <footer className={styles.footer}>
          <Button type="primary" onClick={service.nextQuestion}>
            下一题
          </Button>
        </footer>
      </section>
    </ManageStyleLayout>
  );
});

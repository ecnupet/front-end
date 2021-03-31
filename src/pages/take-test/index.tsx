import { Button, Progress } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import { Observer } from "mobx-react-lite";
import React from "react";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { PromiseBuilder } from "../../components/promise-builder";
import { SingleSelectQuestionComponent } from "../../components/single-select-question";
import { NameOfQuestionType } from "../../models";
import { useService } from "../../utils/hooks";
import { TakeTestService } from "./service";
import styles from "./style.module.css";

export interface TakeTestParameters {
  questionIds: number[];
  quizId: number;
}

export const TakeTestPage: React.FC = () => {
  const service = useService(TakeTestService);
  const { count } = service;
  return render(service, count);
};
function render(service: TakeTestService, length: number): JSX.Element {
  return (
    <ManageStyleLayout title="测试">
      <section className={styles.pane}>
        <header className={styles.header}>
          <Observer>
            {() => (
              <>
                <Progress
                  type="line"
                  percent={~~((service.no * 100) / length)}
                  format={(percent) =>
                    `${Math.round(((percent ?? 0) * length) / 100)} / ${length}`
                  }
                ></Progress>
                <h2>第{service.no}题</h2>
              </>
            )}
          </Observer>
        </header>
        <main className={styles.main}>
          <Observer
            children={() => (
              <PromiseBuilder
                promise={service.fetchQuestionDetail(service.questionId)}
                onDone={service.handleEnter}
                render={(question) => (
                  <>
                    <Countdown
                      value={+new Date() + 1000 * question.duration}
                      onFinish={service.handleTimeout}
                    ></Countdown>
                    <span>分类： </span>
                    <span className={styles.category}>
                      #{NameOfQuestionType[question.type]}
                    </span>
                    <SingleSelectQuestionComponent
                      question={question}
                      onSelect={service.handleSelect}
                    ></SingleSelectQuestionComponent>
                  </>
                )}
              ></PromiseBuilder>
            )}
          ></Observer>
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

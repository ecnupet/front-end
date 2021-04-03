import { Divider, Result } from "antd";
import React, { useState } from "react";
import { ManageStyleLayout } from "../../components/layout/manage-style";
import { PromiseBuilder } from "../../components/promise-builder";
import { SingleSelectQuestionComponent } from "../../components/single-select-question";
import {
  BackendServiceFactory,
  CorrectResult,
  QuizHistoryDetailParams,
} from "../../services";
import { useParams } from "../../utils/hooks/use-params";
import { useRequest } from "../../utils/hooks/use-request";
import { mergeClassName } from "../../utils/ui/class-name";
import { globalCss } from "../../utils/ui/global-css";
import styles from "./style.module.css";

export const TestResultPage: React.FC = () => {
  const params = useParams<QuizHistoryDetailParams>({ quizId: -1 });
  const [selected, setSelected] = useState<number>(0);
  const [
    details,
    state,
    retry,
  ] = useRequest(BackendServiceFactory.getQuizService().quizHistoryDetail, [
    params,
  ]);
  const question = details?.data.results[selected];
  const answer = details?.data.results[selected]?.answer;
  return (
    <ManageStyleLayout title="测试结果">
      <PromiseBuilder state={state} retry={retry}>
        {(details?.data?.results?.length ?? 0) === 0 ? (
          <Result status="404" title="暂无内容"></Result>
        ) : (
          <section
            className={mergeClassName(styles.section, globalCss("rest"))}
          >
            <aside className={styles.aside}>
              <AnswerCard
                answers={details?.data.results ?? []}
                onSelect={(index) => {
                  setSelected(index);
                }}
                selected={selected}
              ></AnswerCard>
            </aside>
            <main className={styles.main}>
              <Divider></Divider>
              <h2>第{selected + 1}题</h2>
              <Divider></Divider>
              <p>
                花费时间 / 限制时间：{question!.spend}秒 / {question!.duration}
                秒
              </p>
              <Divider></Divider>

              <SingleSelectQuestionComponent
                question={
                  question ?? {
                    description: "",
                    duration: 0,
                    options: {},
                    questionId: -1,
                    type: 0,
                  }
                }
                choice={question?.choice}
                answer={answer}
              ></SingleSelectQuestionComponent>
            </main>
          </section>
        )}
      </PromiseBuilder>
    </ManageStyleLayout>
  );
};

interface IAnswerCardProp {
  answers: CorrectResult[];
  selected?: number;
  onSelect(index: number): void;
}

const AnswerCard: React.FC<IAnswerCardProp> = ({
  answers,
  onSelect,
  selected,
}) => {
  return (
    <div className={styles.card}>
      {answers.map((answer, index) => (
        <div
          key={index}
          onClick={() => onSelect(index)}
          className={mergeClassName(
            styles.block,
            answer.choice === null
              ? styles.missed
              : answer.choice === answer.answer
              ? styles.correct
              : styles.error,
            selected === index ? styles.selected : ""
          )}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

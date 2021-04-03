import { Divider, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { NameOfQuestionType, SingleSelectQuestion } from "../../models";
import styles from "./style.module.css";

interface QuestionItemProp {
  question: SingleSelectQuestion;
  answer?: string;
  /**
   * 如果有选项和答案，则为展示选择和答案
   */
  choice?: string | null;
  onSelect?(option: string): any;
}

export const SingleSelectQuestionComponent: React.FC<QuestionItemProp> = (
  props
) => {
  const { question, answer, choice } = props;
  const { description, options } = question;
  const [select, setSelect] = useState<string | undefined>();
  useEffect(() => {
    setSelect(undefined);
  }, [question, choice]);
  const isShowAnswer = answer !== undefined;
  const isRight = answer === choice;
  return (
    <div>
      <span>分类： </span>
      <span className={styles.category}>
        #{NameOfQuestionType[question.type]}
      </span>
      <Divider></Divider>
      <p className={styles.description}>{description}</p>
      <Divider></Divider>
      {isShowAnswer ? (
        <>
          {Object.entries(options).map(([option, desc]) => (
            <p key={option}>
              {option} {desc}
            </p>
          ))}
          <Divider></Divider>
          <div>
            正确答案：<span className={styles.correct}>{answer}</span>
          </div>
          <div>
            您的选择：
            <span className={isRight ? styles.correct : styles.wrong}>
              {choice ?? "未作答"}
            </span>
          </div>
        </>
      ) : (
        <Radio.Group
          optionType="default"
          disabled={answer !== undefined}
          value={select}
          onChange={(e) => {
            setSelect(e.target.value);
            props.onSelect?.(e.target.value);
          }}
        >
          {Object.entries(options).map(([option, desc]) => (
            <Radio value={option} className={styles.option} key={option}>
              {option} {desc}
            </Radio>
          ))}
        </Radio.Group>
      )}
    </div>
  );
};

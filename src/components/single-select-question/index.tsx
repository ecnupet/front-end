import { Divider, Radio } from "antd";
import React from "react";
import { SingleSelectQuestion } from "../../models";
import styles from "./style.module.css";

interface QuestionItemProp {
  question: SingleSelectQuestion;
  onSelect?(option: string): any;
}

export const SingleSelectQuestionComponent: React.FC<QuestionItemProp> = (
  props
) => {
  const {
    question: { description, options },
  } = props;
  return (
    <div>
      <Divider></Divider>
      <pre className={styles.description}>{description}</pre>
      <Divider></Divider>
      <Radio.Group
        optionType="default"
        onChange={(e) => props.onSelect?.(e.target.value)}
      >
        {Object.entries(options).map(([option, desc]) => (
          <Radio value={option} className={styles.option} key={option}>
            {option} {desc}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

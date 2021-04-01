import { Button, Modal, Table, Tag } from "antd";
import { Observer } from "mobx-react-lite";
import React from "react";
import { PromiseBuilder } from "../../../components/promise-builder";
import { NameOfQuestionType } from "../../../models";
import { QuizHistoryResult } from "../../../services";
import { isDev } from "../../../services";
import { pickKeyOf } from "../../../utils/common";
import { useService } from "../../../utils/hooks";
import { MyTestsService } from "./service";

export const MyTestsPage: React.FC = () => {
  const service = useService(MyTestsService);
  return (
    <>
      <Observer>
        {() => (
          <PromiseBuilder
            promise={service.fetchQuizHistory(service.page, service.pageSize)}
            render={(histories) => (
              <Table
                dataSource={histories}
                rowKey={(history) => history.quizId}
                pagination={{
                  pageSize: service.pageSize,
                  current: service.page,
                  // TODO total
                  total: 20,
                  onChange: service.handleChangePage,
                }}
                columns={[
                  ...(isDev
                    ? [
                        {
                          dataIndex: pickKeyOf<QuizHistoryResult>("quizId"),
                          key: pickKeyOf<QuizHistoryResult>("quizId"),
                          title: "ID",
                        },
                      ]
                    : []),
                  {
                    dataIndex: pickKeyOf<QuizHistoryResult>("startTime"),
                    key: pickKeyOf<QuizHistoryResult>("startTime"),
                    title: "开始时间",
                  },
                  {
                    dataIndex: pickKeyOf<QuizHistoryResult>("costTime"),
                    key: pickKeyOf<QuizHistoryResult>("costTime"),
                    title: "花费时间",
                  },
                  {
                    dataIndex: pickKeyOf<QuizHistoryResult>("point"),
                    key: pickKeyOf<QuizHistoryResult>("point"),
                    title: "分数",
                  },
                  {
                    dataIndex: pickKeyOf<QuizHistoryResult>("types"),
                    key: pickKeyOf<QuizHistoryResult>("types"),
                    title: "分类",
                    render: (types: QuizHistoryResult["types"]) =>
                      types.map((type) => (
                        <Tag key={type}>{NameOfQuestionType[type]}</Tag>
                      )),
                  },
                  {
                    dataIndex: pickKeyOf<QuizHistoryResult>("quizId"),
                    render: (value) => (
                      <Button
                        onClick={() => service.handleOpenDetail(value)}
                        type="link"
                      >
                        查看详情
                      </Button>
                    ),
                  },
                ]}
              ></Table>
            )}
          ></PromiseBuilder>
        )}
      </Observer>
      <Observer>
        {() => (
          <Modal
            visible={service.modalVisable}
            footer={null}
            onCancel={service.handleCloseModal}
          >
            {service.historyDetail?.results?.map((result) => (
              <div key={result.questionId}>{result.description}</div>
            ))}
          </Modal>
        )}
      </Observer>
    </>
  );
};

import { Button, Modal, Spin, Table, Tag } from "antd";
import React from "react";
import { NameOfQuestionType } from "../../../models";
import { QuizHistoryResult } from "../../../services";
import { isDev } from "../../../env";
import { pickKeyOf } from "../../../utils/common";
import { useService } from "../../../utils/hooks";
import { MyTestsService } from "./service";
import { useRequest } from "../../../utils/hooks/use-request";
import { observer } from "mobx-react";

export const MyTestsPage: React.FC = observer(() => {
  const service = useService(MyTestsService);
  const [, loading1] = useRequest(service.fetchQuisHistoryCount, []);
  const [history, loading2] = useRequest(service.requestQuizHistory, [
    service.page,
    service.pageSize,
  ]);
  return (
    <>
      <Spin spinning={loading1 === "pending" || loading2 === "pending"}>
        {renderResultTable(history ?? [], service)}
      </Spin>
      <Modal
        visible={service.modalVisable}
        footer={null}
        onCancel={service.handleCloseModal}
      >
        {service.historyDetail?.results?.map((result) => (
          <div key={result.questionId}>{result.description}</div>
        ))}
      </Modal>
    </>
  );
});
function renderResultTable(
  histories: QuizHistoryResult[],
  service: MyTestsService
): React.ReactNode {
  return (
    <Table
      dataSource={histories}
      rowKey={(history) => history.quizId}
      pagination={{
        pageSize: service.pageSize,
        current: service.page,
        total: service.totalCount,
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
            <Button onClick={() => service.handleOpenDetail(value)} type="link">
              查看详情
            </Button>
          ),
        },
      ]}
    ></Table>
  );
}

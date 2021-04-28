import { Input, Spin, Table } from "antd";
import React, { ChangeEvent, useState } from "react";
import { KeyOf, ModelDescriber } from "../../models/model-describer";
import { PageQueryResult, SearchParams } from "../../services";
import { ObjectKeys, withType } from "../../utils/common";
import { debounce } from "../../utils/common/time";
import { usePage } from "../../utils/hooks/use-page";
import { useRequest } from "../../utils/hooks/use-request";
import { renderTableColumn, TableColumn } from "../crud-manager";

export interface IQueryTableProp<T extends object> {
  query: (params: SearchParams) => Promise<PageQueryResult<T>>;
  discriber: ModelDescriber<T>;
  render?: (record: T, fieldKey: KeyOf<T>) => React.ReactNode;
}

export const QueryTable = <T extends object>({
  query,
  discriber: describer,
  render,
}: IQueryTableProp<T>) => {
  const [page, pageSize, count, setPageInfo] = usePage({
    page: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState("");
  const [records, state] = useRequest(
    async (
      page: number,
      pageSize: number,
      keyword: string,
      query: IQueryTableProp<T>["query"]
    ) => {
      const result = await query({ page, pageSize, keyword });
      setPageInfo({ page, pageSize, count: result.count });
      return result.records;
    },
    [page, pageSize, keyword, query]
  );
  return (
    <Spin spinning={state === "pending"}>
      {!!describer.searchableKey && (
        <Input
          placeholder={`搜索${describer.displayNames[describer.searchableKey]}`}
          onChange={debounce(
            (e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
            1000
          )}
        />
      )}
      <Table
        pagination={{
          current: page,
          total: count,
          pageSize,
          onChange(page, pageSize) {
            setPageInfo({ page, pageSize });
          },
        }}
        columns={withType<TableColumn<T>[]>(
          ObjectKeys(describer.properties).map((fieldKey) => ({
            dataIndex: fieldKey,
            title: describer.displayNames[fieldKey],
            render(_, record) {
              return (
                render?.(record, fieldKey) ??
                renderTableColumn(describer, fieldKey, record)
              );
            },
          }))
        ).sort((a, b) =>
          a.dataIndex === describer.primaryKey
            ? -1
            : b.dataIndex === describer.primaryKey
            ? 1
            : 0
        )}
        dataSource={records ?? []}
      ></Table>
    </Spin>
  );
};

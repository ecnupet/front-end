import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popover, Spin, Table, Tag, Tooltip } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useState } from "react";
import { ResponseResultEnum, ResponseResultModel } from "../../api/info-manage";
import {
  EnumPropertyDescriber,
  KeyOf,
  ModelDescriber,
  StringPropertyDescriber,
} from "../../models/model-describer";
import { CRUDService, InteractFactory } from "../../services";
import { ObjectKeys } from "../../utils/common";
import { debounce } from "../../utils/common/time";
import { useRequest } from "../../utils/hooks/use-request";
import { BooleanDisplay } from "../boolean-display";
import { ICommonFormProp } from "../common-form";
import { CRUD, CRUDModal } from "../crud-modal";
import styles from "./style.module.css";

export interface ICRUDManagerProp<T extends object> {
  describer: ModelDescriber<T>;
  service: CRUDService<T>;
  columns?: TableColumn<T>[];
  formProps?: Pick<ICommonFormProp<T>, "customRenderer" | "props">;
  renderColumn?: (model: T, fieldKey: KeyOf<T>) => React.ReactNode;
}

export interface TableColumn<T extends object> extends ColumnType<T> {
  dataIndex: Extract<keyof T, string>;
}

export function processLongText(text: string, count = 30) {
  if (text.length > count) {
    text = `${text.slice(0, count)}...`;
  }
  return text;
}

export const CRUDManager = <T extends object>({
  describer,
  service,
  columns,
  renderColumn,
  formProps,
}: React.PropsWithChildren<ICRUDManagerProp<T>>) => {
  const [editorVisable, setEditorVisable] = useState(false);
  const [editorType, setEditorType] = useState<CRUD>("create");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>();
  const [record, setRecord] = useState<T>();
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  columns = [
    ...ObjectKeys(describer.properties).map<TableColumn<T>>((fieldKey) => ({
      dataIndex: fieldKey,
      render: (_, record) => {
        const rendered = renderColumn?.(record, fieldKey);
        if (rendered != null) {
          return rendered;
        }
        return renderTableColumn(describer, fieldKey, record);
      },
    })),
    ...(columns ?? []),
  ];
  const [records, state, redoPageQuery] = useRequest(
    async (page: number, pageSize: number, keyword: string) => {
      const result = (await service.query({ page, pageSize, keyword })).data;
      setTotal(result.count);
      return (result.records as unknown) as T[];
    },
    [page, pageSize, keyword]
  );
  function resultHandler(result: ResponseResultModel<any>) {
    if (result.state === ResponseResultEnum.Success) {
      InteractFactory.getMessager().success(result.detail);
      setEditorVisable(false);
      redoPageQuery();
    } else {
      InteractFactory.getMessager().fail(result.detail);
    }
  }
  return (
    <>
      <CRUDModal
        describer={
          !!record ? { ...describer, currentValue: record } : describer
        }
        onClose={() => setEditorVisable(false)}
        visable={editorVisable}
        type={editorType}
        formProps={formProps}
        onSumbit={async (model, type) => {
          switch (type) {
            case "create":
              resultHandler(await service.create(model));
              break;
            case "delete":
              resultHandler(await service.delete(model[describer.primaryKey]));
              break;
            case "update":
              resultHandler(await service.update(model));
              break;
            default:
              break;
          }
        }}
      ></CRUDModal>
      <div className={styles.panel}>
        <div className={styles["table-wrapper"]}>
          <Tooltip overlay={`创建${describer.modelName}`}>
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              type="primary"
              className={styles["create-button"]}
              onClick={() => {
                setEditorType("create");
                setRecord(describer.defaultValue);
                setEditorVisable(true);
              }}
            ></Button>
          </Tooltip>
          {describer.searchableKey && (
            <Input
              className={styles["search-bar"]}
              suffix={<SearchOutlined />}
              placeholder={`搜索${
                describer.displayNames[describer.searchableKey]
              }`}
              onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                setKeyword(e.target.value);
              }, 1000)}
            ></Input>
          )}
          <Spin spinning={state === "pending"}>
            <Table
              rowKey={(record) =>
                (record[describer.primaryKey] as unknown) as number
              }
              dataSource={records ?? []}
              columns={[
                ...columns
                  .map((column) => ({
                    title: describer.displayNames[column.dataIndex],
                    ...column,
                  }))
                  .sort((a, b) =>
                    a.dataIndex === describer.primaryKey
                      ? -1
                      : b.dataIndex === describer.primaryKey
                      ? 1
                      : 0
                  ),
                {
                  key: "__operation__",
                  width: "260px",
                  render: (_, data: T) => (
                    <>
                      <Button
                        type="text"
                        onClick={() => {
                          setEditorType("update");
                          setRecord(data);
                          setEditorVisable(true);
                        }}
                      >
                        修改
                      </Button>
                      <Button
                        type="text"
                        danger
                        onClick={() => {
                          setEditorType("delete");
                          setRecord(data);
                          setEditorVisable(true);
                        }}
                      >
                        删除
                      </Button>
                    </>
                  ),
                },
              ]}
              pagination={{
                onChange(page, pageSize) {
                  setPage(page);
                  pageSize && setPageSize(pageSize);
                },
                total,
                pageSize,
              }}
            ></Table>
          </Spin>
        </div>
      </div>
    </>
  );
};

export function renderTableColumn<T extends object>(
  describer: ModelDescriber<T>,
  fieldKey: KeyOf<T>,
  record: T
) {
  const value = record[fieldKey];
  const { valueDescriber } = describer.properties[fieldKey];
  if (valueDescriber.type === "enum") {
    const { displayNameMapping } = valueDescriber as EnumPropertyDescriber<any>;
    return <Tag>{displayNameMapping[value]}</Tag>;
  }
  if (
    valueDescriber.type === "string" &&
    (valueDescriber as StringPropertyDescriber).textType === "long"
  ) {
    return (
      <Popover content={<p>{value}</p>}>{processLongText("" + value)}</Popover>
    );
  }
  if (valueDescriber.type === "boolean") {
    return <BooleanDisplay value={+value > 0.5}></BooleanDisplay>;
  }
  return processLongText("" + value);
}

import { PlusOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Tooltip } from "antd";
import { ColumnType } from "antd/lib/table";
import { useState } from "react";
import {
  BackendServiceFactory,
  CRUDServices,
  InteractFactory,
  ModelTypeOfService,
  ResponseResultModel,
} from "../../services";
import { useRequest } from "../../utils/hooks/use-request";
import { CommonFieldItem, CRUD, CRUDModal } from "../crud-form";

interface TableColumn<T> extends ColumnType<T> {
  dataIndex: Extract<keyof T, string>;
}

export type DisplayNameMapping<T extends object> = Record<
  Extract<keyof T, string>,
  string
>;

export function ManageTable<S extends CRUDServices>(
  serviceName: S,
  initVal: ModelTypeOfService<S>,
  idKey: Extract<keyof ModelTypeOfService<S>, string>,
  {
    columns,
    fields,
    modalName,
  }: {
    columns: TableColumn<ModelTypeOfService<S>>[];
    fields: CommonFieldItem<ModelTypeOfService<S>>[];
    modalName: string;
  }
): JSX.Element {
  type T = ModelTypeOfService<S>;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>();
  const [record, setRecord] = useState<T>();
  const [editorVisable, setEditorVisable] = useState(false);
  const [editorType, setEditorType] = useState<CRUD>("create");
  const service = BackendServiceFactory.getCRUDService(serviceName);
  const [records, state, redoRequest] = useRequest(
    async (page: number, pageSize: number) => {
      const result = (await service.query({ page, pageSize })).data;
      setTotal(result.count);
      return (result.records as unknown) as T[];
    },
    [page, pageSize]
  );
  const requestHandler = (result: ResponseResultModel<any>) => {
    InteractFactory.getMessager().success(result.detail);
    setEditorVisable(false);
    redoRequest();
  };
  return (
    <>
      {CRUDModal(
        record ?? initVal,
        {
          disableKey: true,
          primaryKey: idKey,
          type: editorType,
          onClose() {
            setEditorVisable(false);
          },
          fields,
          modalName,
          handlers: {
            async onCreate(model) {
              const result = await service.create(model);
              requestHandler(result);
            },
            async onDelete(model) {
              const result = await service.delete(
                (model[idKey] as unknown) as number
              );
              requestHandler(result);
            },
            async onUpdate(model) {
              const result = await service.update(model);
              requestHandler(result);
            },
            async onRetrieve(model) {
              const result = await service.retrieve(
                (model[idKey] as unknown) as number
              );
              requestHandler(result);
            },
          },
        },
        editorVisable
      )}
      <div
        style={{
          position: "relative",
          overflow: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "static",
            overflow: "auto",
            width: "100%",
            height: "100%",
          }}
        >
          <Tooltip overlay={`创建${modalName}`}>
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              type="primary"
              style={{ position: "absolute", zIndex: 10, right: 20, top: 10 }}
              onClick={() => {
                setEditorType("create");
                setEditorVisable(true);
              }}
            ></Button>
          </Tooltip>
          <Spin spinning={state === "pending"}>
            <Table
              rowKey={(record) => (record[idKey] as unknown) as number}
              dataSource={records ?? []}
              columns={[
                ...columns,
                {
                  key: "__operation__",
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
}

import { Spin, Tree } from "antd";
import { DataNode } from "rc-tree/lib/interface";
import React, { useEffect, useState } from "react";
import { apiCaller } from "../../../api";
import { ResponseResultEnum, RoomProcess } from "../../../api/info-manage";
import { CommonForm } from "../../../components/common-form";
import { createDescriber } from "../../../models/describer-factory";

import { makeProcessTree, ProcessItem } from "../../../models/process-tree";
import { useRequest } from "../../../utils/hooks/use-request";
import styles from "./style.module.css";

function mapTreeToNode(node: ProcessItem): DataNode {
  const result = {
    key: node.id,
    children: node.children.map(mapTreeToNode),
    isLeaf: !node.children.length,
    title: node.name,
  };
  return result;
}

export const RoomProcessManage: React.FC = () => {
  const [currentProcess, setCurrentProcess] = useState<RoomProcess>();
  const [currentProcessId, setCurrentProcessId] = useState(-1);
  const [
    roomProcesses,
    treeDataRequestState,
    fetchAll,
  ] = useRequest(async () => {
    const { data, detail, state } = await apiCaller.get(
      "/api/im/processall",
      {}
    );
    if (state !== ResponseResultEnum.Success) {
      throw new Error(detail);
    }
    return data;
  }, []);
  useEffect(() => {
    const node = roomProcesses?.find(
      (processItem) => processItem.id === currentProcessId
    );
    if (node) {
      setCurrentProcess(node);
    }
  }, [currentProcessId, roomProcesses]);
  const [
    ,
    updateRequestState,
    updateRoomProcess,
  ] = useRequest(async () => {}, []);
  return (
    <section className={styles.container}>
      <aside className={styles.tree}>
        <Spin spinning={treeDataRequestState === "pending"}>
          <Tree
            treeData={
              roomProcesses?.length
                ? mapTreeToNode(makeProcessTree(roomProcesses)).children!
                : []
            }
            onSelect={(selected) => {
              setCurrentProcessId(+selected[0]!);
            }}
          ></Tree>
        </Spin>
      </aside>
      <main className={styles["update-form"]}>
        <Spin spinning={updateRequestState === "pending"}>
          <CommonForm
            onSubmit={async (form) => {
              await apiCaller.post("/api/im/processupdate", form);
              updateRoomProcess();
              fetchAll();
            }}
            describer={createDescriber<RoomProcess>({
              displayNames: {
                id: "ID",
                fatherId: "父节点ID",
                image: "图片",
                name: "名称",
                process: "介绍",
                video: "视频",
              },
              modelName: "过程",
              primaryKey: "id",
              properties: {
                id: {
                  propertyKey: "id",
                  valueDescriber: { type: "number", defaultValue: -1 },
                  disabled: true,
                },
                fatherId: {
                  propertyKey: "fatherId",
                  valueDescriber: { type: "number", defaultValue: -1 },
                  disabled: true,
                },
                name: {
                  propertyKey: "name",
                  valueDescriber: { type: "string", defaultValue: "" },
                  disabled: true,
                },
                image: {
                  propertyKey: "image",
                  valueDescriber: {
                    type: "file",
                    defaultValue: "",
                    fileType: "image",
                  },
                  required: false,
                },
                process: {
                  propertyKey: "process",
                  valueDescriber: {
                    type: "string",
                    defaultValue: "",
                    textType: "long",
                  },
                  required: false,
                },
                video: {
                  propertyKey: "video",
                  valueDescriber: {
                    type: "file",
                    defaultValue: "",
                    fileType: "video",
                  },
                  required: false,
                },
              },
              currentValue: currentProcess,
            })}
          ></CommonForm>
        </Spin>
      </main>
    </section>
  );
};

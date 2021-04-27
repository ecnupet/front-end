import { Drawer, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { apiCaller } from "../../api";
import { QueryMessage } from "../../api/guide-interact";
import {
  ChargeProject,
  Drug,
  ResponseResultEnum,
  RoomProcess,
} from "../../api/info-manage";
import { BackToHome } from "../../components/back-to-home";
import { ProgressDisplay } from "../../components/progress-display";
import { IQueryTableProp, QueryTable } from "../../components/query-table";
import { ModelDescriber } from "../../models/model-describer";
import { BackendServiceFactory, InteractFactory } from "../../services";
import { useRequest } from "../../utils/hooks/use-request";
import { PickString } from "../../utils/types";
import { chargeProjectDescriber } from "../admin/charge-project";
import { drugDiscriber } from "../admin/drug";

interface MapQueryTypeToModel {
  drug: Drug;
  "charge-project": ChargeProject;
}

type QueryTypes = PickString<
  QueryMessage["queryObject"],
  "drug" | "charge-project"
>;
const queries: Record<
  QueryTypes,
  IQueryTableProp<MapQueryTypeToModel[QueryTypes]>["query"]
> = {
  "charge-project": async (params) => {
    const { data, detail, state } = await BackendServiceFactory.getCRUDService(
      "ChargeProject"
    ).query(params);
    if (state !== ResponseResultEnum.Success) {
      InteractFactory.getMessager().fail(detail);
    }
    return data;
  },
  drug: async (params) => {
    const { data, detail, state } = await BackendServiceFactory.getCRUDService(
      "Drug"
    ).query(params);
    if (state !== ResponseResultEnum.Success) {
      InteractFactory.getMessager().fail(detail);
    }
    return data;
  },
};

const describers: Record<
  QueryTypes,
  { [K in QueryTypes]: ModelDescriber<MapQueryTypeToModel[K]> }[QueryTypes]
> = {
  drug: drugDiscriber,
  "charge-project": chargeProjectDescriber,
};

export const GuidePage: React.FC = () => {
  const [drawerVisable, setDrawerVisable] = useState(false);
  const [query, setQuery] = useState<QueryTypes>("drug");
  const [paths, setPaths] = useState<string[]>();
  const [drawerContent, setDrawerContent] = useState<"query" | "room-process">(
    "query"
  );
  const [describer, setDescriber] = useState<
    ModelDescriber<Drug> | ModelDescriber<ChargeProject>
  >();
  const [roomProcess, state] = useRequest(
    async (path) => {
      if (!path) {
        const empty: RoomProcess = {
          fatherId: -1,
          id: -1,
          image: "",
          name: "",
          process: "",
          video: "",
        };
        return empty;
      }
      if (!path.length) {
        throw new Error("Invalid path");
      }
      const { data, detail, state } = await apiCaller.get("/api/im/process", {
        processRoute: path.join(";"),
      });
      if (state !== ResponseResultEnum.Success) {
        throw new Error(detail);
      }
      return data;
    },
    [paths]
  );
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const command: QueryMessage = e.data;
      if (command && command.queryObject) {
        setDrawerVisable(true);
        if (command.queryObject !== "room-process") {
          setDrawerContent("query");
          setQuery(command.queryObject);
          setDescriber(describers[command.queryObject]);
        } else {
          setDrawerContent("room-process");
          setPaths(command.path);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [query]);
  return (
    <div>
      <Drawer
        title={describer?.modelName}
        width={600}
        visible={drawerVisable}
        onClose={() => setDrawerVisable(false)}
      >
        {drawerContent === "query" && describer && drawerVisable && (
          <QueryTable
            discriber={describer as never}
            query={queries[query] as never}
          ></QueryTable>
        )}
        {drawerContent === "room-process" && roomProcess && (
          <Spin spinning={state === "pending"}>
            <ProgressDisplay process={roomProcess}></ProgressDisplay>
          </Spin>
        )}
      </Drawer>
      <iframe
        title="医院导览"
        src="/vtour/walkthrough.html"
        style={{ width: "100%", height: "100vh" }}
      ></iframe>
      <BackToHome></BackToHome>
    </div>
  );
};

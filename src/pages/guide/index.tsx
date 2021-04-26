import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { QueryMessage } from "../../api/guide-interact";
import { ChargeProject, Drug, ResponseResultEnum } from "../../api/info-manage";
import { BackToHome } from "../../components/back-to-home";
import { IQueryTableProp, QueryTable } from "../../components/query-table";
import { ModelDescriber } from "../../models/model-describer";
import { BackendServiceFactory, InteractFactory } from "../../services";
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
  const [queryVisable, setQueryVisable] = useState(false);
  const [query, setQuery] = useState<QueryTypes>("drug");
  const [describer, setDescriber] = useState<
    ModelDescriber<Drug> | ModelDescriber<ChargeProject>
  >();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const command: QueryMessage = e.data;
      if (command && command.queryObject) {
        setQueryVisable(true);
        if (command.queryObject !== "room-process") {
          setQuery(command.queryObject);
          setDescriber(describers[command.queryObject]);
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
        visible={queryVisable}
        onClose={() => setQueryVisable(false)}
      >
        {describer && queryVisable && (
          <QueryTable
            discriber={describer as never}
            query={queries[query] as never}
          ></QueryTable>
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

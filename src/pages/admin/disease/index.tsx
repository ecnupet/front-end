import { DeleteOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import React, { useState } from "react";
import { apiCaller, ResponseResultModel } from "../../../api";
import {
  Case,
  CaseStages,
  Disease,
  DiseaseAllStage,
  ResponseResultEnum,
} from "../../../api/info-manage";
import { CRUDManager } from "../../../components/crud-manager";
import { CRUD, CRUDModal } from "../../../components/crud-modal";
import { createDescriber } from "../../../models/describer-factory";
import { BackendServiceFactory, InteractFactory } from "../../../services";
import { ObjectEntries, uncapitalize } from "../../../utils/common";
import { globalErrorHandle } from "../../../utils/services/global-error-handler";
import styles from "./style.module.css";

const diseaseDescriber = createDescriber<Disease>({
  displayNames: {
    diseaseName: "疾病名称",
    diseaseType: "疾病类型",
    id: "ID",
  },
  modelName: "疾病",
  primaryKey: "id",
  searchableKey: "diseaseName",
  properties: {
    diseaseName: {
      propertyKey: "diseaseName",
      valueDescriber: { type: "string", defaultValue: "" },
    },
    diseaseType: {
      propertyKey: "diseaseType",
      valueDescriber: {
        type: "string",
        defaultValue: "",
      },
    },
    id: {
      propertyKey: "id",
      valueDescriber: { type: "number", defaultValue: -1 },
    },
  },
});
export const CaseStagesNames: Record<CaseStages, string> = {
  [CaseStages.Introduce]: "介绍",
  [CaseStages.Check]: "检查阶段",
  [CaseStages.ClinicalReception]: "临床接待",
  [CaseStages.Diagnosis]: "诊断阶段",
  [CaseStages.TherapeuticSchedule]: "治疗阶段",
};
export const DiseaseManage: React.FC = () => {
  const [disease, setDisease] = useState<Disease>();
  const [caseInfo, setCaseInfo] = useState<DiseaseAllStage>();
  const [caseEditorVisable, setCaseEditorVisible] = useState(false);
  const [resourceType, setResourceType] = useState<keyof typeof CaseStages>(
    "Check"
  );
  const [type, setType] = useState<CRUD>("create");
  const caseFieldDisplayNames = {
    id: "ID",
    video: "视频",
    caseStage: "资源类型",
    description: "文字描述",
    image: "图片",
    diseaseId: "疾病ID",
    caseType: "caseType",
  };
  const currentCase: Case = caseInfo?.[uncapitalize(resourceType)] ?? {
    id: -1,
    caseStage: CaseStages[resourceType],
    description: "",
    diseaseId: disease?.id ?? -1,
    image: "",
    video: "",
  };
  const caseDescriber = createDescriber<Case>({
    primaryKey: "id",
    displayNames: caseFieldDisplayNames,
    modelName: "病例资源",
    properties: {
      id: {
        propertyKey: "id",
        valueDescriber: { type: "number", defaultValue: -1 },
        disabled: true,
      },
      diseaseId: {
        propertyKey: "diseaseId",
        valueDescriber: { type: "number", defaultValue: -1 },
        disabled: true,
      },
      caseStage: {
        propertyKey: "caseStage",
        valueDescriber: {
          type: "enum",
          enumObject: CaseStages,
          defaultValue: CaseStages.Introduce,
          displayNameMapping: CaseStagesNames,
        },
        disabled: true,
      },
      description: {
        propertyKey: "description",
        valueDescriber: { type: "string", defaultValue: "", textType: "long" },
      },
      image: {
        propertyKey: "image",
        valueDescriber: { type: "file", defaultValue: "", fileType: "image" },
      },
      video: {
        propertyKey: "video",
        valueDescriber: { type: "file", defaultValue: "", fileType: "video" },
        required: false,
      },
    },
    currentValue: currentCase,
  });
  return (
    <>
      <CRUDManager
        columns={[
          // @ts-expect-error
          {
            key: "disease-stages",
            title: "病例操作",
            render(_, record) {
              return (
                <>
                  {ObjectEntries(CaseStages)
                    .filter(([key]) => isNaN(+key))
                    .map(([key, enumValue], index) => (
                      <Tag
                        className={styles.tag}
                        key={index}
                        onClick={async () => {
                          try {
                            const result = await apiCaller.get(
                              "/api/im/diseasecase",
                              { diseaseID: record.id }
                            );
                            setResourceType(key);
                            setDisease(record);
                            setCaseInfo(result.data);
                            const stage = result.data[uncapitalize(key)];
                            setType(stage === null ? "create" : "update");
                            setCaseEditorVisible(true);
                          } catch (error) {
                            globalErrorHandle(error);
                          }
                        }}
                      >
                        {CaseStagesNames[enumValue]}
                      </Tag>
                    ))}
                </>
              );
            },
          },
        ]}
        describer={diseaseDescriber}
        service={BackendServiceFactory.getCRUDService("Disease")}
      ></CRUDManager>
      {!!disease && !!caseInfo && (
        <div>
          <CRUDModal
            visable={caseEditorVisable}
            type={type}
            onClose={() => setCaseEditorVisible(false)}
            footer={
              type === "update" && (
                <Button
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    try {
                      const result = await apiCaller.post(
                        "/api/im/casedelete",
                        { id: currentCase.id }
                      );
                      if (result.state === ResponseResultEnum.Success) {
                        InteractFactory.getMessager().success(result.detail);
                        setCaseEditorVisible(false);
                      } else {
                        InteractFactory.getMessager().fail(result.detail);
                      }
                    } catch (error) {
                      globalErrorHandle(error);
                    }
                  }}
                ></Button>
              )
            }
            describer={caseDescriber}
            onSumbit={async (caseobj: Case, type) => {
              try {
                let result: ResponseResultModel<any>;
                switch (type) {
                  case "create":
                    // @ts-expect-error
                    result = await apiCaller.post("/api/im/caseadd", caseobj);
                    break;
                  case "update":
                    result = await apiCaller.post(
                      "/api/im/caseupdate",
                      caseobj
                    );
                    break;
                  default:
                    throw new Error("Unexpected type");
                }
                if (result.state === ResponseResultEnum.Success) {
                  InteractFactory.getMessager().success(result.detail);
                  setCaseEditorVisible(false);
                } else {
                  InteractFactory.getMessager().fail(result.detail);
                }
              } catch (error) {
                globalErrorHandle(error);
              }
            }}
          ></CRUDModal>
        </div>
      )}
    </>
  );
};

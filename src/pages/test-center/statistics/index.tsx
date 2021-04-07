import React from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { PieChart } from "echarts/charts";
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts/core";
import { useRequest } from "../../../utils/hooks/use-request";
import { BackendServiceFactory } from "../../../services";
import { Spin } from "antd";
import { globalStore } from "../../../store";
import { observer } from "mobx-react";

echarts.use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  PieChart,
  CanvasRenderer,
]);

export const StatisticsPage: React.FC = observer(() => {
  const [result, state] = useRequest(
    () => BackendServiceFactory.getQuizService().questionGeneralStatistics(),
    []
  );
  const { data } = result || {};
  const done = state === "fulfilled";
  const {
    totalCorrectCount,
    totalNoAnswerCount,
    totalWrongCount,
    averageAnswerTime,
    totalCommitCount,
  } = data || {};
  return (
    <div>
      <Spin spinning={state === "pending"}>
        {done && (
          <ReactEChartsCore
            echarts={echarts}
            notMerge={true}
            lazyUpdate={true}
            option={{
              visualMap: {
                show: true,
                min: 80,
                max: 600,
                inRange: {
                  colorLightness: [0, 1],
                },
              },
              title: {
                text: `${globalStore.user.userName} 的试题数据统计图`,
                subtext: `你总共做了${totalCommitCount}次题目，平均用时${averageAnswerTime}秒`,
              },
              series: [
                {
                  type: "pie",
                  radius: "55%",
                  data: [
                    {
                      value: totalCorrectCount ?? 0,
                      name: "正确",
                      itemStyle: { color: "#52c41a" },
                    },
                    {
                      value: totalWrongCount ?? 0,
                      name: "错误",
                      itemStyle: { color: "#ff4d4f" },
                    },
                    {
                      value: totalNoAnswerCount ?? 0,
                      name: "未回答",
                      itemStyle: { color: "gray" },
                    },
                  ],
                  label: {
                    normal: {
                      textStyle: {
                        color: "gray",
                      },
                    },
                  },
                  labelLine: {
                    normal: {
                      lineStyle: {
                        color: "gray",
                      },
                    },
                  },
                },
              ],
              tooltip: {},
            }}
          ></ReactEChartsCore>
        )}
      </Spin>
    </div>
  );
});

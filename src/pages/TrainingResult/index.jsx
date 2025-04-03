import React, { useState, useEffect } from "react";
import { Card, Button, Descriptions, Layout, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryString, getParams } from "@/utils";
import { useRequest } from "@/hooks";
import ajax from "@/services";
import * as echarts from "echarts";
import "./index.scss";

const { Content } = Layout;
const { getTrainingModelDetail } = ajax.trainingmodel;

const TrainingResultDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = getQueryString(location.search, "id");
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = React.useRef(null);

  // 获取训练任务详情
  const { data: taskDetail } = useRequest({
    ajax: getTrainingModelDetail,
    params: { id },
    onError: (err) => {
      message.error(err.message || "获取训练任务详情失败");
    },
  });

  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);

      // 模拟数据
      const option = {
        title: {
          text: "训练精度曲线",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["训练精度", "验证精度"],
        },
        xAxis: {
          type: "category",
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
        },
        series: [
          {
            name: "训练精度",
            type: "line",
            data: [65, 72, 78, 82, 85, 88, 90, 92, 94, 95],
          },
          {
            name: "验证精度",
            type: "line",
            data: [60, 68, 75, 80, 83, 86, 88, 90, 92, 93],
          },
        ],
      };

      chart.setOption(option);

      // 监听窗口大小变化
      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.dispose();
      };
    }
  }, []);

  // 更新图表数据
  useEffect(() => {
    if (chartInstance && taskDetail?.accuracyData) {
      // 这里可以根据实际数据更新图表
      // chartInstance.setOption({
      //   series: [
      //     { data: taskDetail.accuracyData.train },
      //     { data: taskDetail.accuracyData.validation }
      //   ]
      // });
    }
  }, [chartInstance, taskDetail]);

  const handleBack = () => {
    const params = getParams(window.location.search);
    if (params.form) {
      navigate(`/training-model?form=${params.form}`);
    } else {
      navigate("/training-model");
    }
  };

  return (
    <Layout className="training-result-details">
      <Content className="training-result-content">
        <div className="training-result-wrapper">
          <div className="training-result-inner">
            {/* 基本信息模块 */}
            <Card title="基本信息" className="training-result-card">
              <Descriptions column={2}>
                <Descriptions.Item label="任务类型">
                  {taskDetail?.taskType === "classification"
                    ? "分类任务"
                    : taskDetail?.taskType === "detection"
                    ? "检测任务"
                    : taskDetail?.taskType === "segmentation"
                    ? "分割任务"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="设定目标">
                  {taskDetail?.targetType === "input"
                    ? "输入"
                    : taskDetail?.targetType === "box"
                    ? "框选"
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="训练集">
                  {taskDetail?.datasets
                    ?.map((dataset) => dataset.dataSetName)
                    .join(", ")}
                </Descriptions.Item>
                <Descriptions.Item label="理想精度">
                  {taskDetail?.idealAccuracy}%
                </Descriptions.Item>
                <Descriptions.Item label="最大优化次数">
                  {taskDetail?.maxOptimizationCount}
                </Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  {taskDetail?.status === "completed"
                    ? "已完成"
                    : taskDetail?.status === "training"
                    ? "训练中"
                    : taskDetail?.status === "failed"
                    ? "失败"
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 数据分析模块 */}
            <Card title="数据分析" className="training-result-card">
              <div className="training-result-empty">暂无数据</div>
            </Card>

            {/* 精度曲线模块 */}
            <Card title="精度曲线" className="training-result-card">
              <div ref={chartRef} className="training-result-chart" />
            </Card>
          </div>
        </div>

        <div className="training-result-footer">
          <Button onClick={handleBack}>返回</Button>
        </div>
      </Content>
    </Layout>
  );
};

export default TrainingResultDetails;

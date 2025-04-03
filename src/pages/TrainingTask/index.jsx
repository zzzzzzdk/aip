import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Button,
  message,
  Layout,
  Space,
  TreeSelect,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryString } from "@/utils";
import { useRequest } from "@/hooks";
import ajax from "@/services";
import BoxSelector from "@/components/BoxSelector";
import "./index.scss";

const { Content } = Layout;
const { Option } = Select;

const { createTrainingModel, editTrainingModel, getTrainingModelDetail } =
  ajax.trainingmodel;
const { getDataset } = ajax.dataset;
const { getAllLabelList } = ajax.label;

const TrainingTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEdit = getQueryString(location.search, "id");

  const [datasetList, setDatasetList] = useState([]);
  const [labelList, setLabelList] = useState([]);

  // 任务类型选项
  const taskTypes = [
    { label: "分类任务", value: "classification" },
    { label: "检测任务", value: "detection" },
    { label: "分割任务", value: "segmentation" },
  ];

  // 设定目标选项
  const targetTypes = [
    { label: "输入", value: "input" },
    { label: "框选", value: "box" },
  ];

  // 如果是编辑状态，获取任务详情
  useEffect(() => {
    if (isEdit) {
      getTrainingModelDetail({ id: isEdit })
        .then((res) => {
          form.setFieldsValue(res.data);
        })
        .catch((err) => {
          message.error("获取任务详情失败");
        });
    }
  }, [isEdit]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const api = isEdit ? editTrainingModel : createTrainingModel;
        const params = isEdit ? { ...values, id: isEdit } : values;

        api(params)
          .then((res) => {
            message.success(isEdit ? "编辑成功" : "创建成功");
            navigate("/training-model");
          })
          .catch((err) => {
            message.error(err.message || (isEdit ? "编辑失败" : "创建失败"));
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    navigate("/training-model");
  };

  useEffect(() => {
    getAllLabelList()
      .then((res) => {
        console.log(res);
        setLabelList(res.data);
      })
      .catch((err) => {
        message.error(err.message || "获取标签列表失败");
      });
    getDataset()
      .then((res) => {
        setDatasetList(res.data);
      })
      .catch((err) => {
        message.error(err.message || "获取数据集列表失败");
      });
  }, []);

  return (
    <Layout className="training-task-layout">
      <Content className="training-task-content">
        <div className="training-task-form-wrapper">
          <Form
            form={form}
            layout="horizontal"
            labelAlign="right"
            className="training-task-form"
          >
            <Form.Item
              name="taskName"
              label="任务名称"
              rules={[{ required: true, message: "请输入任务名称" }]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>

            <Form.Item
              name="taskType"
              label="任务类型"
              rules={[{ required: true, message: "请选择任务类型" }]}
            >
              <Select placeholder="请选择任务类型">
                {taskTypes.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="targetType"
              label="设定目标"
              initialValue={targetTypes[0].value}
              rules={[{ required: true, message: "请选择设定目标" }]}
            >
              <Radio.Group>
                {targetTypes.map((type) => (
                  <Radio key={type.value} value={type.value}>
                    {type.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.targetType !== currentValues.targetType
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("targetType") === "input" ? (
                  <Form.Item
                    name="targetValue"
                    label=" "
                    colon={false}
                    rules={[{ required: true, message: "请输入内容" }]}
                  >
                    <Input placeholder="请输入内容" />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="targetBox"
                    label=" "
                    colon={false}
                    rules={[{ required: true, message: "请进行目标框选" }]}
                  >
                    <BoxSelector
                    // disabled={isEdit}
                    />
                  </Form.Item>
                )
              }
            </Form.Item>

            <Form.Item
              name="idealAccuracy"
              label="理想精度"
              rules={[{ required: true, message: "请输入理想精度" }]}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                placeholder="请输入理想精度"
              />
            </Form.Item>

            <Form.Item
              name="maxOptimizationCount"
              label="最大优化次数"
              rules={[{ required: true, message: "请输入最大优化次数" }]}
            >
              <InputNumber min={1} placeholder="请输入最大优化次数" />
            </Form.Item>

            <Form.Item
              name="datasets"
              label="训练集"
              rules={[{ required: true, message: "请选择训练集" }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择训练集"
                options={datasetList.map((dataset) => ({
                  label: dataset.dataSetName,
                  value: dataset.id,
                }))}
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="labels"
              label="选择标签"
              rules={[{ required: true, message: "请选择标签" }]}
            >
              <TreeSelect
                mode="multiple"
                placeholder="请选择标签"
                treeData={labelList}
                treeCheckable
                allowClear
                showCheckedStrategy={TreeSelect.SHOW_CHILD}
                fieldNames={{ label: "name", value: "id", children: "labels" }}
              />
            </Form.Item>
          </Form>
        </div>

        <div className="training-task-footer">
          <Space size={24}>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              {isEdit ? "保存" : "开始训练"}
            </Button>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default TrainingTask;

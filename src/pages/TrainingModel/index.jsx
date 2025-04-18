import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Input,
  Select,
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Form,
  Row,
  Pagination,
  Modal,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useRequest, useHeight, useUrlState } from "@/hooks";
import { createRandom, pageSizeOptions, getParams } from "@/utils";
import { ResultFlow } from "@/components";
import ajax from "@/services";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setRouterData } from "@/store/slices/comment";
import "./index.scss";

const { getTrainingModelList, deleteTrainingModel, editTrainingModel } = ajax.trainingmodel;
const { getDataset } = ajax.dataset;
const { Content } = Layout;

const defaultResultData = {
  data: [],
  total: 0,
};
const TrainingModel = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const routerData = useSelector((state) => state.comment.routerData);
  const [form] = Form.useForm();
  const height = useHeight({
    tableBox: 240,
    table: 240 + 60,
  });
  const defaultSearchForm = {
    pn: 1,
    pageSize: pageSizeOptions[0],
    taskName: "",
    taskType: "",
    taskStatus: "",
    dataset: [],
    sort: "",
    order: "",
  };
  const [searchForm, setSearchForm, searchFormRef, updateUrl] =
    useUrlState(defaultSearchForm);

  const [datasetList, setDatasetList] = useState([]);

  const [resultData, setResultData] = useState(defaultResultData);

  const { loading: ajaxLoading, run: _getData } = useRequest({
    ajax: getTrainingModelList,
    loadingDelay: 500,
    debounceWait: 300,
    onBefore: (params) => {
      setResultData(defaultResultData);
      // updateUrl();
    },
    onSuccess: (res, params) => {
      if (Array.isArray(res.data)) {
        res.data.forEach((item, index) => {
          item.key = createRandom();
          item.sortT =
            searchFormRef.current.pageSize * (searchFormRef.current.pn - 1) +
            index +
            1;
        });
        setResultData({
          data: res.data,
          total: res.total,
        });
      }
    },
    onError: (err, params) => {
      console.log(err);
    },
  });

  const getData = () => {
    _getData({ ...searchFormRef.current });
  };

  const onChange = (e) => {
    setSearchForm({
      ...searchForm,
      taskName: e.target.value.trim(),
    });
  };

  const onSearch = (value) => {
    setSearchForm({
      ...searchForm,
      pn: 1,
      taskName: value.trim(),
    });
    getData();
  };

  const changeTable = (pagination, filters, sorter) => {
    setSearchForm({
      ...searchForm,
      pn: 1,
      sort: sorter.field || "",
      order: sorter.order || "",
    });
    getData();
  };

  const changePn = (pn, pageSize) => {
    if (searchFormRef.current.pageSize !== pageSize) {
      pn = 1;
    }
    setSearchForm({
      ...searchFormRef.current,
      pageSize: pageSize,
      pn: pn,
    });

    getData();
  };

  const handleDelete = (id) => {
    deleteTrainingModel({ id })
      .then((res) => {
        message.success(res.message || "删除成功");
        getData();
      })
      .catch((err) => {
        message.error(err.message || "删除失败");
        console.log(err);
      });
  };

  const handleReset = () => {
    setSearchForm({
      ...defaultSearchForm,
      pn: 1,
    });
    getData();
  };

  const handleSelectChange = (key, value) => {
    setSearchForm({
      ...searchForm,
      pn: 1,
      [key]: value,
    });
    getData();
  };

  const handleTrainingResult = (record) => {
    dispatch(
      setRouterData({
        ...routerData,
        breadcrumb: [
          ...routerData.breadcrumb,
          {
            text: record.taskName,
            path: `/training-model?form=${encodeURIComponent(
              JSON.stringify(searchFormRef.current)
            )}`,
          },
          {
            text: "训练结果",
          },
        ],
      })
    );
    navigate(
      `/training-result?id=${record.id}&breadcrumbName=${record.taskName}&form=${encodeURIComponent(
        JSON.stringify(searchFormRef.current)
      )}`
    );
  };

  const columns = [
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
      ellipsis: true,
      width: 250,
    },
    {
      title: "任务类型",
      dataIndex: "taskType",
      key: "taskType",
      width: 200,
    },
    {
      title: "任务状态",
      dataIndex: "taskStatus",
      key: "taskStatus",
      width: 200,
      render: (status) => {
        const color = status === 1 ? "success" : "processing";
        return (
          <span className={`status-tag ${color}`}>
            {status == 1 ? "训练完成" : "训练中"}
          </span>
        );
      },
    },
    {
      title: "训练集",
      dataIndex: "dataset",
      key: "dataset",
      width: 200,
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      sorter: true,
      sortOrder: searchForm.sort == "createTime" ? searchForm.order : false,
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleTrainingResult(record)}>
            训练结果
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedTask(record);
              setIsEditModalVisible(true);
            }}
          >
            编辑名称
          </Button>
          <Popconfirm
            title="确定要删除这个训练任务吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除任务
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 获取训练集
  const getDatasetList = () => {
    getDataset()
      .then((res) => {
        console.log(res);
        res.data.forEach((item, index) => {
          item.key = createRandom();
          item.label = item.dataSetName;
          item.value = item.id;
        });
        setDatasetList(res.data);
      })
      .catch((err) => {
        message.error(err.message || "获取训练集失败");
        console.log(err);
      });
  };

  useEffect(() => {
  }, [searchForm]);

  useEffect(() => {
    getDatasetList();
    const params = getParams(window.location.search);
    if (params.form) {
      setSearchForm({
        ...searchForm,
        ...JSON.parse(decodeURIComponent(params.form)),
      });
    }
    getData();
  }, []);

  // 新增编辑弹窗逻辑
  const handleEditOk = () => {
    const newName = form.getFieldValue("taskName");
    if (newName && newName !== selectedTask.taskName) {
      // 假设存在更新接口
      editTrainingModel({ id: selectedTask.id, taskName: newName })
        .then((res) => {
          message.success(res.message || "名称更新成功");
          getData(); // 重新加载数据
          setIsEditModalVisible(false);
        })
        .catch((err) => message.error(err.message || "更新失败"));
    } else {
      message.warning("任务名称未修改！");
    }
  };

  return (
    <>
      <Layout className="training-model-page">
        <Content>
          <Form form={form} layout="vertical" className="search-form">
            <Form.Item label="任务名称">
              <Input.Search
                enterButton="检索"
                placeholder="请输入任务名称"
                suffix={<SearchOutlined />}
                allowClear
                onChange={onChange}
                onSearch={onSearch}
                loading={ajaxLoading}
                value={searchForm.taskName}
              />
            </Form.Item>
            <Form.Item label="任务类型">
              <Select
                placeholder="请选择任务类型"
                allowClear
                options={[
                  { value: 1, label: "分类" },
                  { value: 2, label: "检测" },
                ]}
                onChange={(value) => handleSelectChange("taskType", value)}
                value={searchForm.taskType || undefined}
              />
            </Form.Item>
            <Form.Item label="任务状态">
              <Select
                placeholder="请选择任务状态"
                allowClear
                options={[
                  { value: 0, label: "训练中" },
                  { value: 1, label: "训练完成" },
                ]}
                value={searchForm.taskStatus || undefined}
                onChange={(value) => handleSelectChange("taskStatus", value)}
              />
            </Form.Item>
            <Form.Item label="训练集">
              <Select
                placeholder="请选择训练集"
                allowClear
                mode="multiple"
                maxTagCount={1}
                options={datasetList}
                onChange={(value) => handleSelectChange("dataset", value)}
                value={searchForm.dataset}
              />
            </Form.Item>
            <Form.Item label=" " className="search-form-btn">
              <Space>
                {/* <Button type="primary" onClick={handleSearch}>
                搜索
              </Button> */}
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
          <div className="result-box">
            <div className="result-title">
              <span className="result-title-count">
                共 <span>{resultData.total}</span> 条结果
              </span>
              <div className="result-title-btn">
                <Button type="primary" onClick={() => navigate("/training-task")}>
                  创建训练任务
                </Button>
              </div>
            </div>
            <ResultFlow
              ajaxLoad={ajaxLoading}
              nodata={!resultData.data.length}
              style={{ height: height.tableBox }}
            >
              <Table
                rowKey="key"
                className="table-common"
                onChange={changeTable}
                pagination={false}
                bordered={true}
                scroll={{
                  y: height.table,
                  x: 1200,
                }}
                columns={columns}
                dataSource={resultData.data}
              />
            </ResultFlow>
            <Pagination
              style={{ display: resultData.data.length ? "flex" : "none" }}
              align="center"
              className="pagination-common"
              showSizeChanger
              showQuickJumper
              showTotal={() => `共 ${resultData.total} 条`}
              total={resultData.total}
              current={searchForm.pn}
              pageSize={searchForm.pageSize}
              pageSizeOptions={pageSizeOptions}
              onChange={changePn}
            />
          </div>
        </Content>
      </Layout>
      {/* 新增编辑名称弹窗 */}
      <Modal
        title="编辑任务名称"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} initialValues={{ taskName: selectedTask?.taskName }}>
          <Form.Item
            label="任务名称"
            name="taskName"
            rules={[{ required: true, message: "请输入任务名称" }]}
          >
            <Input placeholder="请输入新名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TrainingModel;
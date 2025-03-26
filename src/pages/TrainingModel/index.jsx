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
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useRequest, useHeight, useUrlState } from "@/hooks";
import { createRandom, pageSizeOptions } from "@/utils";
import { ResultFlow } from "@/components";
import ajax from "@/services";
import "./index.scss";

const { getTrainingModelList } = ajax.trainingmodel;
const { Content } = Layout;

const defaultResultData = {
  data: [],
  total: 0,
};
const TrainingModel = () => {
  const [form] = Form.useForm();
  const height = useHeight({
    tableBox: 209,
    table: 209 + 60,
  });
  const [searchForm, setSearchForm, searchFormRef, updateUrl] = useUrlState({
    pn: 1,
    pageSize: pageSizeOptions[0],
    search: "",
    serviceType: "",
    connStatusType: "",
    sort: "",
    order: "",
  });

  const [resultData, setResultData] = useState(defaultResultData);

  const { loading: ajaxLoading, run: _getData } = useRequest({
    ajax: getTrainingModelList,
    loadingDelay: 500,
    debounceWait: 300,
    onBefore: (params) => {
      setResultData(defaultResultData);
      updateUrl();
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
      search: e.target.value.trim(),
    });
  };

  const onSearch = (value) => {
    setSearchForm({
      ...searchForm,
      pn: 1,
      search: value.trim(),
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
    console.log(id);
  };

  const handleReset = () => {
    setSearchForm({
      ...searchForm,
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

  const columns = [
    {
      title: "任务名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "任务类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "任务状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "训练完成" ? "success" : "processing";
        return <span className={`status-tag ${color}`}>{status}</span>;
      },
    },
    {
      title: "训练集",
      dataIndex: "dataset",
      key: "dataset",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      sorter: true,
      sortOrder: searchForm.sort == "createTime" ? searchForm.order : false,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">训练结果</Button>
          <Button type="link">编辑</Button>
          <Popconfirm
            title="确定要删除这个训练任务吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout className="training-model-page">
      <Content>
        <Form form={form} layout="vertical" className="search-form">
          <Form.Item label="关键词" name="keyword">
            <Input.Search
              enterButton="检索"
              placeholder="请输入关键词"
              suffix={<SearchOutlined />}
              allowClear
              onChange={onChange}
              onSearch={onSearch}
              loading={ajaxLoading}
              value={searchForm.search}
            />
          </Form.Item>
          <Form.Item label="任务类型" name="taskType">
            <Select
              placeholder="请选择任务类型"
              allowClear
              options={[
                { value: 1, label: "分类" },
                { value: 2, label: "检测" },
              ]}
              onChange={(value) => handleSelectChange("taskType", value)}
            />
          </Form.Item>
          <Form.Item label="任务状态" name="taskStatus">
            <Select
              placeholder="请选择任务状态"
              allowClear
              options={[
                { value: 0, label: "训练中" },
                { value: 1, label: "训练完成" },
              ]}
              onChange={(value) => handleSelectChange("taskType", value)}
            />
          </Form.Item>
          <Form.Item label="训练集" name="dataset">
            <Select
              placeholder="请选择训练集"
              allowClear
              options={[
                { value: "人脸数据集", label: "人脸数据集" },
                { value: "交通数据集", label: "交通数据集" },
              ]}
              onChange={(value) => handleSelectChange("taskType", value)}
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
              <Button type="primary">创建训练任务</Button>
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
  );
};

export default TrainingModel;

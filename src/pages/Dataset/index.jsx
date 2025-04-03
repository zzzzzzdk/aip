import React, { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Form,
  Row,
  Col,
  Modal,
  message,
  Layout,
  Tabs,
  Empty,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { createRandom, pageSizeOptions, getParams } from "@/utils";
import { useRequest, useHeight, useUrlState } from "@/hooks";
import { ResultFlow, DatasetModal, ImportDataModal } from "@/components";
import ajax from "@/services";
import { dataSetType } from "@/components/DatasetModal";
import { useNavigate } from "react-router";
import TableTransfer from "@/components/ImportDataModal/TableTransfer";
import Dashboard from "@/pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { setRouterData } from "@/store/slices/comment";
const { Option } = Select;
const { Content } = Layout;
const { TabPane } = Tabs;

const defaultResultData = {
  data: [],
  total: 0,
};

const { getDataset, deleteDataset, getDatasetDetail } = ajax.dataset;

const Dataset = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const routerData = useSelector((state) => state.comment.routerData);
  const height = useHeight({
    tableBox: 282,
    table: 334,
  });
  const defaultSearchForm = {
    pn: 1,
    pageSize: pageSizeOptions[0],
    dataSetName: "",
    dataType: "",
    status: "",
    trainingSet: "",
  };
  const [searchForm, setSearchForm, searchFormRef, updateUrl] =
    useUrlState(defaultSearchForm);

  const [resultData, setResultData] = useState(defaultResultData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [currentDataset, setCurrentDataset] = useState(null);

  const { loading: ajaxLoading, run: _getData } = useRequest({
    ajax: getDataset,
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
      dataSetName: e.target.value.trim(),
    });
  };

  const onSearch = (value) => {
    setSearchForm({
      ...searchForm,
      pn: 1,
      dataSetName: value.trim(),
    });
    getData();
  };

  const handleSelectChange = (key, value) => {
    setSearchForm({ ...searchForm, [key]: value });
    getData()
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

  const handleReset = () => {
    setSearchForm({
      ...defaultSearchForm,
      pn: 1,
    });
    getData();
  };

  const handleImport = (record) => {
    setCurrentDataset(record);
    setImportModalVisible(true);
  };

  const handleTrainingResult = (record) => {
    dispatch(
      setRouterData({
        ...routerData,
        breadcrumb: [
          ...routerData.breadcrumb,
          {
            text: record.dataSetName,
            path: `/dataset?form=${encodeURIComponent(
              JSON.stringify(searchFormRef.current)
            )}`,
          },
          {
            text: "查看详情",
          },
        ],
      })
    );
    navigate(
      `/dataset/details?id=${record.id}&breadcrumbName=${record.dataSetName}`
    );
  };

  const columns = [
    {
      title: "数据集名称",
      dataIndex: "dataSetName",
      key: "dataSetName",
      width: 300,
      ellipsis: true,
      align: "center",
    },
    {
      title: "数据类型",
      dataIndex: "dataType",
      key: "dataType",
      align: "center",
      render: (type) => (
        <Tag color={type === "image" ? "green" : "blue"}>
          {dataSetType.find((item) => item.value === type)?.label}
        </Tag>
      ),
    },
    {
      title: "已标注数据/总数据",
      key: "dataCount",
      align: "center",
      render: (_, record) => `${record.labeledCount}/${record.totalCount}`,
    },
    {
      title: "最近一次更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
    },
    {
      title: "数据状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === 0 ? "red" : "green"}>
          {status === 0 ? "未达到训练标准" : "已达到训练标准"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 420,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleTrainingResult(record)}>
            查看详情
          </Button>
          <Button type="link" onClick={() => handleImport(record)}>
            导入数据
          </Button>
          <Button
            type="link"
            // icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个数据集吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              // icon={<DeleteOutlined />}
              // onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingDataset(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    // Modal.confirm({
    //   title: "确认删除",
    //   content: `确定要删除数据集"${record.dataSetName}"吗？`,
    //   onOk: () => {
    deleteDataset({ id: record.id })
      .then((res) => {
        message.success(res.message || "删除成功");
        getData();
      })
      .catch((err) => {
        console.log(err.message || "删除失败");
      });
    // },
    // });
  };

  const handleModalOk = () => {
    setEditingDataset(null);
    setIsModalVisible(false);
  };

  // const handleSearch = (values) => {
  //   console.log("Search:", values);
  // };

  const renderTrainingSet = () => (
    <>
      <Form layout="vertical" className="search-form">
        <Form.Item label="数据集名称">
          <Input.Search
            allowClear
            placeholder="请输入数据集名称"
            onChange={onChange}
            onSearch={onSearch}
            suffix={<SearchOutlined />}
            loading={ajaxLoading}
            value={searchForm.dataSetName}
          />
        </Form.Item>
        <Form.Item label="数据类型">
          <Select
            placeholder="请选择数据类型"
            options={dataSetType}
            allowClear
            value={searchForm.dataType || undefined}
            onChange={(value) => handleSelectChange("dataType", value)}
          />
        </Form.Item>
        <Form.Item label="数据状态">
          <Select
            placeholder="请选择数据状态"
            allowClear
            value={searchForm.status || undefined}
            onChange={(value) => handleSelectChange("status", value)}
          >
            <Option value="active">正常</Option>
            <Option value="deleted">已删除</Option>
          </Select>
        </Form.Item>
        <Form.Item label="训练集">
          <Select
            placeholder="请选择训练集"
            allowClear
            value={searchForm.trainingSet || undefined}
            onChange={(value) => handleSelectChange("trainingSet", value)}
          >
            <Option value="all">全部</Option>
            <Option value="training">训练集</Option>
            <Option value="validation">验证集</Option>
          </Select>
        </Form.Item>
        <Form.Item label=" ">
          <Space>
            {/* <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button> */}
            <Button icon={<ReloadOutlined />} onClick={() => handleReset()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div className="result-box">
        <div className="result-title">
          <span className="result-title-count">
            共 <span>{resultData.total}</span> 条结果
          </span>
          <div className="result-title-btn">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              创建数据集
            </Button>
          </div>
        </div>
        <ResultFlow
          ajaxLoad={ajaxLoading}
          nodata={!resultData.data.length}
          style={{ height: height.tableBox }}
        >
          <Table
            className="dataset-table table-common"
            bordered={true}
            columns={columns}
            dataSource={resultData.data}
            rowKey="id"
            loading={ajaxLoading}
            locale={{
              emptyText: <Empty description="暂无数据" />,
            }}
            pagination={false}
            scroll={{
              y: height.table,
            }}
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
    </>
  );

  const renderPendingApproval = () => (
    <div className="pending-approval">
      <Empty description="暂无测试集数据" />
    </div>
  );

  useEffect(() => {
    const params = getParams(window.location.search);
    if (params.form) {
      setSearchForm({
        ...searchForm,
        ...JSON.parse(decodeURIComponent(params.form)),
      });
    }
    getData();
  }, []);

  const [targetKeys, setTargetKeys] = useState([]);
  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <Layout className="dataset-layout">
      <Content className="dataset-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="训练集" key="1">
            {renderTrainingSet()}
          </TabPane>
          <TabPane tab="测试集" key="2">
            {renderPendingApproval()}
          </TabPane>
        </Tabs>

        <DatasetModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingDataset(null);
          }}
          onOk={handleModalOk}
          editingDataset={editingDataset} // 传递编辑中的数据集
        />

        <ImportDataModal
          visible={importModalVisible}
          data={currentDataset}
          onCancel={() => {
            setImportModalVisible(false);
            setCurrentDataset(null);
          }}
        />
      </Content>
    </Layout>
  );
};

export default Dataset;

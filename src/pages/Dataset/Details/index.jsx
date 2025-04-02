import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Layout,
  Image,
  Form,
  Input,
  Pagination,
} from "antd";
import { ResultFlow } from "@/components";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { createRandom, pageSizeOptions, getQueryString } from "@/utils";
import { useRequest, useHeight, useUrlState } from "@/hooks";
import ajax from "@/services";
import errorImg from "@/assets/images/error-img.png";
import { useLocation, useHistory, Link } from 'react-router-dom'
import "./index.scss";

const { Content } = Layout;
const { Meta } = Card;
const { getDatasetDetails } = ajax.dataset;

const defaultResultData = {
  data: [],
  total: 0,
};
const DatasetDetails = () => {
  const location = useLocation()
  const idRef = useRef(getQueryString(location.search, 'id'))
  const height = useHeight({
    tableBox: 184,
  });
  const defaultSearchForm = {
    pn: 1,
    pageSize: pageSizeOptions[0],
    searchKey: "",
    id: idRef.current
  };
  const [searchForm, setSearchForm, searchFormRef, updateUrl] =
    useUrlState(defaultSearchForm);

  const [resultData, setResultData] = useState(defaultResultData);
  const { loading: ajaxLoading, run: _getData } = useRequest({
    ajax: getDatasetDetails,
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
      setResultData(defaultResultData);
    },
  });

  const getData = () => {
    _getData({ ...searchFormRef.current });
  };

  const onChange = (e) => {
    setSearchForm({
      ...searchForm,
      searchKey: e.target.value.trim(),
    });
  };
  
  const onSearch = (value) => {
    setSearchForm({
      ...searchForm,
      pn: 1,
      searchKey: value.trim(),
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout className="dataset-details-layout">
      <Content className="dataset-details-content">
        <Form layout="vertical" className="search-form">
          <Form.Item>
            <Input.Search
              allowClear
              placeholder="请输入内容"
              onChange={onChange}
              onSearch={onSearch}
              suffix={<SearchOutlined />}
              loading={ajaxLoading}
              value={searchForm.dataSetName}
            />
          </Form.Item>
        </Form>
        <div className="result-box">
          <div className="result-title">
            <span className="result-title-count">
              共 <span>{resultData.total}</span> 条结果
            </span>
          </div>
          <ResultFlow
            ajaxLoad={ajaxLoading}
            nodata={!resultData.data.length}
            style={{ height: height.tableBox }}
            isTable={false}
          >
            <Space wrap size={20}>
              {resultData.data.map((item) => (
                <Card
                  hoverable
                  style={{ width: 300 }}
                  cover={
                    <Image
                      // alt="example"
                      src={item.imageUrl}
                      fallback={errorImg}
                      width={300}
                      height={168}
                    />
                  }
                >
                  <Meta
                    title={item.fileName}
                    // description="www.instagram.com"
                  />
                </Card>
              ))}
            </Space>
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

export default DatasetDetails;

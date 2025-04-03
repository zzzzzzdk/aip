import React, { useState } from "react";
import { Card, Row, Col, Statistic, Table, Transfer } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import uniqBy from "lodash/uniqBy";
import difference from "lodash/difference";
import ajax from "@/services";
import "./index.scss";
const { getDataset, uploadFile, importDataset } = ajax.dataset;

const columns = [
  {
    dataIndex: "id",
    title: "ID",
  },
  {
    dataIndex: "title",
    title: "Title",
  },
];

class TableTransfer extends React.Component {
  state = {
    dataSource: [],
    totalDataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params = this.state.pagination) => {
    this.setState({ loading: true });
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "get",
      data: {
        _start: (params.current - 1) * params.pageSize,
        _limit: params.pageSize,
      },
      type: "json",
    }).then((res) => {
      res.json().then((result) => {
        const pagination = { ...this.state.pagination };
        pagination.total = 100;
        // console.log(result, "result");
        // console.log(uniqBy(result, "id"), "result id");
        this.setState({
          loading: false,
          dataSource: uniqBy(result, "id"),
          totalDataSource: uniqBy(
            this.state.totalDataSource.concat(result),
            "id"
          ),
          pagination,
        });
      });
    });
  };

  fetchData2 = (params = this.state.pagination) => {
    getDataset({
      ...params,
      pageSize: params.pageSize || 10,
      pn: params.current,
    }).then((res) => {
      const pagination = { ...this.state.pagination };
      pagination.total = 100;
      // console.log(result, "result");
      // console.log(uniqBy(result, "id"), "result id");
      this.setState({
        loading: false,
        dataSource: uniqBy(res.data, "id"),
        totalDataSource: uniqBy(
          this.state.totalDataSource.concat(res.data),
          "id"
        ),
        pagination,
      });
    });
  };

  render() {
    const { targetKeys = [] } = this.props;
    const { dataSource, pagination, totalDataSource, loading } = this.state;

    return (
      <Transfer
        {...this.props}
        dataSource={dataSource}
        rowKey={(record) => record.id}
      >
        {({
          direction,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          // console.log(direction, listSelectedKeys, "listSelectedKeys");
          const rowSelection = {
            getCheckboxProps: (item) => ({
              disabled: listDisabled || item.disabled,
            }),
            onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows
                .filter((item) => !item.disabled)
                .map(({ id }) => id);
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
            onSelect({ id }, selected) {
              onItemSelect(id, selected);
            },
            selectedRowKeys: listSelectedKeys,
          };

          const handleTableChange = (paginationObj) => {
            if (direction === "left") {
              const pager = { ...this.state.pagination };
              pager.current = paginationObj.current;
              this.setState({
                pagination: pager,
              });
              this.fetchData(paginationObj);
            }
          };

          // console.log(totalDataSource, "totalDataSource", targetKeys);
          const rightDataSource = totalDataSource.filter((item) =>
            targetKeys.includes(item.id)
          );

          const leftDataSource = dataSource.map((item) => ({
            ...item,
            disabled: targetKeys.includes(item.id),
          }));

          return (
            <Table
              showHeader={false}
              rowSelection={rowSelection}
              columns={columns}
              loading={direction === "left" && loading}
              dataSource={
                direction === "left" ? leftDataSource : rightDataSource
              }
              size="small"
              rowKey="id"
              onRow={({ id, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled) return;
                  onItemSelect(id, !listSelectedKeys.includes(id));
                },
              })}
              onChange={handleTableChange}
              pagination={direction === "left" ? pagination : true}
            />
          );
        }}
      </Transfer>
    );
  }
}

const Dashboard = () => {
  const [targetKeys, setTargetKeys] = useState([]);

  return (
    <div className="dashboard-page">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="用户总数"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="订单总数"
              value={93}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="销售额"
              value={11280}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
      <TableTransfer
        targetKeys={targetKeys}
        onChange={(targetKeys, direction, moveKeys) => {
          setTargetKeys(targetKeys);
        }}
      />
    </div>
  );
};

export default Dashboard;

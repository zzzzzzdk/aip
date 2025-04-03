import React, { useState } from "react";
import { Card, Row, Col, Statistic, Table, Transfer } from "antd";
import uniqBy from "lodash/uniqBy";
import difference from "lodash/difference";
import ajax from "@/services";
import "./index.scss";

const { getDataset, uploadFile, importDataset } = ajax.dataset;

const columns = [
  {
    title: "数据集名称",
    dataIndex: "dataSetName",
  },
];

class TableTransfer extends React.Component {
  state = {
    dataSource: [],
    totalDataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
      simple: true,
      showSizeChanger: false,
      position: ["bottomCenter"],
    },
    loading: false,
  };

  componentDidMount() {
    this.fetchData(this.state.pagination);
  }

  fetchData = (params) => {
    getDataset({
      pn: params.current,
      pageSize: params.pageSize,
    }).then((res) => {
      const pagination = { ...this.state.pagination, ...params };
      pagination.total = res.total;
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
        titles={["数据集", "已选数据集"]}
        listStyle={{
          width: 300,
          height: 480,
        }}
        className="table-transfer"
        selectionsIcon={<span></span>}
        selectAllLabels={[
          ({ selectedCount, totalCount }) => (
            <span>
              {selectedCount}/{totalCount}
            </span>
          ),
          <span>全选</span>,
        ]}
        // selectAllLabels={["全选", "全选"]}
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
              pagination={direction === "left" ? pagination : false}
            />
          );
        }}
      </Transfer>
    );
  }
}

export default TableTransfer;

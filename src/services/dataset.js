import ajax from "@/utils/ajax";

const api = {
  common: {},

  // 获取数据集列表
  getDataset: function (data) {
    return ajax({
      url: "/dataset/get",
      method: "post",
      data: data,
    });
  },
  // 创建数据集
  createDataset: function (data) {
    return ajax({
      url: "/dataset/create",
      method: "post",
      data: data,
    });
  },
  // 编辑数据集
  editDataset: function (data) {
    return ajax({
      url: "/dataset/edit",
      method: "post",
      data: data,
    });
  },
  // 删除数据集
  deleteDataset: function (data) {
    return ajax({
      url: "/dataset/delete",
      method: "post",
      data: data,
    });
  },
  // 获取数据集详情
  getDatasetDetails: function (data) {
    return ajax({
      url: "/dataset/detail",
      method: "get",
      params: data,
    });
  },
  // 导入数据
  importDataset: function (data) {
    return ajax({
      url: "/dataset/import",
      method: "post",
      data: data,
    });
  },
  // 文件上传
  uploadFile: function (data) {
    return ajax({
      url: "/dataset/upload",
      method: "post",
      data: data,
    });
  },
};

export default {
  ...api,
};

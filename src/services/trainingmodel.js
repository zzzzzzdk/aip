import ajax from '@/utils/ajax'

const api = {
  common: {},

  // 训练模型列表
  getTrainingModelList: function (data) {
    return ajax({
      url: "/training-model/list",
      method: "get",
      params: data,
    });
  },
  // 创建训练模型
  createTrainingModel: function (data) {
    return ajax({
      url: "/training-model/create",
      method: "post",
      data: data,
    });
  },
  // 编辑训练模型
  editTrainingModel: function (data) {
    return ajax({
      url: "/training-model/edit",
      method: "post",
      data: data,
    });
  },
  // 删除训练模型
  deleteTrainingModel: function (data) {
    return ajax({
      url: "/training-model/delete",
      method: "post",
      data: data,
    });
  },
  // 获取训练模型详情
  getTrainingModelDetail: function (data) {
    return ajax({
      url: "/training-model/detail",
      method: "get",
      data: data,
    });
  },
};

export default {
  ...api,
};

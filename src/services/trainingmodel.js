import ajax from '@/utils/ajax'

const api = {
  common: {},

  // 训练模型列表
  getTrainingModelList: function (data) {
    return ajax({
      url: "/training-model/list",
      method: "post",
      data: data,
    });
  },
};

export default {
  ...api,
};

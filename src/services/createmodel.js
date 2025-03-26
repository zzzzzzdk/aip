import ajax from '@/utils/ajax'

const api = {
  common: {},

  // 创建模型
  createModel: function (data) {
    return ajax({
      url: "/model/create",
      method: "post",
      data: data,
    });
  },
  // 编辑模型
  editModel: function (data) {
    return ajax({
      url: "/model/edit",
      method: "post",
      data: data,
    });
  },
};

export default {
  ...api,
};

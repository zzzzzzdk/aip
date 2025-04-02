import ajax from "@/utils/ajax";

// 标签组相关接口
const labelGroupApi = {
  // 获取标签组+标签列表
  getAllLabelList: function() {
    return ajax({
      url: '/api/label-groups/labels',
      method: 'get'
    });
  },

  // 获取标签组列表
  getGroupList: function() {
    return ajax({
      url: '/api/label-groups',
      method: 'get'
    });
  },

  // 创建标签组
  createGroup: function(data) {
    return ajax({
      url: '/api/label-groups',
      method: 'post',
      data: data
    });
  },

  // 更新标签组
  updateGroup: function(id, data) {
    return ajax({
      url: `/api/label-groups/${id}`,
      method: 'put',
      data: data
    });
  },

  // 删除标签组
  deleteGroup: function(id) {
    return ajax({
      url: `/api/label-groups/${id}`,
      method: 'delete'
    });
  },

  // 获取标签组详情
  getGroupDetail: function(id) {
    return ajax({
      url: `/api/label-groups/${id}`,
      method: 'get'
    });
  }
};

// 标签相关接口
const labelApi = {
  // 获取标签列表
  getLabelList: function(params) {
    return ajax({
      url: '/api/labels',
      method: 'get',
      params: params
    });
  },

  // 创建标签
  createLabel: function(data) {
    return ajax({
      url: '/api/labels',
      method: 'post',
      data: data
    });
  },

  // 更新标签
  updateLabel: function(id, data) {
    return ajax({
      url: `/api/labels/${id}`,
      method: 'put',
      data: data
    });
  },

  // 删除标签
  deleteLabel: function(id) {
    return ajax({
      url: `/api/labels/${id}`,
      method: 'delete'
    });
  },

  // 获取标签详情
  getLabelDetail: function(id) {
    return ajax({
      url: `/api/labels/${id}`,
      method: 'get'
    });
  },

  // 标签属性相关接口
  attribute: {
    // 添加标签属性
    addAttribute: function(labelId, data) {
      return ajax({
        url: `/api/labels/${labelId}/attributes`,
        method: 'post',
        data: data
      });
    },

    // 更新标签属性
    updateAttribute: function(labelId, attributeId, data) {
      return ajax({
        url: `/api/labels/${labelId}/attributes/${attributeId}`,
        method: 'put',
        data: data
      });
    },

    // 删除标签属性
    deleteAttribute: function(labelId, attributeId) {
      return ajax({
        url: `/api/labels/${labelId}/attributes/${attributeId}`,
        method: 'delete'
      });
    },

    // 获取标签属性列表
    getAttributeList: function(labelId) {
      return ajax({
        url: `/api/labels/${labelId}/attributes`,
        method: 'get'
      });
    }
  }
};

export default {
  ...labelGroupApi,
  ...labelApi
};
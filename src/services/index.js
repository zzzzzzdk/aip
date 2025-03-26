import ajax from '@/utils/ajax'
import createmodel from "./createmodel";
import trainingmodel from './trainingmodel';

const api = {
  common: {
  },

  // 获取用户信息
  getSysConfig: function () {
    return ajax({
      method: "get",
      url: '/common/config',
      params: {}
    });
  },


  // 错误信息上报
  postError: function (url, data) {
    return ajax({
      method: "post",
      url: url,
      data: data
    });
  },

  // 获取用户信息
  getUserInfo: function () {
    return ajax({
      method: "get",
      url: '/user/info',
    });
  },

  // 退出登录
  logout: function () {
    return ajax({
      method: "post",
      url: '/common/logout',
      data: {}
    });
  },


  // 获取用户
  getUser: function () {
    return ajax({
      method: "get",
      url: '/common/iam/user/list',
    });
  },

  // 获取角色
  getRole: function () {
    return ajax({
      method: "get",
      url: '/common/iam/role/list',
    });
  },

  // 获取部门
  getDepartment: function () {
    return ajax({
      method: "get",
      url: '/common/iam/org/list',
    });
  },



}

export default {
  createmodel,
  trainingmodel,
  ...api
}

import axios from 'axios'
import { message } from "antd";
import { removeToken, getToken, getID } from "./cookie";
import qs from 'qs';

axios.defaults.baseURL = window.baseApi;
axios.defaults.timeout = 5 * 60 * 1000


/**
 * @description  请求全局拦截
 * @param  {boolean} transFormData  post,put方法 true转form提交表单方式
 * */
axios.interceptors.request.use(
  config => {
    if (config.data && config.data.transFormData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
      delete config.data.transFormData
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })


/**
 * @description ajax 请求
 * @param {Object} ajaxData 配置 ajax 请求的键值对集合
 * @param {String} ajaxData.type 创建请求使用的方法
 * @param {String} ajaxData.url 请求服务器的 URL
 * @param {Object} ajaxData.data 与请求一起发送的 URL 参数
 */
function ajax(ajaxData = {}) {

  if (window.userId && getID() != window.userId) {
    window.location.reload()
    return
  }

  if (ajaxData.transFormData) {
    ajaxData.data = { ...ajaxData.data, transFormData: true }
  }

  return new Promise((resolve, reject) => {

    axios({ ...ajaxData }).then(res => {
      if (res.data.code === 20000) {
        resolve(res.data)
      } else {
        reject(res.data)
      }
    }).catch(err => {
      let response = err.response
      if (response) {
        switch (response.status) {
          case 401:
            logout()
            break
          case 500:
            break
          case 504:
            break
        }
      }
      reject(err)
    })
  })
}


const logout = () => {
  removeToken()
  window.location.replace(window.sysConfig?.logoutUrl)
}


const setHeader = () => {
  axios.defaults.headers.common['Authorization'] = getToken()
}


export {
  setHeader
}


export default ajax



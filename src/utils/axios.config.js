import axios from 'axios'
import { isObject } from '@/utils/is'
import { Message } from "@yisa/webui";
import { getToken } from "./cookie";
import omit from '@/utils/omit'

axios.defaults.baseURL = window.YISACONF.api_host;
axios.defaults.timeout = 2 * 60 * 1000
axios.defaults.headers.common['Authorization'] = getToken() ?? ""

/**
 * @description ajax 请求
 * @param {Object} ajaxData 配置 ajax 请求的键值对集合
 * @param {String} ajaxData.method 创建请求使用的方法
 * @param {String} ajaxData.url 请求服务器的 URL
 * @param {Object} ajaxData.data 与请求一起发送的 URL 参数
 */
function ajax(ajaxData) {
  return new Promise((resolve, reject) => {
    if (!isObject(ajaxData)) {
      return reject(new Error('ajax请求配置错误'))
    }
    let method = ajaxData.method || 'get'
    method = method.toLowerCase()
    let url = ajaxData.url
    let data =
      method === 'get' ?
        { params: ajaxData.data }
        :
        method === 'delete' || method === 'post' ?
          { data: ajaxData.data }
          :
          ajaxData.data

    const axiosRequestConfig = omit(ajaxData, ['method', 'url', 'data'])
    axios({
      method,
      url,
      ...data,
      ...axiosRequestConfig
    })
      .then((res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 202:
          case 204:
            resolve({
              status: res.status,
              ...res.data
            })
            break
        }
      }).catch(err => {
        console.log(err)
        if (err.message && err.message === "canceled") {
          console.log('请求已取消')
        }
        let response = err.response || {}
        const msg = response.data ? response.data.message : response.statusText
        if (response.status) {
          switch (response.status) {
            case 401:
              Message.error(msg)
              window.location.href = window.YISACONF.login_url
              break
            case 400:
            case 403:
            case 404:
              Message.error(`${url}: ${response.statusText}`)
              break
            case 405:
            case 406:
            case 408:
            case 409:
            case 410:
            case 413:
            case 414:
            case 415:
            case 429:
              Message.error(msg)
              break
            case 500:
            case 503:
            case 504:
              Message.error(msg)
              break
            default:
              Message.error(response.statusText)
              break
          }
        }
        return reject(err)
      })
  })
}

export default ajax 
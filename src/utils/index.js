import { getToken, getRToken, setToken, setRToken, setID, getID, removeToken } from './cookie'
import { encryptData, rsaUtil, aesUtil } from './encryption'
import L from 'leaflet'
export const pageSizeOptions = ["30", "60", "180"]
export function isObject(params) {
  return Object.prototype.toString.call(params) === '[object Object]'
}

export function isArray(params) {
  return Object.prototype.toString.call(params) === '[object Array]'
}

export function isFunction(params) {
  return Object.prototype.toString.call(params) === '[object Function]'
}

export function isNumber(params) {
  return Object.prototype.toString.call(params) === '[object Number]'
}

// 文件大小转换
export function toSizeText(size) {
  let num = 0
  let unit = ''
  if (size < 1000) {
    num = size
    unit = 'B'
  } else if (size / 1024 < 1000) {
    num = size / 1024
    unit = 'KB'
  } else if (size / 1024 / 1024 < 1000) {
    num = size / 1024 / 1024
    unit = 'MB'
  } else {
    num = size / 1024 / 1024 / 1024
    unit = 'GB'
  }
  num = Math.floor(num * 100) / 100
  return `${num}${unit}`
}

// 获取localStorage的已存容量
export function getLocalSurplus() {
  if (!window.localStorage) {
    console.log('浏览器不支持localStorage');
  }
  var size = 0;
  for (let item in window.localStorage) {
    if (window.localStorage.hasOwnProperty(item)) {
      size += window.localStorage.getItem(item)?.length ?? 0;
    }
  }

  if (parseInt((size / 1024).toFixed(2)) > 4000) {
    window.localStorage.clear()
  }
  console.log('当前localStorage已存容量为' + (size / 1024).toFixed(2) + 'KB');
}

export function getQueryString(h, name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = h.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

// 获取地址栏搜索参数 search 格式，如： ?deal_status=2
export function getParams(search) {
  let result = {}
  let searchParamsStr = search.split('?')[1]
  if (searchParamsStr) {
    let searchParams = searchParamsStr.split('&')
    searchParams.forEach(elem => {
      let arr = elem.split('=')
      let key = arr[0]
      let value = arr[1]
      if (key) {
        result[key] = decodeURIComponent(value)
      }
    })
  }
  return result
}

// 生成一个唯一随机数
export function createRandom() {
  return new Date().getTime() + '_' + (Math.random() * 10000) + '_' + (Math.random() * 10000)
}

// 输入框输入整数处理
export function integerHandle(value) {
  if (isNaN(parseInt(value))) {
    return ''
  } else {
    return parseInt(value)
  }
}

// input输入框的字符禁用
export function handleKeyPress(event) {
  const forbiddenCharacters = ['-', '+', '.', 'e', 'E']
  if (forbiddenCharacters.indexOf(event.key) !== -1) {
    event.preventDefault()
  }
}

// 开启前进后退事件
export function mouseTools(min) {
  let x = 0
  let tag = false
  let move = false

  window.addEventListener('mousedown', function (e) {
    e = window.event || e
    if (e.which == 3) {
      x = e.pageX
      tag = true
    }
  })

  window.addEventListener('contextmenu', function (e) {
    if (move) {
      e = window.event || e
      move = false
      e.preventDefault()
      return false;
    }
  })

  window.addEventListener('mouseup', function (e) {
    e = window.event || e
    if (e.which == 3 && tag) {
      tag = false
      let movex = e.pageX - x
      if (Math.abs(movex) > min) {
        move = true
        if (movex > 0) {
          window.history.go(1)
        } else {
          window.history.back()
        }
      }
    }
  })
}

export function getMapProps(domId) {
  const {
    center,
    zoom,
    zooms,
    mapTileTemplate,
    mapTileOptions,
    mapTileHost,
    mapCRS
  } = window.YISACONF?.map || {}

  const mapProps = {
    domId,
    mapOptions: {
      center: [...center].reverse(),
      zoom: zoom,
      crs: mapCRS ? L.CRS[`EPSG${mapCRS}`] : L.CRS.EPSG3857
    },
    showScale: true
  }

  const tileLayerProps = {
    tileUrlTemplate: mapTileTemplate,
    tileLayerOptions: {
      ...(isObject(mapTileOptions) ? mapTileOptions : {
        maxZoom: zooms[1],
        minZoom: zooms[0],
        mapTileHost: mapTileHost
      })
    }
  }

  return {
    mapProps,
    tileLayerProps
  }
}

// 数组扁平化
export function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(item, (Array.isArray(item.children) ? flatten(item.children) : []))
  }, [])
}

// 车牌号校验  plate  车牌号     accurate  是否是精确的
export function validatePlate(plate, accurate) {
  let value = plate.toUpperCase().trim().replace(/\s/g, "");
  // 精准车牌不能有这两个字符
  if (
    accurate &&
    (!value || value.indexOf("*") !== -1 || value.indexOf("?") !== -1)
  ) {
    return false;
  }
  // 车牌号不能大于8
  if (value.length > 8) {
    return false;
  }
  // 车牌号不能有特殊字符
  let containSpecial = RegExp(
    /[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\￥)(\^)(\&)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\)]+/
  );
  let ft = containSpecial.test(value);
  if (ft == true) {
    return false;
  }

  if (value !== "" && value.indexOf("*") == -1 && value.indexOf("?") == -1) {
    let re =
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领军空A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{3,5}[A-Z0-9挂学警港澳使领]{1}$/;
    if (value.search(re) == -1) {
      return false;
    }
  } else {
    if (value !== "" && value.indexOf("*") == -1) {
      if (value.length != 6 && value.length != 7 && value.length != 8) {
        return false;
      }
    }
  }
  return true;
}

// 各种正则表达式
const regular = {
  zh: /[\u4e00-\u9fa5]/g, // 匹配到中文
  zhBlank: /[\u4e00-\u9fa5]|\s/g, // 匹配到中文+空格,
  ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,//ip地址
  port: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,
  ipPort: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])){0,1}$/, // iP/ip+端口
  isNum: /^[0-9]*$/,
  isPhone: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //手机号
}

export { regular } 
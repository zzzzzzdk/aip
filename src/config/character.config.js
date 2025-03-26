import light from '../pages/Layout/images/light.png'
import dark from '../pages/Layout/images/dark.png'
import { DrawType } from '@/components/LocationMapList/interface'

/**
 *@description  数据字典
 * */

const character = {
  pageSizeOptions: [40, 80, 200],
  tableGroupPageSizeOptions: [30, 60, 90],
  loadingTip: "正在加载中...",
  // 换肤配置
  skinData: [
    {
      skin: 'light',
      img: light,
      text: '浅色',
    },
    {
      skin: 'dark',
      img: dark,
      text: '深色'
    },
    {
      skin: 'technological',
      img: dark,
      text: '科技色'
    },
  ],
  // 目标类型
  targetTypes: [
    { label: "人脸", value: 'face' },
    { label: "行人", value: 'pedestrian' },
    { label: "二轮车", value: 'bicycle' },
    { label: "三轮车", value: 'tricycle' },
    { label: "汽车", value: 'vehicle' },
  ],
  // 图文列表
  resultShowType: [
    { label: "图文", value: 'image' },
    { label: "列表", value: 'list' },
  ],
  featureTypeToText: {
    face: "人脸",
    pedestrian: "行人",
    bicycle: "二轮车",
    tricycle: "三轮车",
    vehicle: "汽车",
    gait: "步态"
  },
  // 车辆分组方式g
  groupType: [
    {
      text: '按前端识别车牌分组',
      tableName: '前端车牌',
      value: 'licensePlate1',
      targetType: 'vehicle'
    },
    {
      text: '按二次识别车牌分组',
      tableName: '二次车牌',
      value: 'licensePlate2',
      targetType: 'vehicle'
    },
    {
      text: '按车牌省份分组',
      tableName: '车牌省份',
      value: 'licensePlate2Province',
      targetType: 'vehicle'
    },
    {
      text: '按点位分组',
      tableName: '点位',
      value: 'locationId',
      targetType: 'vehicle,face,pedestrian,bicycle,tricycle'
    },
    {
      text: '按车辆品牌分组',
      tableName: '车辆品牌',
      value: 'brandId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆型号分组',
      tableName: '车辆型号',
      value: 'modelId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆年款分组',
      tableName: '车辆年款',
      value: 'yearId',
      targetType: 'vehicle'
    },
    {
      text: '按车牌颜色分组',
      tableName: '车牌颜色',
      value: 'plateColorTypeId2',
      targetType: 'vehicle'
    },
    {
      text: '按行驶方向分组',
      tableName: '行驶方向',
      value: 'directionId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆使用性质分组',
      tableName: '车辆使用性质',
      value: 'vehicleFuncId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆类别分组',
      tableName: '车辆类别',
      value: "vehicleTypeId",
      targetType: 'vehicle'
    },
    {
      text: '按车辆颜色分组',
      tableName: '车辆颜色',
      value: 'colorTypeId',
      targetType: 'vehicle'
    },
    {
      text: '按日期分组',
      tableName: '日期',
      value: 'date',
      targetType: 'face,pedestrian,bicycle,tricycle'
    },
    // {
    //   text: '按点位分组',
    //   tableName: '点位',
    //   value: 'color_id'
    // },
  ],
  // 筛选方式
  filterType: [
    {
      text: '可识别驾乘人脸',
      value: 'isFace',
      targetType: 'vehicle'
    },
    {
      text: '遮挡面部',
      value: 'sunVisor',
      targetType: 'vehicle'
    },
    {
      text: '双识同牌',
      value: 'samePlate',
      title: '筛选前端设备识别和二次识别相同的结果',
      targetType: 'vehicle'
    },
    {
      text: '初次入城（30天）',
      value: 'firstCity',
      targetType: 'vehicle'
    },
    {
      text: '可识别人脸',
      value: 'isFace',
      targetType: 'face,pedestrian,bicycle,tricycle'
    },

    // {
    //   text: '主驾未系安全带',
    //   value: 'mainWithout_belt',
    // },
    // {
    //   text: '副驾未系安全带',
    //   value: 'sub_without_belt',
    // },
    // {
    //   text: '主驾拨打电话',
    //   value: 'main_phone',
    // },
  ],
  //分组
  tagTypes: [
    { key: "region", name: '按点位选择' },
    { key: "locationGroup", name: '按点位组选择' },
    { key: "offline", name: '离线文件' },
  ],
  //以图上传类型
  imageTypes: [
    {
      label: "图片",
      value: "image"
    },
    {
      label: "步态",
      value: "gait"
    }
  ],
  //排序方式
  yituSort: [
    {
      label: "相似度",
      value: "similarity",
      order: "desc"
    },
    {
      label: "时间",
      value: "captureTime",
      order: "desc"
    },
  ],
  //步态参数
  gaitParams: {
    max_display_number: 200,
    max_selected_number: 5
  },
  //以图上传人脸，步态参数选择
  yituFilter: {
    face: [
      {
        value: "1",
        label: "人脸搜车"
      },
      {
        value: "2",
        label: "过滤低质量人脸",
        default: true
      }

    ],
    gait: [
      {
        value: "1",
        label: "步态逻辑筛选",
        default: true
      },
    ]
  },
  // 排序1
  sortList: [
    {
      value: "peerCount-desc",
      label: "按同行次数降序",
    },
    {
      value: "peerCount-asc",
      label: "按同行次数升序",
    },
    {
      value: "locationCount-desc",
      label: "按点位数降序",
    },
    {
      value: "locationCount-asc",
      label: " 按点位数升序",
    }
  ],
  // 排序2
  captureSortList: [
    {
      value: "captureTime-desc",
      label: "按抓拍时间降序",
    },
    {
      value: "captureTime-asc",
      label: "按抓拍时间升序"
    }
  ],
  //排序3
  foothodsortList: [
    {
      value: "1",
      label: "按落脚次数降序",
    },
    {
      value: "2",
      label: "按落脚次数升序",
    },
    {
      value: "3",
      label: "按落脚频率降序",
    },
    {
      value: "4",
      label: "按落脚频率升序",
    },
  ],
  //排序4
  staysortList: [
    {
      value: "staytime-down",
      label: "按停留时段降序",
    },
    {
      value: "staytime-up",
      label: "按停留时段升序",
    },
  ],
}
//画图工具
const drawTools: {
  icon: string;
  type: DrawType;
}[] = [
    {
      icon: 'zhuashou',
      type: 'default'
    },
    {
      icon: 'quanxuan',
      type: 'circle'
    },
    {
      icon: 'kuangxuan',
      type: 'rectangle'
    },
    {
      icon: 'zidingyi',
      type: 'polygon'
    },
    {
      icon: 'shanchu',
      type: 'clear'
    },
  ]

export default {
  ...character,
  drawTools
}

var express = require("express");
var router = express.Router();
const trainingDetailsJson = require("./json/trainingDetails.json");

router.get("/training-model/list", (req, res, next) => {
  // 获取分页参数
  const page = parseInt(req.body.page) || 1; // 默认第一页
  const pageSize = parseInt(req.body.pageSize) || 10; // 默认每页10条数据

  // 模拟数据
  const data = [
    {
      id: "1",
      taskName: "人脸识别模型 V1",
      taskType: "图像分类",
      taskStatus: 1,
      dataset: "人脸数据集",
      createTime: "2024-03-21 10:00:00",
    },
    {
      id: "2",
      taskName: "目标检测模型 V2",
      taskType: "目标检测",
      taskStatus: 0,
      dataset: "交通数据集",
      createTime: "2024-03-21 09:30:00",
    },
    {
      id: "3",
      taskName: "语音识别模型 V3",
      taskType: "语音识别",
      taskStatus: 1,
      dataset: "语音数据集",
      createTime: "2024-03-20 15:45:00",
    },
    {
      id: "4",
      taskName: "自然语言处理模型 V4",
      taskType: "自然语言处理",
      taskStatus: 0,
      dataset: "文本数据集",
      createTime: "2024-03-19 14:20:00",
    },
    {
      id: "5",
      taskName: "推荐系统模型 V5",
      taskType: "推荐系统",
      taskStatus: 1,
      dataset: "用户行为数据集",
      createTime: "2024-03-18 13:50:00",
    },
    {
      id: "6",
      taskName: "图像分割模型 V6",
      taskType: "图像分割",
      taskStatus: 0,
      dataset: "医学影像数据集",
      createTime: "2024-03-17 12:35:00",
    },
    {
      id: "7",
      taskName: "情感分析模型 V7",
      taskType: "情感分析",
      taskStatus: 1,
      dataset: "社交媒体数据集",
      createTime: "2024-03-16 11:20:00",
    },
    {
      id: "8",
      taskName: "时间序列预测模型 V8",
      taskType: "时间序列预测",
      taskStatus: 0,
      dataset: "股票价格数据集",
      createTime: "2024-03-15 10:05:00",
    },
    {
      id: "9",
      taskName: "异常检测模型 V9",
      taskType: "异常检测",
      taskStatus: 1,
      dataset: "网络流量数据集",
      createTime: "2024-03-14 08:50:00",
    },
    {
      id: "10",
      taskName: "强化学习模型 V10",
      taskType: "强化学习",
      taskStatus: 0,
      dataset: "游戏数据集",
      createTime: "2024-03-13 07:35:00",
    },
    {
      id: "11",
      taskName: "聚类分析模型 V11",
      taskType: "聚类分析",
      taskStatus: 1,
      dataset: "客户数据集",
      createTime: "2024-03-12 06:20:00",
    },
    {
      id: "12",
      taskName: "降维模型 V12",
      taskType: "降维",
      taskStatus: 0,
      dataset: "高维数据集",
      createTime: "2024-03-11 05:05:00",
    },
    {
      id: "13",
      taskName: "生成对抗网络模型 V13",
      taskType: "生成对抗网络",
      taskStatus: 1,
      dataset: "图像生成数据集",
      createTime: "2024-03-10 03:50:00",
    },
    {
      id: "14",
      taskName: "协同过滤模型 V14",
      taskType: "协同过滤",
      taskStatus: 0,
      dataset: "用户评分数据集",
      createTime: "2024-03-09 02:35:00",
    },
    {
      id: "15",
      taskName: "多任务学习模型 V15",
      taskType: "多任务学习",
      taskStatus: 1,
      dataset: "多任务数据集",
      createTime: "2024-03-08 01:20:00",
    },
    {
      id: "16",
      taskName: "迁移学习模型 V16",
      taskType: "迁移学习",
      taskStatus: 0,
      dataset: "迁移数据集",
      createTime: "2024-03-07 00:05:00",
    },
    {
      id: "17",
      taskName: "图神经网络模型 V17",
      taskType: "图神经网络",
      taskStatus: 1,
      dataset: "图数据集",
      createTime: "2024-03-06 23:50:00",
    },
    {
      id: "18",
      taskName: "贝叶斯网络模型 V18",
      taskType: "贝叶斯网络",
      taskStatus: 0,
      dataset: "贝叶斯数据集",
      createTime: "2024-03-05 22:35:00",
    },
    {
      id: "19",
      taskName: "深度强化学习模型 V19",
      taskType: "深度强化学习",
      taskStatus: 1,
      dataset: "深度学习数据集",
      createTime: "2024-03-04 21:20:00",
    },
    {
      id: "20",
      taskName: "对抗攻击检测模型 V20",
      taskType: "对抗攻击检测",
      taskStatus: 0,
      dataset: "对抗攻击数据集",
      createTime: "2024-03-03 20:05:00",
    },
    // 可以继续添加更多数据...
  ];

  // 计算分页数据
  const total = data.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  // 返回分页结果
  res.json({
    code: 20000,
    total: 200,
    data: paginatedData,
  });
});

router.all("/training-model/create", (req, res, next) => {
  res.json({
    code: 20000,
    message: "创建成功",
  });
});

router.all("/training-model/edit", (req, res, next) => {
  res.json({
    code: 20000,
    message: "编辑成功",
  });
});

router.all("/training-model/delete", (req, res, next) => {
  res.json({
    code: 20000,
    message: "删除成功",
  });
});

router.all("/training-model/detail", (req, res, next) => {
  res.json({
    code: 20000,
    message: "获取详情成功",
    data: trainingDetailsJson
  });
});


module.exports = router;

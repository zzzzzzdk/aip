var express = require("express");
var router = express.Router();

// 获取数据集列表
router.post("/dataset/get", (req, res, next) => {
  const { pn, current, pageSize = 10 } = req.body; // 默认值为第一页，每页10条数据
  console.log(req.body, "req.body");
  // 生成假数据
  const generateData = (page = 1, size) => {
    const start = (page - 1) * size;
    const end = start + size;
    const data = [];
    for (let i = start + 1; i <= end; i++) {
      data.push({
        id: page + "-" + i,
        dataSetName: `训练数据集${page + "-" + i}`, // 数据集名称
        dataType: i % 2 === 0 ? "video" : "image", // 数据类型，交替为 image 和 video
        status: "active", // 数据状态
        updateTime: "2024-03-26 10:00:00", // 最近一次更新时间
        labeledCount: 800, // 已标注数据
        totalCount: 1000, // 总数据
        description: "用于模型训练的数据集", // 描述
      });
    }
    return data;
  };

  const total = 200; // 总数据量
  const data = generateData(pn || current, 10);

  res.json({
    ...req.json,
    total: total,
    data: data,
  });
});

// 创建数据集
router.post("/dataset/create", (req, res, next) => {
  req.json = {
    ...req.json,
    message: "创建成功",
  };
  res.json(req.json);
});

// 编辑数据集
router.post("/dataset/edit", (req, res, next) => {
  console.log(req.json);
  req.json = {
    ...req.json,
    message: "编辑成功",
  };
  res.json(req.json);
});

// 删除数据集
router.post("/dataset/delete", (req, res, next) => {
  req.json = {
    ...req.json,
  };
  res.json(req.json);
});

// 获取数据集详情
// 获取数据集详情
router.all("/dataset/detail", (req, res, next) => {
  const { pn = 1, pageSize = 10 } = req.body; // 默认值为第一页，每页10条数据
  // 生成假数据
  const generateData = (page, size) => {
    const start = (page - 1) * size;
    const end = start + size;
    const data = [];
    for (let i = start + 1; i <= end; i++) {
      data.push({
        id: i,
        imageUrl: `http://example.com/images/image${i}.jpg`, // 图片地址
        fileName: `file${i}.${i % 2 === 0 ? "mp4" : "jpg"}`, // 文件名称
        videoUrl: `http://example.com/videos/video${i}.mp4`, // 视频地址
      });
    }
    return data;
  };

  const total = 200; // 总数据量
  const data = generateData(pn, 10);

  res.json({
    ...req.json,
    total: total,
    data: data,
  });
});

// 导入数据
router.post("/dataset/import", (req, res, next) => {
  req.json = {
    ...req.json,
  };
  res.json(req.json);
});

// 文件上传
router.post("/dataset/upload", (req, res, next) => {
  req.json = {
    ...req.json,
    url: "http://localhost:3002/dataset/upload?id=" + new Date().getTime(),
  };
  res.json(req.json);
});

module.exports = router;

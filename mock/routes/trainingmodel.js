var express = require("express");
var router = express.Router();

router.post("/training-model/list", (req, res, next) => {
  req.json = {
    ...req.json,
    total: 100,
    data: [
      {
        id: "1",
        name: "人脸识别模型 V1",
        type: "图像分类",
        status: "训练完成",
        dataset: "人脸数据集",
        createTime: "2024-03-21 10:00:00",
      },
      {
        id: "2",
        name: "目标检测模型 V2",
        type: "目标检测",
        status: "训练中",
        dataset: "交通数据集",
        createTime: "2024-03-21 09:30:00",
      },
    ],
  };
  res.json(req.json);
});

module.exports = router;

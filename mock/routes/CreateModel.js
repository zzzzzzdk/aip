var express = require('express');
var router = express.Router();

router.post("/model/create", (req, res, next) => {
  req.json = {
    ...req.json,
    data: {
      modelId: 11123
    }
  }
  res.json(req.json)
})

router.post("/model/edit", (req, res, next) => {
  req.json = {
    ...req.json,
    data: {
      modelId: 11123
    }
  }
  res.json(req.json)
})


router.get("/model/delete", (req, res, next) => {
  req.json = {
    ...req.json,
    
  }
  res.json(req.json)
})

module.exports = router

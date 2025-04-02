var express = require('express');
var router = express.Router();

// 模拟标签组数据
const labelGroups = [
  {
    id: 1,
    name: "情感分析",
    description: "用于情感分析的标签组",
    createTime: "2024-03-26 10:00:00",
    updateTime: "2024-03-26 10:00:00"
  },
  {
    id: 2,
    name: "文本分类",
    description: "用于文本分类的标签组",
    createTime: "2024-03-26 11:00:00",
    updateTime: "2024-03-26 11:00:00"
  }
];

// 模拟标签数据
const labels = [
  {
    id: 11,
    name: "积极",
    description: "表示积极的情感",
    color: "#52c41a",
    groupId: 1,
    createTime: "2024-03-26 10:00:00",
    updateTime: "2024-03-26 10:00:00",
    count: 500,
    attributes: [
      {
        id: 1111,
        name: "强度",
        type: "number",
        value: 0.8
      },
      {
        id: 2222,
        name: "置信度",
        type: "number",
        value: 0.95
      }
    ]
  },
  {
    id: 22,
    name: "消极",
    description: "表示消极的情感",
    color: "#f5222d",
    groupId: 1,
    createTime: "2024-03-26 11:00:00",
    updateTime: "2024-03-26 11:00:00",
    count: 300,
    attributes: [
      {
        id: 112,
        name: "类型",
        type: "string",
        value: "A类"
      }
    ]
  }
];

// 获取标签组+标签列表(嵌套结构，标签组包含标签)
router.get('/api/label-groups/labels', (req, res) => {
  res.json({
    code: 20000,
    data: labelGroups.map(group => ({
      ...group,
      labels: labels.filter(label => label.groupId === group.id)
    })),
    message: 'success'
  });
});

// 标签组相关接口
router.get('/api/label-groups', (req, res) => {
  res.json({
    code: 20000,
    data: labelGroups,
    message: 'success'
  });
});

router.post('/api/label-groups', (req, res) => {
  const newGroup = {
    id: labelGroups.length + 1,
    ...req.body,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  };
  labelGroups.push(newGroup);
  res.json({
    code: 20000,
    data: newGroup,
    message: 'success'
  });
});

router.put('/api/label-groups/:id', (req, res) => {
  const { id } = req.params;
  const index = labelGroups.findIndex(group => group.id === parseInt(id));
  if (index > -1) {
    labelGroups[index] = {
      ...labelGroups[index],
      ...req.body,
      updateTime: new Date().toISOString()
    };
    res.json({
      code: 20000,
      data: labelGroups[index],
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label group not found'
    });
  }
});

router.delete('/api/label-groups/:id', (req, res) => {
  const { id } = req.params;
  const index = labelGroups.findIndex(group => group.id === parseInt(id));
  if (index > -1) {
    labelGroups.splice(index, 1);
    res.json({
      code: 20000,
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label group not found'
    });
  }
});

router.get('/api/label-groups/:id', (req, res) => {
  const { id } = req.params;
  const group = labelGroups.find(group => group.id === parseInt(id));
  if (group) {
    res.json({
      code: 20000,
      data: group,
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label group not found'
    });
  }
});

// 标签相关接口
router.get('/api/labels', (req, res) => {
  const { groupId } = req.query;
  let filteredLabels = labels;
  if (groupId) {
    filteredLabels = labels.filter(label => label.groupId === parseInt(groupId));
  }
  res.json({
    code: 20000,
    data: filteredLabels,
    message: 'success'
  });
});

router.post('/api/labels', (req, res) => {
  const newLabel = {
    id: labels.length + 1,
    ...req.body,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    count: 0,
    attributes: []
  };
  labels.push(newLabel);
  res.json({
    code: 20000,
    data: newLabel,
    message: 'success'
  });
});

router.put('/api/labels/:id', (req, res) => {
  const { id } = req.params;
  const index = labels.findIndex(label => label.id === parseInt(id));
  if (index > -1) {
    labels[index] = {
      ...labels[index],
      ...req.body,
      updateTime: new Date().toISOString()
    };
    res.json({
      code: 20000,
      data: labels[index],
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

router.delete('/api/labels/:id', (req, res) => {
  const { id } = req.params;
  const index = labels.findIndex(label => label.id === parseInt(id));
  if (index > -1) {
    labels.splice(index, 1);
    res.json({
      code: 20000,
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

router.get('/api/labels/:id', (req, res) => {
  const { id } = req.params;
  const label = labels.find(label => label.id === parseInt(id));
  if (label) {
    res.json({
      code: 20000,
      data: label,
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

// 标签属性相关接口
router.get('/api/labels/:id/attributes', (req, res) => {
  const { id } = req.params;
  const label = labels.find(label => label.id === parseInt(id));
  if (label) {
    res.json({
      code: 20000,
      data: label.attributes || [],
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

router.post('/api/labels/:id/attributes', (req, res) => {
  const { id } = req.params;
  const label = labels.find(label => label.id === parseInt(id));
  if (label) {
    const newAttribute = {
      id: (label.attributes || []).length + 1,
      ...req.body
    };
    label.attributes = label.attributes || [];
    label.attributes.push(newAttribute);
    res.json({
      code: 20000,
      data: newAttribute,
      message: 'success'
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

router.put('/api/labels/:id/attributes/:attributeId', (req, res) => {
  const { id, attributeId } = req.params;
  const label = labels.find(label => label.id === parseInt(id));
  if (label) {
    const attributeIndex = (label.attributes || []).findIndex(attr => attr.id === parseInt(attributeId));
    if (attributeIndex > -1) {
      label.attributes[attributeIndex] = {
        ...label.attributes[attributeIndex],
        ...req.body
      };
      res.json({
        code: 20000,
        data: label.attributes[attributeIndex],
        message: 'success'
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'Attribute not found'
      });
    }
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

router.delete('/api/labels/:id/attributes/:attributeId', (req, res) => {
  const { id, attributeId } = req.params;
  const label = labels.find(label => label.id === parseInt(id));
  if (label) {
    const attributeIndex = (label.attributes || []).findIndex(attr => attr.id === parseInt(attributeId));
    if (attributeIndex > -1) {
      label.attributes.splice(attributeIndex, 1);
      res.json({
        code: 20000,
        message: 'success'
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'Attribute not found'
      });
    }
  } else {
    res.status(404).json({
      code: 404,
      message: 'Label not found'
    });
  }
});

module.exports = router; 
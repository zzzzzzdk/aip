var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'pc_demo mock 数据' });
});


// 上错错误信息
router.post('/post_error', function (req, res, next) {
  res.json(req.json);
});

//  获取系统配置信息-白名单
router.get('/common/config', function (req, res, next) {
  req.json.data = {
    "waterMark": false,
    "loginUrl": "./login.html?",
    "logoutUrl": "./login.html?",
    "iamUrl": "----",

    "help_url": "/syshelp",
  }
  res.json(req.json);
});





// 获取用户信息
router.get('/user/info', async function (req, res, next) {
  // await req.sleep(0)
  req.json.data = {
    "userInfo": {
      "id": 1234,
      "name": '张三',
      "unit": "张店区公安局",
      "role": [
        '管理员'
      ],
    },
    "menus": [
      {
        "title": "首页",
        "icon": 'shouye',
        "path": '/home',
      },
      {
        "title": "数据集成",
        "icon": 'shujujicheng',
        "path": "/clear",
        "children": [
          {
            "title": "资源目录",
            "path": "/databasetable",
          },
          {
            "title": "数据库连接",
            "path": "/database",
          },
        ]
      },
      {
        "title": "工作台",
        "icon": 'gongzuotai',
        "path": "/worker",
        "children": [
          {
            "title": "数据建模",
            "path": '/modellist',
          },
          {
            "title": "数据清洗",
            "path": '/modellist--',
          },
        ]
      },
      {
        "title": "我的资源",
        "icon": 'wodeziyuan',
        "path": "/source",
        "children": [
          {
            "title": "模型资源",
            "path": '/modelsource',
          },
          {
            "title": "数据资源",
            "path": '/tablesource',
          },
          {
            "title": "存储空间",
            "path": '/databasespace',
          },
        ]
      },
      {
        "title": "任务调度",
        "icon": 'renwutiaodu',
        "path": '/tasklist',
      },
      {
        "title": "探索发现",
        "icon": 'tansuofaxian',
        "path": "/explore",
        "children": [
          {
            "title": "模型市场",
            "path": "/modelmarket",
          },
          {
            "title": "数据市场",
            "path": "/datamarket",
          },
          {
            "title": "我的申请",
            "path": '/myapplication',
          }
        ]
      },
      {
        "title": "元数据管理",
        "icon": 'yuanshujuguanli',
        "path": "/meat",
        "children": [
          {
            "title": "标签列表",
            "path": "/taglist",
          },
        ]
      },
    ],
    "route": [
      '/database',
      '/databasetable',
      '/storagespace',
      '/taglist',
      '/createmodel',
      '/modellist',
      '/tasklist',
      '/tablesource',
      '/modelsource',
      '/modelmarket',
      '/datamarket',
      '/databasespace',
      '/myapplication'
    ]
  }

  res.json(req.json);
});

// 刷新token-白名单
router.get('/refresh_token', function (req, res, next) {
  req.json.refresh_token = 'rrrrccccc'
  req.json.apisix_token = 'aaaaccccc'
  res.json(req.json);
});


// 修改布局和主题
router.get('/change_style', function (req, res, next) {
  res.json(req.json);
});


// 退出登录
router.post('/common/logout', function (req, res, next) {
  res.json(req.json);
});


// 获取用户
router.get('/common/iam/user/list', function (req, res, next) {
  req.json.data = [
    { value: '1', label: '张三' },
    { value: '2', label: '李四' },
    { value: '3', label: '王五' },
    { value: '4', label: '沈飞' },
    { value: '5', label: '徐峰' },
    { value: '6', label: '陈安' },
  ]
  res.json(req.json);
});


// 获取角色
router.get('/common/iam/role/list', function (req, res, next) {
  req.json.data = [
    { value: '1', label: '管理员' },
    { value: '2', label: '数据管理员' },
    { value: '3', label: '模型用户' },
    { value: '4', label: '超级管理员' },
    { value: '5', label: '普通员工' },
  ]
  res.json(req.json);
});


// 获取部门
router.get('/common/iam/org/list', function (req, res, next) {
  req.json.data = [
    {
      title: '研发管理部',
      value: '1',
      key: '1',
      children: [
        {
          title: '应用开发部',
          value: '1-1',
          key: '1-1',
        },
        {
          title: '系统研发部',
          value: '1-2',
          key: '1-2',
        },
        {
          title: '质量管理部',
          value: '1-3',
          key: '1-3',
        },
      ],
    },
    {
      title: '销售部',
      value: '2',
      key: '2',
      children: [
        {
          title: '山东大区',
          value: '2-1',
          key: '2-1',
        },
        {
          title: '北京大区',
          value: '2-2',
          key: '2-2',
        },
        {
          title: '广东大区',
          value: '2-3',
          key: '2-3',
        },
      ],
    },
  ]
  res.json(req.json);
});


module.exports = router;

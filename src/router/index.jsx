{
  path: '/training',
  name: '训练任务',
  icon: 'experiment',
  routes: [
    {
      path: '/training/list',
      name: '训练列表',
      component: './TrainingList',
    },
    {
      path: '/training/task',
      name: '创建训练',
      component: './TrainingTask',
      hideInMenu: true,
    },
    {
      path: '/training/result/details',
      name: '训练结果',
      component: './TrainingResult/Details',
      hideInMenu: true,
    },
  ],
}, 
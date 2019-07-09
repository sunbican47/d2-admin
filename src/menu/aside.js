// 菜单 侧边栏
export default [
  {
    path: "/index",
    name: "index",
    meta: { title: "运行报表", auth: true },
    icon: "el-icon-s-flag"
  },
  {
    path: "/task",
    name: "task",
    meta: { title: "任务管理", auth: true },
    icon: "el-icon-document"
  },
  {
    path: "/log",
    name: "log",
    meta: { title: "调度日志", auth: true },
    icon: "el-icon-s-operation"
  },
  {
    path: "/executor",
    name: "executor",
    meta: { title: "执行器管理", auth: true },
    icon: "el-icon-s-operation"
  }
  // {
  //   path: "/trainlist",
  //   name: "trainlist",
  //   meta: { title: "线下培训管理1", auth: true },
  //   children: [
  //     {
  //       path: "/trainlist",
  //       name: "trainlist",
  //       meta: { title: "培训列表", auth: true }
  //     },
  //     {
  //       path: "/report",
  //       name: "report",
  //       meta: { title: "报道验证", auth: true }
  //     },
  //     {
  //       path: "/classify",
  //       name: "classify",
  //       meta: { title: "培训分类", auth: true }
  //     },
  //     {
  //       path: "/activity",
  //       name: "activity",
  //       meta: { title: "特惠活动设置", auth: true }
  //     },
  //     {
  //       path: "/reportTemp",
  //       name: "reportTemp",
  //       meta: { title: "报名须知模板", auth: true }
  //     },
  //     {
  //       path: "/certificate",
  //       name: "certificate",
  //       meta: { title: "证书模板", auth: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/goodslist",
  //   name: "goodslist",
  //   meta: { title: "商品管理", auth: true },
  //   children: [
  //     {
  //       path: "/goodslist",
  //       name: "goodslist",
  //       meta: { title: "商品列表", auth: true }
  //     },
  //     {
  //       path: "/goodsclassify",
  //       name: "goodsclassify",
  //       meta: { title: "商品分类", auth: true }
  //     },
  //     {
  //       path: "/goodstemp",
  //       name: "goodstemp",
  //       meta: { title: "规格模板设置", auth: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/orderlist/1",
  //   name: "orderlist",
  //   meta: { title: "订单管理", auth: true },
  //   children: [
  //     {
  //       path: "/orderlist/1",
  //       name: "orderlist",
  //       meta: { title: "培训课程订单", auth: true }
  //     },
  //     {
  //       path: "/orderlist/2",
  //       name: "orderlist",
  //       meta: { title: "在线课程订单", auth: true }
  //     },
  //     {
  //       path: "/orderlist/3",
  //       name: "orderlist",
  //       meta: { title: "商品订单", auth: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/memberlist",
  //   name: "memberlist",
  //   meta: { title: "会员管理", auth: true },
  //   children: [
  //     {
  //       path: "/memberlist",
  //       name: "memberlist",
  //       meta: { title: "会员列表", auth: true }
  //     },
  //     {
  //       path: "/memberlevel",
  //       name: "memberlevel",
  //       meta: { title: "会员等级", auth: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/teacherlist",
  //   name: "teacherlist",
  //   meta: { title: "教师库", auth: true },
  //   children: [
  //     {
  //       path: "/teacherlist",
  //       name: "teacherlist",
  //       meta: { title: "教师列表", auth: true }
  //     }
  //     //{ path: 'teacheroperate',name:'teacheroperate',meta: {title: '教师详情',auth: true}, },
  //   ]
  // },
  // {
  //   path: "/adminlist",
  //   name: "adminlist",
  //   meta: { title: "网站管理", auth: true },
  //   children: [
  //     {
  //       path: "/adminlist",
  //       name: "adminlist",
  //       meta: { title: "管理员列表", auth: true }
  //     },
  //     {
  //       path: "/characterlist",
  //       name: "characterlist",
  //       meta: { title: "角色列表", auth: true }
  //     }
  //   ]
  // }
];

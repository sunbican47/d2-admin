import layoutHeaderAside from "@/layout/header-aside";

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: "/",
    redirect: { name: "index" },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: "index",
        name: "index",
        meta: {
          auth: true,
          title: "运行报表"
        },
        component: _import("system/index")
      },
      {
        path: "task",
        name: "task",
        meta: { auth: true, title: "任务管理" },
        component: _import("taskManager/index")
      },
      {
        path: "log",
        name: "log",
        meta: { auth: true, title: "调度日志" },
        component: _import("dispatchLog/index")
      },
      {
        path: "executor",
        name: "executor",
        meta: { auth: true, title: "执行器管理" },
        component: _import("executorManager/index")
      },
      // 系统 前端日志
      {
        path: "errorlog",
        name: "errorlog",
        meta: {
          title: "前端日志",
          auth: true
        },
        component: _import("system/log")
      },
      // 刷新页面 必须保留
      {
        path: "refresh",
        name: "refresh",
        hidden: true,
        component: _import("system/function/refresh")
      }
    ]
  }
];

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: "/login",
    name: "login",
    component: _import("system/login")
  }
];

/**
 * 错误页面
 */
const errorPage = [
  {
    path: "*",
    name: "404",
    component: _import("system/error/404")
  }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [...frameIn, ...frameOut, ...errorPage];

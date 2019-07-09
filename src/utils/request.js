import axios from "axios";
// import { Server } from "net";

// 返回数据中状态码 key 值
// const STATUS_CODE_KEY = 'rtCode'
// // 错误信息 key 值
// const ERROR_MESSAGE_KEY = 'errorMsg'
// // 成功状态码
// const STATUS_OK = 1
axios.defaults.withCredentials = true;
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 15000 // 超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 请前发送的处理
    //config.headers['auth'] =

    // 请前发送的处理
    console.warn(config);
    return config;
  },
  error => {
    // 请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 根据状态判断请求是否成功

    // if(res[STATUS_CODE_KEY] === "400"){
    //   Message({message: res[ERROR_MESSAGE_KEY] , type: 'erro'});
    //   // return res
    // }else if (res[STATUS_CODE_KEY] !== "200") {
    //   return Promise.reject(new Error(res[ERROR_MESSAGE_KEY]))
    // }
    // else {
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;

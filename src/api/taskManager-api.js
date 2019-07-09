import request from "@/utils/request.js";
import Qs from "qs";
// 执行
export function trigger(data) {
  return request({
    url: "/api/taskManager/trigger",
    method: "post",
    transformRequest: [
      function(data) {
        data = Qs.stringify(data);
        return data;
      }
    ],
    data: data
  });
}
// 开启
export function start(data) {
  return request({
    url: "/api/taskManager/start",
    method: "post",
    transformRequest: [
      function(data) {
        data = Qs.stringify(data);
        return data;
      }
    ],
    data: data
  });
}
// 停止
export function stop(data) {
  return request({
    url: "/api/taskManager/stop",
    method: "post",
    transformRequest: [
      function(data) {
        data = Qs.stringify(data);
        return data;
      }
    ],
    data: data
  });
}
// 新增实体
export function created(data) {
  return request({
    url: "/api/taskManager/created",
    method: "post",
    data: data
  });
}
// 删除，格式：['1', '2']
export function deleteByIds(data) {
  return request({
    url: "/api/taskManager/deleteByIds",
    method: "post",
    data: data
  });
}
// 分页查询
export function paged(data) {
  return request({
    url: "/api/taskManager/paged",
    method: "get",
    params: data
  });
}

// 修改
export function updated(data) {
  return request({
    url: "/api/taskManager/updated",
    method: "post",
    data: data
  });
}

import request from "@/utils/request.js";
import Qs from "qs";
// 日志清理
export function clearLog(data) {
  return request({
    url: "/api/dispatchLog/clearLog",
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
    url: "/api/dispatchLog/created",
    method: "post",
    data: data
  });
}
// 删除，格式：['1', '2']
export function deleteByIds(data) {
  return request({
    url: "/api/dispatchLog/deleteByIds",
    method: "post",
    data: data
  });
}

// 分页查询
export function paged(data) {
  console.warn(data);
  return request({
    url: "/api/dispatchLog/paged",
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

// 修改
export function updated(data) {
  return request({
    url: "/api/dispatchLog/updated",
    method: "post",
    data: data
  });
}

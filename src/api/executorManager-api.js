import request from "@/utils/request.js";
// 新增实体
export function created(data) {
  return request({
    url: "/api/xxlJobQrtzTriggerGroup/created",
    method: "post",
    data: data
  });
}
// 删除，格式：['1', '2']
export function deleteByIds(data) {
  return request({
    url: "/api/xxlJobQrtzTriggerGroup/deleteByIds",
    method: "post",
    data: data
  });
}

// 分页查询
export function paged(data) {
  return request({
    url: "/api/xxlJobQrtzTriggerGroup/paged",
    method: "get",
    params: data
  });
}
// 查询所有
export function searchAll() {
  return request({
    url: "/api/xxlJobQrtzTriggerGroup/searchAll",
    method: "get"
  });
}

// 修改
export function updated(data) {
  return request({
    url: "/api/xxlJobQrtzTriggerGroup/updated",
    method: "post",
    data: data
  });
}

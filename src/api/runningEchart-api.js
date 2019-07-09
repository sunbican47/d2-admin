import request from "@/utils/request.js";
import Qs from "qs";
// 任务计数
export function taskCount() {
  return request({
    url: "/api/runningEchart/taskCount",
    // url:"/api/sys-user/count",
    method: "get"
  });
}
// 图表信息
export function chartInfo(data) {
  return request({
    url: "/api/runningEchart/chartInfo",
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

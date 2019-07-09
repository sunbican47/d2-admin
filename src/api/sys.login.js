import request from "@/plugin/axios";

export function AccountLogin(data) {
  return request({
    url: "/admin/login/handle",
    method: "post",
    data: data
  });
  // return new Promise((resolve)=>{
  //   resolve({})
  // })
}

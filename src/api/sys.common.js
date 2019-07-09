import request from '@/plugin/axios'

import {getDataString} from './tool'

export function GetList (data) {
  let dataString = getDataString(data.listData);
  return request({
    url:data.url+dataString,
    method: 'get'
  })
}

export function GetList_by_post (data) {
  return request({
    url:data.url,
    method: 'post',
    data:data.listData
  })
}

export function GetData (data,url) {
  let dataString = getDataString(data);
  return request({
    url:url+dataString,
    method: 'get'
  })
}

export function DeleteItem(data,url){
  return request({
    url:url,
    method: 'post',
    data
  })
}

export function FormSubmit(data,url){
  return request({
    url:url,
    method: 'post',
    data
  })
}

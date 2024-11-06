import request from '@/utils/request'

/**
 * 获取记录列表
 * @param {*} id 
 * @returns 
 */
export function getCache(id) {
  return request({
    url: '/medicalRecord/record/'+id,
    method: 'get'
  })
}

/**
 * 查询用户病历列表
 * @param {*} userID 
 * @returns 
 */
export function listCacheName(userID) {
  return request({
    url: '/medicalRecord/record/getList/'+userID,
    method: 'get'
  })
}

/**
 * 查询病历详情
 * @param {*} recordName 记录名
 * @returns 
 */
export function recordDetail(recordName) {
  return request({
    url: '/medicalRecord/record/recordDetail/' + recordName,
    method: 'get'
  })
}

/**
 * 添加记录
 * @param {*} data 
 * @returns 
 */
export function recordAdd(data) {
  return request({
    url: '/medicalRecord/record/recordDetail',
    method: 'post',
    data: data
  })
}
import request from '@/utils/request'

// 查询患者信息详细
export function getCache() {
  return request({
    url: '/medicalRecord/patient',
    method: 'get'
  })
}

/**
 * 查询挂号患者列表
 * @returns 
 */
export function listPatient() {
  return request({
    url: '/medicalRecord/patient/getList',
    method: 'get'
  })
}

/**
 * 查询患者
 * @param {*} cacheName 
 * @returns 
 */
export function listCacheKey(cacheName) {
  return request({
    url: '/medicalRecord/patient/getKeys/' + cacheName,
    method: 'get'
  })
}
import request from '@/utils/request'

// 查询医生信息
export function getDoctorInfo() {
  return request({
    url: '/medicalRecord/doctor',
    method: 'get'
  })
}

// 查询医生列表
export function listDoctor() {
  return request({
    url: '/medicalRecord/doctor/getNames',
    method: 'get'
  })
}

// 查询工作报告
export function listDoctorReport(cacheName) {
  return request({
    url: '/medicalRecord/doctor/getKeys/' + cacheName,
    method: 'get'
  })
}
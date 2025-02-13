// 创建、生成表单相关的方法
import request from '@/utils/request'


/**
 * 获取卫生信息元数据类别
 * @param {*} data 
 * @returns 
 */
export function getHospitalMetadataCategoryApi(query) {
  return request({
    url: `/emrManage/Metadata/category`,
    method: 'get',
    params: query
  })
}
/**
 * 获取feildList
 * @param {category?: string, categoryCode?: string} query 
 * @returns 
 */
export function getFieldListApi(query) {
  return request({
    url: `/emrManage/Metadata/fieldList`,
    method: 'get',
    params: query
  })
}

/**
 * 获取patient基础信息元数据
 * @param {*} query 
 * @returns 
 */
export function getEntitiesMetaDataApi(query) {
  return request({
    url: `/emrManage/Metadata/patientInfoField`,
    method: 'get',
    params: query
  })
}
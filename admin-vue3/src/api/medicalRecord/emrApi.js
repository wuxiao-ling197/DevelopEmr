// 获取和保存病历，模板，病人相关的方法
import request from '@/utils/request'

/******************病历相关api********************/
/**
 * 查询病历列表
 * @param {*} query 
 * @returns 
 */
export function getMedicalRecordListApi(query) {
  return request({
    url: '/emrManage/medicalRecord/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询当前病人历史病历
 * @param {*} id 
 * @returns 
 */
export function getPatientMRApi(id) {
  return request({
    url: `/emrManage/medicalRecord/${id}`,
    method: 'get',
  })
}

/**
 * 根据jobID或者payload等其他条件查询病历
 * @param {jobID?:string,payloadID?:string,page?:number,size?:number} query 
 * @returns 
 */
export function selectMedicalRecordApi(query) {
  return request({
    url: '/emrManage/medicalRecord/select',
    method: 'get',
    params: query
  })
}
/**
 * 新增病历
 * @param {*} id 
 * @returns 
 */
export function addMedicalRecordApi(data) {
  return request({
    url: `/emrManage/medicalRecord`,
    method: 'post',
    data
  })
}

/**
 * 调用发号器获取ID
 * @param {*} query 
 * @returns 
 */
export function generateIDApi(query) {
  return request({
    url: '/emrManage/MedicalRecord/generateID',
    method: 'get',
    params: query
  })
}

/******************模板相关api********************/
/**
 * 获取记录模板
 * @param {*} query 
 * @returns 
 */
export function getEMRModulesListApi(query) {
  return request({
    url: '/emrManage/EMRModules/findTemplate',
    method: 'get',
    params: query
  })
}
/**
 * 创建模板，可能编辑（update）模板也是执行的这一条
 * @param {*} data 
 * @returns 
 */
export function createTemplateApi(data) {
  return request({
    url: '/emrManage/EMRModules/createTemplate',
    method: 'post',
    data
  })
}
/**
 * 通过id查找模板
 * @param {*} id 
 * @returns 
 */
export function selectTemplateApi(query) {
  return request({
    url: '/emrManage/EMRModules/selectTemplate',
    method: 'get',
    params: query
  })
}


/******************病人相关api********************/
/**
 * 获取所有已签到病人列表
 * @param {*} query 
 * @returns 
 */
export function getPatientListApi(query) {
  return request({
    url: `/emrManage/patient/list`,
    method: 'get',
    params: query
  })
}

/**
 * 获取本诊室排队病人列表
 * @param {*} query 
 * @returns 
 */
export function getRoomCallListApi(roomID) {
  console.log(roomID);

  return request({
    url: `/emrManage/patient/roomCallList`,
    method: 'get',
    params: { roomID }
  })
}


/**
 * 叫号
 * @param {*} data 应该是要叫号的number
 * @returns 
 */
export function callPatientNumberApi(data) {
  return request({
    url: '/emrManage/patient/callNumber',
    method: 'post',
    data
  })
}

/**
 * 修改患者排队状态
 * 感觉和叫号是同一个方法接口
 */
export function updatePatientQueueStateApi(data) {
  return request({
    url: '/emrManage/patient/updateState',
    method: 'post',
    data
  })
}

/******************建档挂号签到相关api********************/
/**
 * 获取信息档案列表（分页）
 * @param {*} query 
 * @returns 
 */
export function getDocumentListApi(query) {
  return request({
    url: `/emrManage/regisCheck/documentList`,
    method: 'get',
    params: query
  })
}
// 获取所有档案（用于虚拟列表）
export function getAllDocumentListApi() {
  return request({
    url: `/emrManage/regisCheck/allDocumentList`,
    method: 'get'
  })
}

/**
 * 获取挂号信息列表
 * @param {*} query 
 * @returns 
 */
export function getRegisterListApi(query) {
  return request({
    url: `/emrManage/regisCheck/registerList`,
    method: 'get',
    params: query
  })
}

/**
 * 条件查询档案
 * @param {*} query 
 * @returns 
 */
export function selectDocumentApi(query) {
  return request({
    url: `/emrManage/regisCheck/documentSelect`,
    method: 'get',
    params: query
  })
}

/**
 * 条件查询挂号数据
 * @param {*} query 
 * @returns 
 */
export function selectRegisterListApi(query) {
  return request({
    url: `/emrManage/regisCheck/registerSelect`,
    method: 'get',
    params: query
  })
}

/**
 * 患者挂号
 * @param {*} data 
 * @returns 
 */
export function registerApi(data) {
  return request({
    url: `/emrManage/regisCheck/patientRegister`,
    method: 'post',
    data
  })
}

/**
 * 用户信息建档
 * @param {*} data 
 * @returns 
 */
export function createDocumentApi(data) {
  return request({
    url: `/emrManage/regisCheck/createDocument`,
    method: 'post',
    data
  })
}


/**
 * 用户签到
 * @param {*} data 
 * @returns 
 */
export function chickInApi(data) {
  return request({
    url: `/emrManage/regisCheck/patientCheckIn`,
    method: 'post',
    data
  })
}






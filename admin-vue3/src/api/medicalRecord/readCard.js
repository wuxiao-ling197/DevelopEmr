// 获取读卡器的读到的信息
import request from '@/utils/request'
import { ElNotification, ElMessage } from 'element-plus'

// 重新封装axios，无需修改处理配置
const service = axios.create({
  baseURL: 'http://localhost:8989/api/ReadMsg',
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.status || 200;
  if (code !== 200) {
    ElNotification.error({ title: res.statusText })
    return Promise.reject('error')
  } else {
    return Promise.resolve(res.data)
  }
}, error => {
  console.log('err' + error)
  let { message } = error;
  if (message == "Network Error") {
    message = "后端接口连接异常";
  }
  ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
  return Promise.reject(error)
})

/******************第三方提供的api********************/
/**
 * 读身份证信息
 * @param {*} query 
 * @returns 
 */
export function readCardApi() {
  return service({
    url: 'http://localhost:8989/api/ReadMsg',
    method: 'get'
  })
}
import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 创建/获取totp
export function createTotp(userId) {
  return request({
    url: '/auth/totp/enable'+ userId,
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

//获取totp认证码
export function getQRcode(data) {
  return request({
    url: '/auth/totp/qrcode',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    // timeout: 20000
  })
}

// 验证totp
export function validateTotp(data) {
  return request({
    url: '/auth/totp/verify',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    // timeout: 20000
  })
}

export function disableTotp(userId) {
  return request({
    url: '/auth/totp/disable'+ userId,
    headers: {
      isToken: false
    },
    method: 'delete',
    data: data,
    // timeout: 20000
  })
}

export function getMoreinfo() {
  return request({
    url: '/moreinfo',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 获取短信验证码,后台路由中只传递了一个tel参数  需要在后端中也添加一个路由否则报错资源不存在（mainController）
export function getsmsCode(data) {
  return request({
    url: '/smscode',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    timeout: 20000
  })
}
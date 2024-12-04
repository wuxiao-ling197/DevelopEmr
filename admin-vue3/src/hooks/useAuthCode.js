import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { reactive } from 'vue'

// 验证码相关信息
const authCodeInfo = reactive({
  loading: false, // 是否加载中
  qrCode: '', // 认证码图片地址
  uuid: '' // 验证码唯一标识
})

// 从cookie中获取登录用户信息
const getUserCookie = (data) => {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  const form = {
    username: username === undefined ? data.username : username,
    password: password === undefined ? data.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
  return form
}

// 在Cookie中的记住用户信息,勾选了需要记住密码设置在 cookie 中设置记住用户名和密码，否则移除
const setUserCookie = (data) => {
  if (data.rememberMe) {
    Cookies.set('username', data.username, { expires: 30 })
    Cookies.set('password', encrypt(data.password), { expires: 30 })
    Cookies.set('rememberMe', data.rememberMe, { expires: 30 })
  } else {
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('rememberMe')
  }
}

export default { getUserCookie, setUserCookie, authCodeInfo }
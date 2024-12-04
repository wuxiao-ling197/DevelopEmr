import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      isValid: false,
      loginuser: '',
      // avatar: '',
      roles: [],
      permissions: []
    }),
    persist: {
      enabled: true, // true 表示开启持久化保存 安装插件npm install pinia-plugin-persist
      strategies: [
        { storage: sessionStorage, paths: ['isValid'] }, // 指定对字段进行持久化保存
      ],
    },
    actions: {
      // 登录 在userStore中定义一个login方法
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        // const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, uuid).then(res => {            
            setToken(res.data.token)
            this.token = res.data.token
            this.loginuser = res.data.loginuser //自定义，为便于totp认证
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            console.log('getInfo res=', res);
            // res的返回结果与后端路由函数getInfo（controllor层）定义的返回结构一致
            const user = res.user
            // const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
            
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.login = user.login
            // this.avatar = avatar;
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 更改totp验证的状态，以便用户无感刷新
      changeTotpState(value) {
        this.isValid = value
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            this.isValid = false
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useUserStore

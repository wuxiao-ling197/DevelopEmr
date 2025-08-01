import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import useUserStore from '@/store/modules/user';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register', '/smscode', '/moreinfo', '/auth/totp/verify', '/auth/totp/qrcode', '/auth/totp/disable/:userId'];

// 全局路由前置守卫 当一个导航被触发时，首先被调用的总是全局前置守卫;
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 判断条件中加入totp认证状态的更新 useUserStore().isValid以确保用户同时获取token和完成totp认证
  if (getToken() && useUserStore().isValid) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token isValid标识totp验证结果*/
    if (to.path === '/login') {
      next({ path: '/' })
    }
    else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        useUserStore().getInfo().then(() => {
          isRelogin.show = false
          usePermissionStore().generateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          useUserStore().logOut().then(() => {
            ElMessage.error(err)
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

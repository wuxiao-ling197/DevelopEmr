import request from '@/utils/request'

/** 创建与odoo ws的连接
 * 注：用户登录之后应该立即调用该接口，否则odoo ws将连接失败 */ 
export function initConnect() {
  return request({
    url: '/live',
    method: 'get'
  })
}

// ws连接加入频道
export function joinChannel(Id) {
  return request({
    url: '/live/channel/' + Id,
    method: 'get'
  })
}

// 获取用户详细信息频道
export function getChannel(query) {
  return request({
    url: '/live/channel/list',
    method: 'get',
    params: query
  })
}

// 发布消息 弃用：ws连接成功后直接ws.send即可实现
// export function sendMsg(data) {
//   return request({
//     url: '/livechat/channel/message/post',
//     method: 'post',
//     data: data
//   })
// }

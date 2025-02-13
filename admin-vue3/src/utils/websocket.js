// 集成websocket相关方法
// 集成goeasy发布消息API
import GoEasy from 'goeasy'

// 创建goeasy实例
const goEasyInstance = GoEasy.getInstance({
    host: "hangzhou.goeasy.io",  // 若是新加坡区域：singapore.goeasy.io
    appkey: "BC-72d0e89161d945c28055ea7142be7616",
    modules: ['pubsub'] // 根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});


/**
 * 发布消息
 * @param {channel:string;message:string} pubObj 发布信息需要传递的管道（当前诊室号）和信息
 */
export function publicMessage(pubObj) {
    var pubsub = goEasyInstance.pubsub
    pubsub.publish({
        channel: pubObj.channel,//替换为您自己的channel
        message: pubObj.message,//替换为您想要发送的消息内容
        onSuccess: function () {
            console.log("消息发布成功：" + pubObj.message);
        },
        onFailed: function (error) {
            console.log("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
        }
    });
}

export default goEasyInstance;
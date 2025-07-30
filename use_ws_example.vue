<template>
  <div class="app-container odoo-websocket-monitor">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Odoo WebSocket 实时监控面板</span>
          <div :class="['status-indicator', connectionStatusClass]"></div>
          <span class="status-text">{{ wsStatus }}</span>
        </div>
      </template>

      <div class="control-panel">
        <el-button @click="connectWebSocket" :disabled="isConnected">连接</el-button>
        <el-button @click="disconnectWebSocket" :disabled="!isConnected">断开</el-button>
      </div>

      <div class="chat-box">
        <p>向频道 (discuss.channel) {{TARGET_CHANNEL_ID}}发送消息:</p>
        <el-input
          type="textarea"
          v-model="sendMes.messageBody"
          style="width: 100%; margin-bottom: 10px"
          :rows="2"
          placeholder="在此输入消息内容..."
        />
        <el-button type="primary" @click="sendMessage" @keyup.enter="sendMessage">发送</el-button>
      </div>

      <el-divider />

      <div class="log-panel">
        <h3>消息日志</h3>
        <div class="messages-container" ref="messagesContainerRef">
          <div
            v-for="(msg, index) in monitoringMessages"
            :key="index"
            :class="['message-item', msg.type]"
          >
            <span class="timestamp">{{ msg.timestamp }}</span>
            <span class="source">[{{ msg.source }}]</span>
            <span class="content">{{ msg.content }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { getChannel, findChannel, sendMsg, initConnect } from "@/api/livechat";
import { getUserProfile } from "@/api/system/user";
import { io, Socket } from "socket.io-client";
interface LogEntry {
  content: string;
  type: "system" | "chat" | "notification" | "info" | "error";
}
interface FormattedMessage extends LogEntry {
  source: string;
  timestamp: string;
}

const channelList = ref([]);
// 当前选中的频道 (核心状态)
const selectedChannel = ref(null);
const query = reactive({
  id: undefined,
  name: undefined,
  uuid: undefined,
  parentChannelId: undefined,
});

const TARGET_CHANNEL_ID = 4;
const ODOO_WS_URL = "wss://odoows.tbird.com/websocket/";
const WS_URL = "wss://odoows.tbird.com";
const WS = ref<Socket | null>(null);
const monitoringMessages = ref<FormattedMessage[]>([]);
const messagesContainerRef = ref<HTMLElement | null>(null);

const userId = ref();
const sendMes = reactive({
  channelId: undefined,
  messageBody: undefined,
  user: undefined,
});
const dataList = () => {
  getChannel(query).then((res) => {
    channelList.value = res.data;
  });
};

const handleQuery = () => {
  console.log("query=", query);
  getChannel(query).then((res) => {
    channelList.value = res.data;
  });
};

// 1. 选择频道的处理函数
const selectChannel = (channel) => {
  console.log("选择了频道:", channel.name);
  selectedChannel.value = channel;
  // 实际场景中，选择频道后应该去获取该频道的聊天记录
  // fetchMessages(channel.id);
};

// 当前聊天对象
const onChatting = () => {};

// 连接后端ws获取odoo监听消息
const socketIOConn = () => {
  console.log('监控当前用户=', userId.value);
  // 前端代码
  const socket = io(WS_URL, {
    path: "/emr/ws",
    transports: ["websocket"],
    withCredentials: false,
    query: { userId: String(userId.value)}
  });

  socket.on("connect", () => {
    console.log("连接成功", socket.connected); // true
    // 订阅频道
    socket.emit("subscribe-channel", { channelId: TARGET_CHANNEL_ID });
    logToUI({
      content: `订阅频道: "${TARGET_CHANNEL_ID}"成功`,
      type: "system",
    });
  });
  WS.value = socket;

  socket.on("disconnect", () => {
    console.log("连接断开", socket.connected); // false
  });

  // 错误处理
  socket.on("connect_error", (error) => {
    console.error("连接错误:", error);
    logToUI({ content: `ws连接发生错误`, type: "system" });
  });

  // 监听odoo消息，由ws网关转发的odoo消息
  socket.on("odoo-message", (data) => {
    // console.log("io收到Odoo消息:", data);
    handleOdooNotification(data);
    logToUI({ content: `监听消息\n)}`, type: "system" });
  });

  // 发送消息到NestJS（可选）
  // socket.emit("post", {
  //   channelId: TARGET_CHANNEL_ID,
  //   messageBody: "Hello Odoo，我是客户端",
  // });
};

// 发送消息
const sendMessage = async () => {
  sendMes.channelId = TARGET_CHANNEL_ID;
  try {
    if (WS.value) {
      WS.value.emit("post", sendMes);
      logToUI({ content: `发布消息: "${sendMes.messageBody}"`, type: "chat" });
    }
  } catch (error) {
    console.error("发送消息失败:", error);
  }
};

const handleOdooNotification = (notifications: any[]) => {
  logToUI({
    content: `收到 ${notifications.length} 条新通知，正在处理...`,
    type: "system",
  });
  notifications.forEach((notification) => {
    const message = notification.message || notification;
    if (message.type && message.payload) {
      if (
        message.type === "discuss.channel.transient_message" ||
        message.type === "discuss.channel/new_message"
      ) {
        logToUI({
          content: `频道1：${message.payload.data.toString()}`,
          type: "chat",
        });
        displayChatMessage(message.payload.data);
      }
      // else {
      //   showSystemNotification(message.payload);
      // }
    }
  });
};
// 解析
const displayChatMessage = (chatMessage: any) => {
  // const author = chatMessage.author_id?.[1] || "未知作者";
  // console.log("解析1：", chatMessage);
  const ms = chatMessage.mail.message;
  // console.log("ms=", ms);
  ms.forEach((d) => {
    // console.log("d=", d);
    const author = d.record_name;
    const bodyText = chatMessage.data?.replace(/<[^>]*>?/gm, "") || "[空消息]";
    logToUI({ content: `频道1：${author} --> ${bodyText}`, type: "chat" });
  });
  if (chatMessage.isArray) {
    chatMessage.forEach((message) => {
      const data = message.mail.message;
      data.forEach((d) => {
        // console.log("解析2：", d);
        const author = d.record_name;
        const bodyText =
          chatMessage.data?.replace(/<[^>]*>?/gm, "") || "[空消息]";
        logToUI({ content: `频道2：${author} --> ${bodyText}`, type: "chat" });
      });
    });
  }
};

const logToUI = (logEntry: LogEntry) => {
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  monitoringMessages.value.push({
    ...logEntry,
    source: logEntry.type.toUpperCase(),
    timestamp,
  });

  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTop =
        messagesContainerRef.value.scrollHeight;
    }
  });
};

onMounted(() => {
//必须要先初始化ws连接
  initConnect().then((res) => {
    console.log("实际使用初始化ws连接，返回结果：", res);
    getUserProfile().then(response =>{
    userId.value = response.data.id;
    sendMes.user = response.data.login;
    socketIOConn();
  })
  });
  dataList();
});
</script>

<style scoped lang="scss">
.odoo-websocket-monitor {
  padding: 20px;

  .card-header {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 10px;
    transition: background-color 0.3s;

    &.connected { background-color: #67c23a; }
    &.disconnected { background-color: #909399; }
    &.connecting { background-color: #e6a23c; }
    &.error { background-color: #f56c6c; }
  }

  .control-panel, .chat-box {
    margin-bottom: 20px;
  }

  .log-panel h3 {
    margin-top: 0;
  }

  .messages-container {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    background-color: #f9fafc;
    font-family: "Courier New", Courier, monospace;
    font-size: 14px;
  }

  .message-item {
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 5px;
    word-break: break-all;

    .timestamp { color: #909399; margin-right: 10px; }
    .source { font-weight: bold; margin-right: 10px; }

    &.system { background-color: #f0f9eb; }
    &.chat { background-color: #ecf5ff; }
    &.notification { background-color: #fdf6ec; }
    &.info { background-color: #f4f4f5; }
    &.error { background-color: #fef0f0; color: #f56c6c; }
  }
}
</style>
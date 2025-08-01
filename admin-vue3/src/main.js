import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
// import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import locale from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

import request from '@/utils/request'
/* 注意：如果你的项目中有使用axios，请用下面一行代码将全局axios复位为你的axios！！ */
window.myAxios = request
console.log(request);

console.log(window.myAxios);


import draggable from "dd-form-draggable"
// import VFormDesigner from '@/assets/draggable/dist/designer.es'
import VForm3 from '@/../lib/vform/designer.umd.js'
import '@/assets/draggable/dist/designer.style.css';

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
import goEasyInstance from '@/utils/websocket'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'


// v-md-editor
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// 预览组件
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

// highlightjs
import hljs from 'highlight.js';

// katex数学公式支持
// import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';// cdn引入katex资源，需要在index.html中引入js和css
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm';
import 'katex/dist/katex.min.css'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme, {
  config: {
    toc: {
      includeLevel: [2, 3],
    },
  },
  Hljs: hljs,
});
VMdEditor.use(createKatexPlugin({
  strict: false,// 设置非严格模式解析公式
  macros: {
    // 自定义宏，输入前面的内容，被替换为后面的内容
    '\\dose': '\\text{剂量}',
    '\\freq': '\\text{频率}',
    '\\conc': '\\text{浓度}'
  }
}))

VMdPreview.use(githubTheme, {
  config: {
    toc: {
      includeLevel: [3, 4],
    },
  },
  Hljs: hljs,
});

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.goeasy = goEasyInstance

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)
app.component('draggable', draggable)

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.use(VForm3);
// app.use(VFormDesigner);
app.component('svg-icon', SvgIcon)
app.use(VMdEditor)
app.use(VMdPreview)
directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

// v-md-editor
app.use(VMdEditor)

app.mount('#app')

// // 建立连接
goEasyInstance.connect({
  onSuccess: function () {  //连接成功
    console.log("GoEasy connect successfully.") //连接成功
  },
  onFailed: function (error) { //连接失败
    console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
  },
  onProgress: function (attempts) { //连接或自动重连中
    console.log("GoEasy is connecting", attempts);
  }
});
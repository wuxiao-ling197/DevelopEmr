<template>
  <div class="app-container">
    <!-- <switch-roles @change="handleRolesChange" /> -->
    <div class='form-des' :key="key" style="margin-top:30px;">
      <v-form-designer :designerConfig="designerConfig"></v-form-designer>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PagePermission',
  components: { },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      designerConfig: {
        languageMenu: false,  //是否显示语言切换菜单
        externalLink: false,  //是否显示GitHub、文档等外部链接
        formTemplates: false,  //是否显示表单模板
        eventCollapse: false,  //是否显示组件事件属性折叠面板
        widgetNameReadonly: false,  //禁止修改组件名称
        clearDesignerButton: true,  //是否显示清空设计器按钮
        previewFormButton: true,  //是否显示预览表单按钮
        importJsonButton: true,  //是否显示导入JSON按钮
        exportJsonButton: true,  //是否显示导出JSON器按钮
        exportCodeButton: true,  //是否显示导出代码按钮
        generateSFCButton: false,  //是否显示生成SFC按钮（SFC单文件组件，感觉开发的时候比较有用，用户操作的时候没啥用，只用JSON即可）
        toolbarMaxWidth: 450,  //设计器工具按钮栏最大宽度（单位像素）
        toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）
        presetCssCode: '',  //设计器预设CSS样式代码（感觉也是开发的时候比较有用，使用的时候没啥用，只需要宽高占位即可）
        resetFormJson: false,  //是否在设计器初始化时将表单内容重置为空
      },
    }
  },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    },
  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
.main-container .form-des {
  margin-left: -210px;
  margin-top: 0px !important;
  ::v-deep .el-header.main-header{
    // v-form的表头，改不了只能隐藏了
    display: none;
  }
  ::v-deep .el-header.toolbar-header{
    // v-form的 右半行工具栏，不能和左半行工具出现在同一行显示，使用定位强制限制在同一行
    position: relative;
    .right-toolbar {
      // float: right;
      position: absolute;
      top: 0;
      right: 0;
      text-align: right;
      width: 350px !important;
      // overflow: hidden;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

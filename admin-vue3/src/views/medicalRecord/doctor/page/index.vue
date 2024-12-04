<template>
  <div class="app-container">
    <div class="form-rend">
      <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
      </v-form-render>
      <el-button type="primary" @click="submitForm">Submit</el-button>
    </div>
  </div>
</template>

<script>
import DoctorBasicInformation from '../json/information01.json'
export default {
  name: 'DoctorPage',
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      /* 注意：formJson是指表单设计器导出的json，此处演示的formJson只是一个空白表单json！！ */ 
      formJson: DoctorBasicInformation,
      // {
      //   "widgetList":[
      //     {
      //       "type":"textarea",
      //       "icon":"textarea-field",
      //       "formItemFlag":true,
      //       "options":{
      //         "name":"textarea60950",
      //         "label":"doctor words",
      //         "labelAlign":"label-left-align",
      //         "rows":3,
      //         "defaultValue":"",
      //         "placeholder":"",
      //         "columnWidth":"200px",
      //         "size":"large",
      //         "labelWidth":null,
      //         "labelHidden":false,
      //         "readonly":false,
      //         "disabled":false,
      //         "hidden":false,
      //         "required":false,
      //         "requiredHint":"",
      //         "validation":"",
      //         "validationHint":"",
      //         "customClass":[],
      //         "labelIconClass":null,
      //         "labelIconPosition":"rear",
      //         "labelTooltip":null,
      //         "minLength":null,
      //         "maxLength":null,
      //         "showWordLimit":false,
      //         "onCreated":"",
      //         "onMounted":"",
      //         "onInput":"",
      //         "onChange":"",
      //         "onFocus":"",
      //         "onBlur":"",
      //         "onValidate":""
      //       },
      //       "id":"textarea60950"
      //     },
      //     {
      //       "type":"number",
      //       "icon":"number-field",
      //       "formItemFlag":true,
      //       "options":{
      //         "name":"number38682",
      //         "label":"number",
      //         "labelAlign":"",
      //         "defaultValue":0,
      //         "placeholder":"",
      //         "columnWidth":"200px",
      //         "size":"",
      //         "labelWidth":null,
      //         "labelHidden":false,
      //         "disabled":false,
      //         "hidden":false,
      //         "required":false,
      //         "requiredHint":"",
      //         "validation":"",
      //         "validationHint":"",
      //         "customClass":"",
      //         "labelIconClass":null,
      //         "labelIconPosition":"rear",
      //         "labelTooltip":null,
      //         "min":-100000000000,
      //         "max":100000000000,
      //         "precision":0,
      //         "step":1,
      //         "controlsPosition":"right",
      //         "onCreated":"",
      //         "onMounted":"",
      //         "onChange":"",
      //         "onFocus":"",
      //         "onBlur":"",
      //         "onValidate":""
      //       },
      //       "id":"number38682"
      //     }
      //   ],
      //   "formConfig":{
      //     "modelName":"formData",
      //     "refName":"vForm",
      //     "rulesName":"rules",
      //     "labelWidth":80,
      //     "labelPosition":"left",
      //     "size":"",
      //     "labelAlign":"label-left-align",
      //     "cssCode":"",
      //     "customClass":"",
      //     "functions":"",
      //     "layoutType":"PC",
      //     "onFormCreated":"",
      //     "onFormMounted":"",
      //     "onFormDataChange":"",
      //     "onFormValidate":""
      //   }
      // },
      // {
      //   "widgetList":[],
      //   "formConfig":{
      //     "labelWidth":80,
      //     "labelPosition":"left",
      //     "size":"",
      //     "labelAlign":"label-left-align",
      //     "cssCode":"",
      //     "customClass":"",
      //     "functions":"",
      //     "layoutType":"PC",
      //     "onFormCreated":"",
      //     "onFormMounted":"",
      //     "onFormDataChange":""
      //   }
      // },
      formData: {},
      optionData: {}
    }
  },
  methods: {
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    },
    submitForm() {
      this.$refs.vFormRef.getFormData().then(formData => {
        // Form Validation OK
        alert( JSON.stringify(formData) )
      }).catch(error => {
        // Form Validation failed
        this.$message.error(error)
      })
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
}
.main-container .form-rend {
    // margin-left: -210px;
}
</style>
<template>
    <div class="app-container">
      <!-- <switch-roles @change="handleRolesChange" /> -->
       <!-- 其实无论编辑还是新增模板，进来都是designer，只有查看才是render。并且disabled，模板没有formData -->
      <div class='form-des' :key="key" style="margin-top:30px;">
        <v-form-render
        aria-disabled="true"
         v-if="isRender && !isMD"
         ref="vfRenderRef" 
         :form-json="formJson" 
         :form-data="formData" 
         :option-data="optionData">
        </v-form-render>
        <v-form-designer
          v-if="!isRender && !isMD"
          :field-list-api="getFieldopt"
          ref="vfDesignerRef"
          :designerConfig="designerConfig"
          :banned-widgets="bannedWidgets">
          <!-- <template #customToolButtons>
            <el-button type="text" @click="saveFormJson">
              <i class="el-icon-finished" />保存
            </el-button>
          </template> -->
        </v-form-designer>

        <!-- md模板，如果是查看的话只能预览 -->
        <v-md-editor 
          v-if="isRender && isMD"
          ref="vmPreviewRef"
          mode="preview"
          v-model="mdTemplate" 
          height="400px"></v-md-editor>
        <!-- 如果是编辑或者新增就是编辑器模式 -->
        <v-md-editor 
          v-if="!isRender && isMD"
          ref="vmEditorRef"
          v-model="mdTemplate" 
          ></v-md-editor>
      </div>
      <el-row :span="24">
        <el-col :span="24">
          <el-button v-if="showSubmitButton" style="width: 100%" @click="submitTemplateEvt">
            保存模板
          </el-button>
        </el-col>
      </el-row>
      

      <!-- 弹窗配置组件 -->
      <!-- <ConfigForm v-if="isShow" ref="templateFormRef" :formConf='templateObj'></ConfigForm> -->
      <MyDialog ref="templateConfigRef" 
        :click_confirm="myDialogConfirmEvt"
        :click_cancel="myDialogCancelEvt">
        <template #content>
          <ConfigForm 
          @update:formConf="formConfUpdate"
           :formConf='templateObj'></ConfigForm>
        </template>
      </MyDialog>
    </div>
  </template>
  
  <script>
    import { createTemplateApi,selectTemplateApi } from '@/api/medicalRecord/emrApi';
    import { getEntitiesMetaDataApi,getHospitalMetadataCategoryApi } from '@/api/medicalRecord/formCreate';
    
    import formJson from '../json/fst.json';
    import newTemplateJson from '../json/newTemp.json'
    import { getToken } from '@/utils/auth'
    import useUserStore from '@/store/modules/user';
    import { nextTick, ref } from 'vue';
    import useMedicalRecordStore from '@/store/modules/medicalRecord';

    // 引入自定义组件
    import ConfigForm from './templateConfig.vue';
    import MyDialog from '@/components/MyDialog'

    export default {
    name: 'BasicInfo',
    components: { ConfigForm, MyDialog },
    setup(){
      const token = 'Bearer ' + getToken();
      let feildCategory = ref('人口学及社会经济学特征');
      const categoryList = [];
      let getFieldopt = ref({
        URL: `http://localhost:8888/dev-api/emrManage/Metadata/fieldList?category=${feildCategory.value}&categoryCode=123`,
        nameKey: 'fieldName',
        labelKey: 'fieldLabel',
        headers: {
          Authorization: token
        }
      })
      const setCategory = (index)=>{
        console.log(index);
        console.log(feildCategory.value);
        feildCategory.value = categoryList[index]
        
        getFieldopt.value = {
          URL: `http://localhost:8888/dev-api/emrManage/Metadata/fieldList?category=${feildCategory.value}`,
          nameKey: 'fieldName',
          labelKey: 'fieldLabel',
          headers: {
            Authorization: token
          }
        }
      }
      const currentUser = JSON.parse(useUserStore().currentUser);
      const currentTemplate = useMedicalRecordStore().currentModule || {};

      const isRender = ref(true)
      const isMD = ref(currentTemplate?.payload?.type === '2')
      const mdTemplate = currentTemplate?.payload?.template || '## isEmpty'
      const tempType = ref(null)
      // 在点击保存或者进入创建编辑页面时弹出框，表单，绑定templateObj
      // 等于上一个页面传递过来的配置
      let templateObj = ref({
        createUID: currentUser.createUid,
        writeUID: currentUser.writeUid,
        name: '模板一',
        business: 'outPatient',
        category: '门诊病历',
        tempType: '表单',
        permission: 'string',
        number: '001',
        active: '1',
        meta: '1',
        payload: null,
        remark: ''
      })
      // 显示配置表格
      const isShow = true
      const templateConfigRef = ref(null);
      // 打开配置弹窗
      function showConfDialogEvt(){
        console.log('showConfDialog'); 
        // 打开模板配置弹窗
        try{
          console.log(templateConfigRef.value);
          templateConfigRef.value.showDialog()
        }catch(err){
          console.log(err);
          throw(err);
        }
      };
      async function getCategory(){
        const res = await getHospitalMetadataCategoryApi()
        if(res.code===200){
          res.data.list.forEach(item=>{
            categoryList.push(item.category)
          })
        }
      };
      return {
        currentUser,
        currentTemplate,
        categoryList,
        getCategory,
        setCategory,
        isRender,
        isMD,
        templateObj,
        isShow,
        templateConfigRef,
        showConfDialogEvt,
        feildCategory,
        getFieldopt,
        tempType
      }
    },
    computed: {
      templateId() {
        return this.$route.query.id;
      }
    },
    watch: {
      '$route'(to, from) {
        console.log('$route changed');
        // 检查新的路由对象中的查询参数是否包含 'id' 并且与之前的不同
        if (to.query.id !== from.query.id) {
          console.log(`from ${from.query.id} change to ${to.query.id}`);
          // 执行重新加载页面方法或其他操作
          this.reloadPage(to.query.id);
          // alert('111')
        }
      }
    },
    data() {
      return {
        formJson,
        newTemplateJson,
        showSubmitButton: true,
      }
    },
    async mounted (){
      // if(!useMedicalRecordStore().currentModule){
      //   // 如果不存在当前模板，直接重定向到基础模板页
      //   router.push({
      //       path: "/emrManage/template/templateConfig",
      //   });
      // }
      
      console.log('this.templateId:',this.templateId);
      
      this.reloadPage(this.templateId)
      console.log(this.templateObj);
      await this.getField()
      await this.getCategory()
      // console.log(this.categoryList);
      this.setCategory(2)
      
    },
    methods: {
      // 获取patientInfo元数据和所有实体的元数据
      async getField(){
        let res = await getEntitiesMetaDataApi()
        console.log(res);
        if(res.code===200){
          let patientInfoFeild = []
          let feildList = []
          res.data.list.forEach(item=>{
            if(item.comment === '病人信息表'){
              patientInfoFeild = item.fields
            }
            feildList.push(item.fields)
          })
          // console.log(patientInfoFeild);
          // console.log(feildList);
        }
      },

      // 判断当前模板类型并赋值
      determineAndAssignmentEvt(template){
        console.log('templatetemplatetemplatetemplate');
        console.log(template);
        
        console.log(this.isMD);
        console.log(this.isRender);

        if(template.payload.type==='1'){
          this.formJson = template.payload.template;
          console.log(this.formJson);
        }else if(template.payload.type==='2'){
          this.mdTemplate = template.payload.template;
          console.log(this.mdTemplate);
        }
      },
      // 新增和编辑模板好像全都是designer
      async reloadPage(id){
        console.log('id-------',id);
        
        if(!id){
          return
        }
        if(id==='add'){
          // 说明是新增
          this.isRender = false;
          this.showSubmitButton = true;
          // 在挂载后获取配置，修改templateObj
          if(this.$route.query.templateObj){
            try{
              this.templateObj = JSON.parse(this.$route.query.templateObj)
              this.tempType = this.$route.query.tempType
            }catch(err){
              console.error(err);
            }
          }
          console.log(this.tempType);
          this.isMD = this.tempType==='1'? false : true
          if(this.tempType==='1'){
            nextTick(()=>{
              // 如果是form编辑器，新增模式先清空画板
              this.$refs.vfDesignerRef.clearDesigner()
            })
          }          
          // this.$refs.vfDesignerRef.setFormJson(this.newTemplateJson)
        }else if(id==='edit'){
          // 说明是编辑
          console.log(this.currentTemplate);
          // this.templateObj = {...this.currentTemplate};
          Object.assign(this.templateObj,this.currentTemplate);
          console.log(this.templateObj);
          this.isRender = false;
          this.showSubmitButton = true;
          this.tempType = this.currentTemplate.payload.type
          this.isMD = this.tempType==='1'? false : true
          // 把当前模板的内容赋值给当前编辑器或者渲染器
          this.determineAndAssignmentEvt(this.currentTemplate)
          if(this.tempType==='1'){
            nextTick(()=>{
              this.$refs.vfDesignerRef.setFormJson(this.formJson)
            })
          }
        }else if(id==='detail'){
          // 查看，不需要设计表单，只需要拿到currentTemplate然后渲染
          console.log('33333333-------');
          this.isRender = true;
          this.showSubmitButton = false;
          console.log(this.currentTemplate);
          this.tempType = this.currentTemplate.payload.type
          this.isMD = this.tempType==='1'? false : true
          // 判断类型并赋值
          this.determineAndAssignmentEvt(this.currentTemplate)
          if(this.tempType==='1'){
            nextTick(async()=>{
              await this.$refs.vfRenderRef.setFormJson(this.formJson)
              // 表单禁用编辑
              this.$refs.vfRenderRef.disableForm()
            })
          }
        }
      },

      // 新增相关的问题
      setDesignerFormJson(){
        this.$refs.vfDesignerRef.serFormJson(this.formJson)
      },
      // 保存表单数据
      // async saveFormJson(){
      //   // 宽度问题导致保存按钮无法正常显示
      //   this.formJson = this.$refs.vfDesignerRef.getFormJson()
      //   console.log(this.formJson);
      //   // 发送请求，保存模板/创建模板
      //   let res = await this.createTemplate(formJson)
      //   if(res.code===200){
      //     this.$message.success('模板已保存')
      //   }else{
      //     this.$message.error('模板保存失败')
      //   }
      // },

      // 发送请求的方法
      async selectTemplate(id){
        return await selectTemplateApi(id)
      },
      async createTemplate(data){
        return await createTemplateApi(data)
      },

      // 监听子组件传递的事件
      formConfUpdate(val){
          console.log(val);
          this.templateObj = val;
      },
      // 提交数据，新增模板
      async submitTemplateEvt(){
        // 可能是form也可能是md
        // 有可能是编辑模板，tempType为this.currentTemplate.payload.type
        // 有可能是新增模板，tempType为this.$route.query.tempType
        this.formJson = this.tempType==='1' ? this.$refs.vfDesignerRef.getFormJson() : this.$refs.vmEditorRef.getValue()
        console.log(this.formJson);
        
        // 打开配置弹窗
        try{
          this.showConfDialogEvt();
          // 处理数据
          // this.templateObj.payload = this.formJson;
          // this.templateObj.name = this.formJson;
          // this.templateObj.payload = this.formJson;
          // this.templateObj.payload = this.formJson;
        }catch(err){
          console.log(err);
          return
        }
      },
      async myDialogConfirmEvt(){
        // 点击确定后拿到templateObj，处理后才调用报错模板方法
        console.log(this.templateObj);
        this.templateObj.payload = {
          template:this.formJson,
          type:this.tempType
        }
        // let abc = {
        //   name: '模板二',//模板名,
        //   business: 'outPatient',//业务类,
        //   category: '门诊病历',//模板大,
        //   permission: 'string',//模板权,
        //   number: '001',//模板编,
        //   active: '1',
        //   meta: '1',
        //   payload: this.formJson
        // };
        // 发送请求，保存模板/创建模板
        let res = await this.createTemplate(this.templateObj)
        if(res.code===200){
          this.$message.success('模板已保存！')
          this.$router.push('/emrManage/template/templateConfig')
        }else{
          this.$message.error('模板保存失败')
        }
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  body {
    margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
  }
  .app-container {
    height: 100%;
    .form-des{
      height: calc(100% - 32px);
      overflow: auto;
      .v-md-editor{
        height: 100%;
      }
      
    }
  }
  .main-container .form-des {
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
        display: flex;
        justify-content: flex-end;
      }
    }
    
    ::v-deep .el-container.full-height {
        margin-left: 0px!important;
      .el-container {
        height: 100%;
        .el-main.form-widget-main .el-scrollbar {
            height: 100%!important;
            .el-scrollbar__wrap,
            .el-scrollbar__view {
              height: 100%;
              .form-widget-container[data-v-28ec7276] {
                height: 100%;
                  .el-form.full-height-width[data-v-28ec7276] {
                    height: 100%;
                  .form-widget-list[data-v-28ec7276] {
                      min-height: 100%;
                      padding: 0px;
                  }
                }
              }
           }
        }
        .el-tabs.el-tabs--top{
          height: 100%;
        }
        .el-tabs__content {
            height: 90%;
            #pane-1{
              height: 100%;
              .el-scrollbar.setting-scrollbar{
                height: 100%!important;
              }
            }
        }
      }
    }
  }
  </style>
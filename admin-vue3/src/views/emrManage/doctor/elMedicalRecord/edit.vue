<template>
    <div class="app-container">
      <el-scrollbar>
        <!-- 选项卡 -->
        <el-empty v-if="isEmpty" :description="message">
            <el-button type="primary" @click="checkPatient">选择病人</el-button>
        </el-empty>
        <el-tabs v-if="!isEmpty"
          v-model="activeName"
          class="demo-tabs">
          <el-tab-pane label="创建记录" name="creatRecord">  
            <!-- 按钮区域 -->
            <el-row>
              <el-col :span="8">
                <div class="grid-content ep-bg-purple">
                  <!-- 进入本页面时hi显示当前病历（本次jobid下已有的基本信息和已有payload概览 -->
                   <!-- 什么时候显示创建病历，什么时候显示添加记录 -->
                  <el-button @click="addMRHeaderEvt" type="primary">
                    添加病历头
                  </el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content ep-bg-purple-light">
                  <el-button type="primary" @click="addparticipantEvt">添加流程</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content ep-bg-purple">
                  <el-button @click="selectTemplate" type="primary" :icon="Edit">选择模板</el-button>
                  <!-- <el-button @click="historyMREvt" type="primary" :icon="Share">历史病历</el-button> -->
                  <!-- <el-button type="primary" :icon="Delete" /> -->
                </div>
              </el-col>
              <el-col :span="24"></el-col>
            </el-row>

            <!-- 病历设计区域 -->
            <div class='form-des' :key="key" style="margin-top:30px;">
              <!-- :field-list-api="getFieldopt" -->
              <v-form-designer 
               v-if="emrType==='1' && !isRender"
               :field-list-api="getFieldopt"
              ref="vfDesignerRef" 
              :global-dsv="globalDsv"
              :designerConfig="designerConfig"
              :banned-widgets="bannedWidgets">
                <!-- <template #customToolButtons>
                  <el-button type="text" @click="saveFormEvt">
                    <i class="el-icon-finished" />保存
                  </el-button>
                </template> -->
              </v-form-designer>
              <v-form-render 
               v-if="emrType==='1' && isRender"
              :form-json="formJson" 
              :form-data="formData" 
              :option-data="optionData" 
              ref="vfRenderRef">
              </v-form-render>

              <!-- md编辑器 -->
              <v-md-editor 
              v-model="markdown" 
              ref="vmEditorRef" 
              v-if="emrType==='2'"
              :autofocus="true"
              :change="mdEditorChangeEvt"
              :blur="mdEditorBlurEvt"
              :save="mdEditorSaveEvt"
              ></v-md-editor>
              <!-- <v-md-editor :model-value="markdown" mode="preview"></v-md-editor> -->
            </div>

            <!-- 尾部保存按钮区域 -->
            <el-row>
              <el-col v-if="!isRender" :span="12">
                <el-button class="mt-4" style="width: 100%" @click="saveFormEvt('temp')">
                    保存为模板
                </el-button>
              </el-col>
              <el-col v-if="!isRender && emrType==='1'" :span="12">
                <el-button class="mt-4" style="width: 100%" @click="switchToFormRender">
                    填写病历
                </el-button>
              </el-col>
              <el-col v-if="isRender || emrType==='2'" :span="isRender? 24 : 12">
                <el-button class="mt-4" style="width: 100%" @click="saveFormEvt('mr')">
                    保存为病历
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
  
      <!-- 选择模板弹窗组件 -->
      <MyDialog ref="selectModuleRef" 
      :formConf="selectModuleConf" 
      width="800" 
      :click_confirm="selectModuleConfirmEvt"
      :click_cancel="selectModuleCancelEvt">
      <template #content>
        <div class="select-template-box">
          <div class="left">
            <el-input
              v-model="filterText"
              style="width: 240px"
              placeholder="Filter keyword"
            />
            <el-tree
              ref="treeRef"
              style="max-width: 600px"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
            />
          </div>
          <div class="right">
            <h1>当前模板</h1>
            <p>text content</p>
            预览模板
          </div>
        </div>
      </template>
      </MyDialog>

      <!-- 保存模板配置弹窗组件 -->
      <!-- <ConfigForm v-if="isShow" ref="templateFormRef" :formConf='templateObj'></ConfigForm> -->
      <MyDialog ref="templateConfigRef"
        width="600" 
        :formConf="templateConfigConf" 
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
  import { Delete, Edit, Search, Share, Upload, } from '@element-plus/icons-vue'
  // 引入我的组件
  import MyDialog from '@/components/MyDialog'
  import ConfigForm from '../../template/baseTemplates/templateConfig.vue';
  import { nextTick, onMounted, ref } from 'vue';
  import usePatientStore from '@/store/modules/patient';
  import useUserStore from '@/store/modules/user';
  
  import medicalRecordData from '../json/information01.json'
  import newMRJSON from '../json/newMR.json'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { addMedicalRecordApi } from '@/api/medicalRecord/emrApi';
  import { getFieldListApi } from '@/api/medicalRecord/formCreate';
  import { getToken } from '@/utils/auth'
  import { useRouter } from 'vue-router';
  import { BusinessEnum } from '@/config/common.cfg';
  import { MRCard } from '@/config/common.cfg';
  import { getPatientMRApi } from '@/api/medicalRecord/emrApi';
  import useMedicalRecordStore from '@/store/modules/medicalRecord';
  import { createTemplateApi } from '@/api/medicalRecord/emrApi';
import { getEMRModulesListApi } from '../../../../api/medicalRecord/emrApi';
  
  export default {
    name: 'MedicalRecord',
    components: { MyDialog,ConfigForm },
    data() {
      return {
        key: 1, // 为了能每次切换权限的时候重新初始化指令
        Delete,
        Edit,
        Search,
        Share,
        Upload,
        ElMessage,
        ElMessageBox,
        isRender:false
      }
    },
    // computed: {
    //   emrType() {
    //     return useMedicalRecordStore().emrType;
    //   }
    // },
    setup(){
      const MRStore = useMedicalRecordStore();
      const emrType = MRStore.emrType;
      const router = useRouter();
      const token = 'Bearer ' + getToken();
      const selectModuleRef = ref(null);
      const vfDesignerRef = ref(null);
      const vfRenderRef = ref(null);
      const vmEditorRef = ref(null);
      const category = '人口学及社会经济学特征';
      const getFieldopt = ref({
        URL: `http://localhost:8888/dev-api/emrManage/Metadata/fieldList?category=${category}`,
        nameKey: 'fieldName',
        labelKey: 'fieldLabel',
        headers: {
          Authorization: token
        }
      })
  
      // 当列表内容为空时显示
      const isEmpty = false
      const message = '当前没有内容...'
      // 一进来的时候就一个查询号病人列表数据，遍历tablist，将data放进去
      const activeName = ref('creatRecord');
      const patientStore = usePatientStore();
      const currentPatient = patientStore.currentPatient;
      const userStore = useUserStore();
      const currentUser = JSON.parse(userStore.currentUser) || null;
      const role = userStore.roles;
  
      const formJson = ref({
        "widgetList":[],
        "formConfig":{
          "labelWidth":80,
          "labelPosition":"left",
          "size":"",
          "labelAlign":"label-left-align",
          "cssCode":"",
          "customClass":"",
          "functions":"",
          "layoutType":"PC",
          "onFormCreated":"",
          "onFormMounted":"",
          "onFormDataChange":""
        }
      });
      const selectModuleConf = ref({
        title: '选择模板'
      })
      const templateConfigConf = ref({
        title: '保存模板配置'
      })
      const formLabelWidth = ref('40px');
      // 历史病历
      const historytMRList = ref(null);
  
      // 在点击保存或者进入创建编辑页面时弹出框，表单，绑定templateObj
      let templateObj = ref({
        createUID: currentUser.createUid,
        writeUID: currentUser.writeUid,
        name: '模板一',
        business: 'outPatient',
        category: '门诊病历',
        permission: 'string',
        number: '001',
        active: '1',
        meta: '1',
        payload: null,
        remark: ''
      })

      const filterText = ref('')
      const treeRef = ref()

      const defaultProps = {
        children: 'children',
        label: 'label',
      }
      watch(filterText, (val) => {
        treeRef.value.filter(val)
      })

      // 获取模板列表数据，根据模板大类处理成树形数据
      const getEMRModulesTree = async()=>{
        let res = await getEMRModulesListApi()
        if(res.code==200){
          console.log(res.data);
          // 这个在前端做还是后端做？选择一下
          const formTemp = res.data.list.filter(item => {
            item.payload.type === '1'
          });
          const mdTemp = res.data.list.filter(item => {
            item.payload.type === '2'
          });
          // 这个应该有一张表或者规定字段（定义枚举），目前不清楚，暂时根据存入的数据筛一下
          const categoryList = []
          res.data.list.forEach(item => {
            // 如果list里没有当前category才push
            if(!categoryList.some(cate => cate === item.category)){
              categoryList.push(item.category)
            }
            // if(categoryList.findIndex(cate => cate === item.category) == -1){
            //   categoryList.push(item.category)
            // }
          });
          // 根据类别，将模板列表拆分成组，改造成tree需要的数据格式[{cate,children:[]},{cate,children:[]},{}]
          let treeData = []
          categoryList.forEach(cate=>{
            treeData.push({label:cate,children:[]})
            
          })
          treeData.forEach(td=>{
            res.data.list.forEach(md => {
              if(td.label==md.category){
                md.label = md.name
                td.children.push(md)
              }
            })
          })
          return treeData
        }
      }

      const treeData = ref([
        {
          id: 1,
          label: 'Level one 1',
          children: [
            {
              id: 4,
              label: 'Level two 1-1',
              children: [
                {
                  id: 10,
                  label: 'Level three 1-1-2',
                },
              ],
            },
          ],
        },
      ])
      const filterNode = (value, data) => {
        if (!value) return true
        return data.label.includes(value)
      }

      const clearDesigner = ()=>{
        console.log(vfDesignerRef.value);
        console.log(vmEditorRef.value);
        if(vfDesignerRef.value){
          // 初始化时清空画布
          vfDesignerRef.value.clearDesigner()
        }
      }
  
      // 发送请求，初始化数据
      const gethistorytMRList = async(id)=>{
        const res = await getPatientMRApi(id)
        if(res.code === 200){
          console.log(res);
          // 病人历史病历
          historytMRList.value = res.data.list
        }
      }
      onMounted(async ()=>{
        // 先判断有无当前病人，有就继续，获取当前病人的病历，没有就返回，（是显示提升和空白页面还是重定向到病人一栏那里或者打开选择病人选框）
        checkCurrentPatient();
        gethistorytMRList(currentPatient.patientID);
        // let res = await userStore.getInfo()
        // console.log(res);
        // if(res.code == 200){
        //   currentUser = res.user
        // }
        // 清空画布
        clearDesigner()
        // 判断有无当前用户和患者
        if(currentUser){
          console.log(currentUser.id);
          console.log(role);
          console.log('currentPatient:');
          console.log(currentPatient);
        }
        // 获取feildList
        console.log('field-----------');
        const res = await getFieldListApi({category: '人口学及社会经济学特征'});
        console.log(res);

        treeData.value = await getEMRModulesTree()
        console.log(treeData.value);
        
      });
  
      // 判断有无当前患者
      const checkCurrentPatient = ()=>{
        if(!currentPatient){
          ElMessageBox.alert('请选择就诊患者', 'Title', {
              // if you want to disable its autofocus
              // autofocus: false,
              confirmButtonText: 'OK',
              callback: (action) => {
              ElMessage({
                  type: 'info',
                  message: `action: ${action}`,
              })
              },
          })
          return;
        }
      }
  
      // 添加病历头
      const addMRHeaderEvt = ()=>{
        console.log('add new MR');
        // 当前有患者，拿到患者基础信息
        // 打开用户信息弹窗
        // appendRecordModule('header')
        // setheader
        setMRHeader()
      }
  
      // 选择模板
      function selectTemplate(){
        // 模板应该根据医生的科室，业务类型等，默认不同的记录模板
        // 默认情况选择MRCard
        let newMD = MRCard
        // 手动情况弹窗，选择模板
        console.log(selectModuleRef.value);
        if (selectModuleRef.value){
          selectModuleRef.value.showDialog()
        }else{
          console.error('selectModuleRef is not yet mounted or does not exist');  
        }
        return newMD;
      }
      // 添加记录（payload）
      function appendRecordModule(name){
        // 添加模板
        alert('appendRecordModule')
        // console.log(vfDesignerRef.value[0]);
        // 1.拿到当前记录文本内容
        let records = [];
        let currentRef = null;
        if(emrType==='1'){
          // form
          console.log(vfDesignerRef.value);
          currentRef = vfDesignerRef.value
          records = currentRef.getFormJson()
          console.log(records);
          // 这里添加的应该是病历记录模板（）
          // 添加住院记录，医嘱，诊断，业务
          
          // 2.选择要使用的模板
          const mrCard = selectTemplate()
          console.log(mrCard);
          // 3.在当前文本的基础上添加（append）记录
          records.widgetList.push(mrCard)
          console.log(records);
          // vfDesignerRef.value[0].setFormJson(records)
          currentRef.setFormJson(records)
        }else if(emrType==='2'){
          // md
          console.log(vmEditorRef.value);
          currentRef = vmEditorRef.value
          // 拿到md记录文本
          // todo
          records = currentRef.text
          let records1 = currentRef.getValue()
          console.log(records);
          console.log(records1);

          // 2.选择要使用的模板
          const mrCard = selectTemplate()
          console.log(mrCard);
          // 3.在当前文本的基础上添加（append）记录
          // records.widgetList.push(mrCard)
          // console.log(records);
          // vfDesignerRef.value[0].setFormJson(records)
          // currentRef.setFormJson(records)
        }
      }
      
      // 设置病历表头（调用基本信息模板）
      function setMRHeader(){
        // 调用基本信息模板
        alert('setMrHeader')
        if(emrType==='1'){
          console.log(vfDesignerRef.value);
          vfDesignerRef.value.setFormJson(newMRJSON)
        }
        if(emrType==='2'){
          console.log(vmEditorRef.value);
          let text = vmEditorRef.value.getValue()
          console.log(text);
          
        }
      }
      
      // 传给弹窗组件执行的事件
      const selectModuleConfirmEvt = ()=>{
        console.log('确认选择');
        ElMessage({
            type: 'info',
            message: `模板已添加`,
        })
        // setMRHeader()
        appendRecordModule()
      }
      
      // 添加流程按钮事件（参与者）
      const addparticipantEvt = ()=>{
        alert('add participants!')
        appendProcess()
      }
      // 添加流程实现
      function appendProcess(){
        // 弹窗或者跳转        
        router.push('/emrManage/doctor/emrProcessManagement')
      }
  
      const selectModuleCancelEvt = ()=>{
        console.log('当前用户信息有误');
      }
  
      // 点击确定的事件，传给弹窗组件执行的
      const confirmEvt = ()=>{
        console.log('before confirm and close my dialog, you can did this...');
      }
      const cancelEvt = ()=>{
        console.log('before cancel, did this...');
      }
      const updateFormData = (key,value)=>{
        formData.value[key] = value
      }

      // markdown编辑器相关
      const markdown = ''
      function mdEditorChangeEvt(text,html){
        console.log(text);
        console.log(html);
      }

      function mdEditorBlurEvt(event){
        console.log(event);
        
      }

      function mdEditorSaveEvt(text,html){
        console.log(text);
        console.log(html);
        
        
      }
      return {
        filterText,
        treeRef,
        defaultProps,
        treeData,
        filterNode,
        templateObj,
        MRStore,
        emrType,
        router,
        category,
        getFieldopt,
        selectModuleRef,
        historytMRList,
        selectModuleCancelEvt,
        selectModuleConfirmEvt,
        formJson,
        selectModuleConf,
        templateConfigConf,
        vfDesignerRef,
        vfRenderRef,
        vmEditorRef,
        message,
        isEmpty,
        activeName,
        formLabelWidth,
        updateFormData,
        addMRHeaderEvt,
        addparticipantEvt,
        confirmEvt,
        cancelEvt,
        selectTemplate,
        currentUser,
        currentPatient,
        role,
        markdown,
        mdEditorChangeEvt,
        mdEditorBlurEvt,
        mdEditorSaveEvt,
      }
    },
    
    // watch(){
    //   this.isRender(new,old){

    //   }
    // },
    methods:{
      // 通过js给设计器设置（或者改变）FeildList
      // setFeildList(){
      //     this.getFieldopt = {
      //       URL: `emrManage/Metadata/fieldList?category=${category}`,
      //       nameKey: 'fieldName',
      //       labelKey: 'fieldLabel',
      //       headers: {
      //         //后端需要token请设置请求头对象，后端如不需要可不设置
      //       }
      //     }
      // },
      // 切换为form render页面，填写病历
      
      switchToFormRender(){
        this.formJson = this.$refs.vfDesignerRef.getFormJson()
        this.isRender = true;
        // 填写后点击保存，调用保存病历请求
        // 保存后跳转病历记录页面
        // this.saveMRFormJson()
      },
      // 发送请求，保存病历
      async saveMRFormJson(form){
        let res = await addMedicalRecordApi(form);
        console.log(res);
        if(res.code === 200){
          ElMessage.success('记录已保存！')
          // 跳转到病历记录
          this.router.push('/emrManage/doctor/elMedicalRecord')
        }
      },
      // 发送请求，保存模板
      async saveTemplate(form){
        let res = await createTemplateApi(form);
        if(res.code===200){
          this.$message.success('模板已保存！')
          // 切换为填写病历（vformRender）
          // 要做判断，如果是Form类型的话
          if(this.emrType==='1') this.switchToFormRender()
        }else{
          this.$message.error('模板保存失败')
        }
      },
      // 保存表单的json对象（保存为模板或者病历记录）
      async saveFormEvt(type){
        let formData = [];
        try{ 
          // 先拿到文档内容，存入formJson
          if(this.emrType==='1' && this.isRender!=true){
            this.formJson = this.$refs.vfDesignerRef.getFormJson()
          }else if(this.emrType==='1' && this.isRender==true){
            console.log(this.$refs.vfRenderRef);
            console.log(this.$refs.vfRenderRef.getFormData());
            formData = await this.$refs.vfRenderRef.getFormData()
            console.log(formData);
            
          }else if(this.emrType==='2'){
            this.formJson = this.$refs.vmEditorRef.getValue()
          }

          if(type==='mr'){
            //TODO: 将formJson提交给后端保存接口，需自行实现！！
            console.log(this.formJson);
            const header = {
              status: '1',// status (payload状态，发布状态:1/草稿状态:2) 
              project: 'string',// project (项目编号；区分payload类型) 
              patient: this.currentPatient.patientID,// patient (病人unique) 
              // jobId: 'string',// jobId (病人job_id) 
              // id: string,// id：(payload文档id) 
              business: BusinessEnum.OUTPATIENT,
            }
            const participants = {
              participantID: this.currentUser.id,
              role: this.role,
              checkInPlace: '地点',
              checkInTime: '时间',
              priority: '001',
            }
            const payload = {
              type:this.emrType,
              template:this.formJson,
              formData
            }
            // 处理病历对象，用于存入病历表
            const MRObj = {
              payload: JSON.stringify(payload),
              participants: JSON.stringify(participants),
              meta: '01',
              payloadID: '01',
              // patientID: '654321',
              patientID: this.currentPatient.patientID,
              jobID: '01',
              header: JSON.stringify(header),
              active: '1',
              writeUID: this.currentUser.id,
              createUID: this.currentUser.id
            };
            console.log(MRObj);
            console.log(formData);
            
            this.saveMRFormJson(MRObj);
          }else if(type==='temp'){
            // this.formJson = this.$refs.vfDesignerRef.getFormJson()
            // formJson已经拿到，form就是formJson，md目前就是所有文本
            console.log(this.formJson);
            // 打开配置弹窗
            try{
              this.showConfDialogEvt();
              // 处理数据
            }catch(err){
              console.log(err);
              return
            }
            // let tempObj = {}
            // this.saveTemplate(tempObj)
          }
        }catch(err){
          console.log(err);
          
        }
      },
      // 打开配置弹窗
      showConfDialogEvt(){
        console.log('showConfDialog'); 
        // 打开模板配置弹窗
        try{
          console.log(this.$refs.templateConfigRef);
          this.$refs.templateConfigRef.showDialog()
        }catch(err){
          console.log(err);
          throw(err);
        }
      },
      // 监听子组件传递的事件
      formConfUpdate(val){
        console.log(val);
        this.templateObj = val;
      },
      async myDialogConfirmEvt(){
        // 点击确定后拿到templateObj，处理后才调用报错模板方法
        console.log(this.templateObj);
        this.templateObj.payload = {
          template:this.formJson,
          type:this.emrType
        }
        // 发送请求，保存模板/创建模板
        await this.saveTemplate(this.templateObj)
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .app-container {
    .form-des {
      margin-top: 0px !important;
      // height: calc(100vh - 242px);
      // overflow-y: scroll;
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
      ::v-deep>.main-container>.el-container{
        box-sizing: border-box;
        &>:nth-child(-n+3){
          flex: 1;
          // flex-shrink: 0;
        }
      }
      ::v-deep .el-container.full-height[data-v-07628d6c] {
          margin-left: 0px!important;
      }
      .v-md-editor {
        height: 100%;
      }
    }
    
    .select-template-box{
      display: flex;
      .left{
        width: 30%;
        .el-input{
          width: 100%!important;
        }
      }
      .right{
        width: 70%;
        box-shadow: inset 2px 2px 3px #eee;
        padding: 10px 20px;
        overflow-y: auto;
      }
    }
  }
  </style>  
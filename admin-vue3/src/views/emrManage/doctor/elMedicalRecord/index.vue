<template>
  <div class="app-container">
    <el-scrollbar>
      <!-- 选项卡 -->
      <el-empty v-if="isEmpty" :description="message">
          <el-button type="primary" @click="checkPatient">选择病人</el-button>
      </el-empty>
      <el-tabs v-if="!isEmpty"
        v-model="activeName"
        class="demo-tabs"
        @tab-click="tabClick"
        @tab-change="tabChange">
        <el-tab-pane v-for="lab in tabList" :key="lab.key" :label="lab.label" :name="lab.name">
          <!-- 按钮区域 -->
          <el-row v-if="lab.name==='createMR'">
            <el-col :span="8">
              <div class="grid-content ep-bg-purple">
                <!-- 进入本页面时hi显示当前病历（本次jobid下已有的基本信息和已有payload概览 -->
                 <!-- 什么时候显示创建病历，什么时候显示添加记录 -->
                <el-button @click="createMedicalRecordEvt('1')" type="primary">
                  创建表单病历
                </el-button>
                <el-button @click="createMedicalRecordEvt('2')" type="primary">
                  创建markdown病历
                </el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content ep-bg-purple-light">
                <!-- 为记录添加流程也不该在这里，应该在病历的edit页面 -->
                <!-- <el-button type="primary" @click="addparticipantEvt">添加流程</el-button> -->
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content ep-bg-purple">
                <!-- <el-button @click="editMedicalRecordEvt('edit')" type="primary" :icon="Edit">编辑病历</el-button> -->
                <el-button @click="historyMREvt" type="primary" :icon="Share">历史病历</el-button>
                <el-button type="primary" :icon="Delete" />
              </div>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>

          <!-- 当前病历记录（本次jobID的)展示区域 -->
          <!-- 其实就是预览历史病历or本次记录的区域 -->
          <div v-if="lab.name==='createMR'" class="records-list" style="margin-top:30px;">
            <!-- elementPlus的tabs组件 -->
            <el-tabs :stretch="true" tab-position="left" style="height: 200px" class="demo-tabs">
              <el-tab-pane v-for="(mr,index) in patientMR" :key="mr.id" :label="`当前记录${index}`">
                <v-md-editor 
                v-if="mr.payload.type=='2'" 
                mode="preview"
                v-model="mr.payload.template" 
                height="400px"></v-md-editor>
                <v-form-render 
                 v-else
                :form-json="mr.payload.template || defaultFormJson" 
                :form-data="mr.payload.formData"
                @formChange="formChangeEvt" 
                :option-data="optionData"
                disableForm
                ref="vFormRanderRef">
                </v-form-render>

              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>

    <!-- 我的弹窗组件 -->
    <MyDialog ref="MyDialogRef" 
    :formConf="formConf" 
    :formJson="formJson" 
    :click_cancel="cancelEvt" 
    :click_confirm="confirmEvt"></MyDialog>
  </div>
</template>

<script>
import { Delete, Edit, Search, Share, Upload, } from '@element-plus/icons-vue'
// 引入我的组件
import MyDialog from '@/components/MyDialog'
import { onMounted, ref } from 'vue';
import usePatientStore from '@/store/modules/patient';
// import useUserStore from '@/store/modules/user';

import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken } from '@/utils/auth'
import { useRouter } from 'vue-router';
import { getPatientMRApi } from '@/api/medicalRecord/emrApi';
import useMedicalRecordStore from '@/store/modules/medicalRecord';

export default {
  name: 'MedicalRecord',
  components: { MyDialog },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      Delete,
      Edit,
      Search,
      Share,
      Upload,
      ElMessage,
      ElMessageBox
    }
  },
  setup(){
    const MRStore = useMedicalRecordStore();
    const router = useRouter();
    const token = 'Bearer ' + getToken();
    const MyDialogRef = ref(null);
    const patientInfoRef = ref(null);
    const vFormRanderRef = ref(null);
    const category = '人口学及社会经济学特征';
    const getFieldopt = ref({
      URL: `http://localhost:8888/dev-api/emrManage/Metadata/fieldList?category=${category}`,
      nameKey: 'fieldName',
      labelKey: 'fieldLabel',
      headers: {
        Authorization: token
      }
    })
    // 当前记录
    let patientMR = ref([]);

    // 当列表内容为空时显示
    const isEmpty = ref(false)
    const message = ref('当前没有内容...')
    // 一进来的时候就一个查询号病人列表数据，遍历tablist，将data放进去
    const tabList = [
        {label: '创建病历', name: 'createMR', key: 'createMR', content: '创建病历', data:[], type:'0'},
        {label: '我的草稿', name: 'mineMR', key: 'mineMR', content: '我的草稿', data:[], type:'1'},
        {label: '待审核', name:'uncheck',key:'uncheck',content:'待审核', data:[], type:'2'},
      // {label: '科室', name:'department',key:'department',content:'科室', data:[], type:'3'}
    ]

    const activeName = ref('createMR');
    const patientStore = usePatientStore();
    const currentPatient = patientStore.currentPatient;
    // const userStore = useUserStore();
    // const currentUser = JSON.parse(userStore.currentUser) || null;
    // const role = userStore.roles;

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
    const formConf = ref({
      title: '基础信息'
    })
    const formLabelWidth = ref('40px');

    const clearDesigner = ()=>{
      console.log(vFormRanderRef.value);
      // 清空画布
      // vFormRanderRef.value[0].clearDesigner()
    }

    // 获取当前病人当前记录
    async function getPatientMR(id){
        console.log(id);
        const _res = await getPatientMRApi(id);
        console.log(_res);
        // 如果有病历数据，显示
        if(_res.code===200){
            isEmpty.value = _res.data ? false : true;
            message.value = _res.data ? '' : '当前病人没有历史病历……';
            patientMR.value = _res.data
        }else{
            console.log(_res);
        }
    }
    onMounted(async ()=>{
      // 先判断有无当前病人，有就继续，获取当前病人的病历，没有就返回，（是显示提升和空白页面还是重定向到病人一栏那里或者打开选择病人选框）
      checkCurrentPatient();
      // 如果有当前病人，先拿到当前病人信息，发送请求查询病历列表
      console.log(currentPatient);
      getPatientMR(currentPatient.patientID || '654321');
      // 清空画布
      // clearDesigner()
      // 判断有无当前用户和患者
      // if(currentUser){
      //   console.log('currentUser_id:::',currentUser.id);
      //   console.log('role:::',role);
      // }
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
    // 创建病历
    function createMedicalRecordEvt(type){
      // 选择创建markdown或者form形式病历记录
      // 按理说，选择创建哪种格式应该是医院或者根据病人当前已有病历格式决定
      // 但这里还没理清逻辑，故先写两种创建按钮
      alert(`create EMR type-${type}`)
      MRStore.setEmrType(type)

      console.log(MRStore.emrType);
      
      router.push('/emrManage/doctor/medicalRecordEdit')
    }
    // 编辑病历
    const editMedicalRecordEvt = (type)=>{
      switch(type){
        case 'add':
          console.log('add new MR');
          // 当前有患者，拿到患者基础信息，
          // 拿到当前记录
          // 算了,不能编辑
          // 跳转编辑页面
          router.push('/emrManage/doctor/medicalRecordEdit')
          break;
        case 'edit':
          //showMedicalRecordDialog or router.push('/elMedicalRecordEdit')
          router.push('/emrManage/doctor/medicalRecordEdit');
          break;
        default:
          console.log('既不是新增也不是编辑，那看看得了');
      }
      console.log(MyDialogRef.value);
      if (MyDialogRef.value){
        MyDialogRef.value.showDialog()
      }else{
        console.error('MyDialogRef is not yet mounted or does not exist');  
      }
    }
    
    
    // 传给弹窗组件执行的事件
    const patientInfoConfirmEvt = ()=>{
      console.log('确认用户信息');
      ElMessage({
          type: 'info',
          message: `用户信息已填入病历头`,
      })
      setMRHeader()
    }
    
    // 添加流程（参与者）
    // const addparticipantEvt = ()=>{
    //   alert('add participants!')
    //   appendRecord()
    // }

    const patientInfoCancelEvt = ()=>{
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

    // 主显示区域点击左边项目的事件
    function clickLeftItemEvt(i){
      console.log(i);
      alert(i)
    }
    return {
      patientMR,
      MRStore,
      router,
      category,
      getFieldopt,
      MyDialogRef,
      patientInfoRef,
      patientInfoCancelEvt,
      patientInfoConfirmEvt,
      formJson,
      formConf,
      vFormRanderRef,
      message,
      isEmpty,
      tabList,
      activeName,
      formLabelWidth,
      updateFormData,
      createMedicalRecordEvt,
      editMedicalRecordEvt,
      // addparticipantEvt,
      confirmEvt,
      cancelEvt,
      // currentUser,
      currentPatient,
      // role,
      clickLeftItemEvt
    }
  },
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
    /**跳转/查看历史病历 */
    historyMREvt(){
      this.router.push('/emrManage/patient/patientMedicalRecord')
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .records-list {
    height: 460px;
    ::v-deep .el-tabs--left{
      height: 100%!important;
      .el-tabs__header.is-left{
        min-width: 120px;
        .el-tabs__item.is-left {
            text-align: left; 
        }
      }
    }
    // ::v-deep .el-tabs--left .el-tabs__header.is-left{
    //   width: 144px;
    //   .el-tabs--left .el-tabs__item.is-left {
    //       text-align: left; 
    //   }
    // }
    ::v-deep .el-tabs__content{
      height: 100%;
      overflow-y: scroll;
      // overflow-x: hidden;
    }
  }

}
</style>


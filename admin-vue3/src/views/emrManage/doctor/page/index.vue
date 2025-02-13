<template>
  <div class="app-container">
    <el-card style="max-width: 800px">
      <template #header>
        <div class="card-header">
          <span>病案首页</span>
        </div>
      </template>
      <!-- mySwitchCard -->
      <el-scrollbar>
        <el-empty v-if="isEmpty" :description="message">
            <el-button type="primary" @click="checkPatient">选择病人</el-button>
        </el-empty>

        <el-tabs v-if="!isEmpty" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane v-for="lab in tabList" :key="lab.key" :label="lab.label" :name="lab.name">
              <div>{{lab.content}}</div>
              <div class="form-rend">
                <!-- <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef"> -->
                  <button @click="resetselectoptions">设置productType选项</button>
                <v-form-render
                :form-json="lab.json" 
                :form-data="formData" 
                :option-data="optionData" 
                ref="vFormRef">
                </v-form-render>
                <el-button type="primary" @click="submitForm">Submit</el-button>
              </div>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </el-card>
    
  </div>
</template>

<script>
import DoctorBasicInformation from '../json/DoctorInformation.json';
import PatientBasicInformation from '../json/PatientInformation.json';
import usePatientStore from '@/store/modules/patient';
import { generateIDApi, getMedicalRecordListApi, getPatientMRApi } from '@/api/medicalRecord/emrApi';
import { getHospitalMetadataCategoryApi,getFieldListApi } from '@/api/medicalRecord/formCreate';

export default {
  name: 'DoctorPage',
  setup(){
    const isEmpty = ref(false);
    const message = ref('');
    const activeName = ref('jbxx');
    const patientStore = usePatientStore();
    const currentPatient = patientStore.getCurrentPatient();
    
    const handleClick = (tab, event) => {
      console.log(tab, event)
    }
    const tabList = ref([
      {label: '基本信息', name: 'jbxx', key: 'jbxx', content: '基本信息',json: DoctorBasicInformation},
      {label: '西医诊断', name:'xyzd',key:'xyzd',content:'西医诊断',json: PatientBasicInformation},
      {label: '过敏与手术', name:'gmyss',key:'gmyss',content:'过敏与手术',json: ''},
      {label: '住院情况', name:'zyqk',key:'zyqk',content:'住院情况',json: ''},
      {label: '副页信息', name:'fyxx',key:'fyxx',content:'副页信息',json: ''},
      {label: '其他信息', name:'qtxx',key:'qtxx',content:'其他信息',json: ''}
    ])
    const optionData = {
      'gender': [
        {label: '男', value: '1'},
        {label: '女', value: '2'}
      ],
      'paymentType': [
        {label: '支付宝', value: 'alipay'},
        {label: '微信', value: 'wechat'}
      ],
      'CV02.01.101': [
        {label: '居民身份证',	value: '01'},
        {label: '居民户口簿',	value: '02'},
        {label: '护照',	value: '03'},
        {label: '军官证',	value: '04'},
        {label: '驾驶证',	value: '05'},
        {label: '港澳居民来往内地通行证',	value: '06'},
        {label: '台湾居民来往内地通行证',	value: '07'},
        {label: '其他法定有效证件',	value: '99'},
      ]
    }
    // 获取数据，初始化
    onMounted(async ()=>{
        //判断当前有无选中病人
        if(!currentPatient){
            // 如果没有
            isEmpty.value = true
            message.value = '请先选择病人！'
        }else{
            // 如果有当前病人，先拿到当前病人信息，发送请求查询病历列表
            console.log('currentPatient----------------');
            console.log(currentPatient);
            const query = {
                patientID:currentPatient.patientID || '654321',
            };
            const res = await getPatientMR(currentPatient.patientID);
            const jobID = await generateIDApi();
            const metadata = await getMetadata('1');
            console.log('jobID::',jobID);
            
            console.log('metadata::',metadata);
            
            // 如果有病历数据，显示
            if(res.code===200){
                isEmpty.value = res.data ? false : true;
                message.value = res.data ? '' : '当前病人没有历史病历……';
            }else{
                console.log(res);
            }
        }
        
    });
    // 定义发送请求的方法
    // 获取当前病人病历
    async function getPatientMR(id){
        console.log(id);
        return await getPatientMRApi(id);
    }
    // 获取元数据值域
    async function getMetadata(query){
        console.log(query);
        return await getHospitalMetadataCategoryApi(query);
    }

    // 
    return {
      activeName,
      handleClick,
      tabList,
      optionData
    }
  },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
      /* 注意：formJson是指表单设计器导出的json，此处演示的formJson只是一个空白表单json！！ */ 
      formJson: DoctorBasicInformation,
      formData: {}
      
    }
  },
  methods: {
    resetselectoptions(){
      let productTypeR = this.getWidgetRef('productType')
      // loadOptions(options)
      productTypeR.loadOptions([
        {label: '身份证', value: '1'},
        {label: '护照', value: '2'},
        {label: '驾驶证', value: '3'}
      ])
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
.app-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  .el-card{
    width: 800px;
    height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    ::v-deep>.el-card__header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50px;
    }
    ::v-deep>.el-card__body {
      margin-top: 50px;
      height: calc(500px - 50px);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
.main-container .form-des {
    margin-left: -210px;
}
.main-container .form-rend {
    // margin-left: -210px;
}
</style>
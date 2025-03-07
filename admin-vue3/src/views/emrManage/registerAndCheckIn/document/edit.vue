<template>
    <div class="app-container">
        <el-row :span="24">
            <el-col :span="8">
                <el-button @click="readCardEvt" style="width: 100%">读取身份证</el-button>
            </el-col>
        </el-row>
        <div class='form-des' :key="key">
            <!-- <el-card>
                <template #header>
                    <span>用户信息</span>
                </template> -->
            <!-- 填写用户档案 -->
            <!-- 用户档案信息表单区域 -->
                <el-scrollbar>
                    <v-form-render 
                    :form-json="formJson" 
                    :form-data="formData" 
                    :option-data="optionData" 
                    ref="vfRenderRef">
                    </v-form-render>
                </el-scrollbar>
            <!-- </el-card> -->
        </div>

        <el-row :span="24">
            <el-col :span="24">
                <el-button :disabled="saveDisabled" @click="saveDocumentEvt" style="width: 100%">保存档案</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
    import { onMounted, ref } from "vue";
    import { getEMRModulesListApi,selectTemplateApi } from "@/api/medicalRecord/emrApi";
    import { readCardApi } from "@/api/medicalRecord/readCard"
    import { ElMessage } from "element-plus";
    import { createDocumentApi } from "@/api/medicalRecord/emrApi";
    import { useRouter } from "vue-router";
    const router = useRouter()
    import useUserStore from '@/store/modules/user';
    const currentUser = JSON.parse(useUserStore().currentUser);

    const vfRenderRef = ref(null)
    let saveDisabled = false
    // 用户信息模板
    let formJson = ref({
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
    let formData = ref({
        'id': 0,                               // number
        'patientID': 0,                       // number
        'gender': 0,                          // number
        'departmentID': 0,                    // number
        'doctorID': 0,                        // number
        'registerType': 0,                    // number
        'createUid': 0,                       // number
        'writeUid': 0,                        // number
        'jobId': 'exampleJobId',             // string
        'age': '30',                          // string
        'selfReportedSymptom': 'Headache',   // string
        'historyOfPresentIllness': 'Fever for 3 days', // string
        'pastMedicalHistory': 'Hypertension', // string
        'historyOfFamilyIllness': 'Diabetes in family', // string
        'personalHistory': 'Smoker for 10 years', // string
        'marriageHistory': 'Married for 5 years', // string
        'diagnosisResult': 'Common Cold',    // string
        'jobidIfActive': true,                // boolean
        'registerDate': new Date(),           // Date
        'prescriptionDate': new Date(),       // Date
        'createDate': new Date(),             // Date
        'writeDate': new Date(),              // Date
        'totalAmount': 100.00,                // number (float8在JavaScript中对应为number)
        'currentSection': 'Triage',           // string
        'registerIfPaid': false,              // boolean
        'ifInQueue': false,                   // boolean
        'roomID': 0,                          // number
        'prescriptionIfPaid': false,          // boolean
        'testIfPaid': false                   // boolean
    })

    onMounted(async()=>{
        // 获取用户信息模板
        await getPatientInfoMudule({name:'档案基础信息表3'})
        // 用户信息模板存在本地……
        // await getPatientInfoMudule({id:5})
        // 获取数据
        // 先是有无草稿或默认数据等
        // await getCardPatientInfoDate()
    })

    // 获取用户信息表单模板
    async function getPatientInfoMudule(query){
        // 信息模板这里只调用form那个
        const res2 = await selectTemplateApi(query)
        // console.log(res2);
        if(res2.code===200){
            console.log(res2.data);
            let tempType = res2.data.payload.type
            if(tempType==1){
                formJson.value = res2.data.payload.template
                vfRenderRef.value.setFormJson(formJson.value)
            }else if(tempType==2){
                res2.data.payload.template
            }
        }
        // console.log(list);
        // console.log(module);
    }
    
    async function readCardEvt(){
        try{
            // 读卡并填写数据
            await getCardPatientInfoDate()
        }catch(err){
            console.log(err);
        }
    }

    async function getCardPatientInfoDate() {
        // 读卡
        try{
            const res = await readCardApi()
            console.log(res);
            // 处理身份信息数据，赋值渲染表单
            
            formData.value = res
        }catch(err){
            // 读卡失败
            console.error(err);
            return
        }
    }
    // 保存档案
    async function saveDocumentEvt(){
        // 非空校验
        // 填写完成后获取表单数据，更新formData，提交请求存储数据
        console.log(vfRenderRef.value);
        
        console.log(await vfRenderRef.value.getFormData());
        formData.value = await vfRenderRef.value.getFormData()
        let obj = {
            createUid: currentUser.createUid,
            writeUid: currentUser.writeUid,
            gender: 10328,
            army: false,
            disability: false,
            die: false,
            inpatient_flag: false, 
        }
        obj = Object.assign({},formData.value,obj)
        // 把所有的空字符串都转为null
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] === "") {
                obj[key] = null;
            }
        }
        delete obj.cityId;
        delete obj.countryId;
        delete obj.stateId;
        delete obj.areaId;
        delete obj.domicileStateId;
        delete obj.domicileCityId;
        delete obj.domicileAreaId;
        console.log(obj);
        // 保存档案
        try{
            let res = await createDocumentApi(obj)
            console.log(res);
            if(res.code===200){
                ElMessage.success('档案已保存！')
                // 跳转到档案管理
                // router.push('/emrManage/registerAndCheckIn/patientDocument')
            }
        }catch(err){
            console.error(err);
        }
        
    }
</script>
<style lang="scss" scoped>
.app-container{
    height: 100%;
}
.v-md-editor {
    height: 100%;
}
.form-des{
    height: calc(100% - 32px - 32px);
}
</style>
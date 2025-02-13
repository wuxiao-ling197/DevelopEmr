<template>
    <div class="app-container">
        <el-row :span="24">
            <el-col :span="8">
                <el-button style="width: 100%">按钮</el-button>
            </el-col>
        </el-row>
        <el-card>
            <template #header>
                <span>用户信息</span>
            </template>
            <!-- 填写用户档案 -->
            <!-- 用户档案信息表单区域 -->
            <div class='form-des' :key="key" style="margin-top:30px;">
                <v-form-render 
                :form-json="formJson" 
                :form-data="formData" 
                :option-data="optionData" 
                ref="vfRenderRef">
                </v-form-render>

            </div>

            <div>
                <!-- 用于显示二维码的容器 -->
                <div ref="qrcode" class="qrcode"></div>
            </div>
        </el-card>
        <el-row :span="24">
            <el-col :span="24">
                <el-button @click="regiserEvt" style="width: 100%;">确认提交</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
    import { onMounted, ref } from "vue";
    import { getEMRModulesListApi,selectTemplateApi } from "@/api/medicalRecord/emrApi";
    import usePatientStore from '@/store/modules/patient';
    import { ElMessage } from "element-plus";
    import { registerApi } from "@/api/medicalRecord/emrApi";
    import { useRouter } from "vue-router";
    import { ElMessageBox } from "element-plus";
    const router = useRouter()
    const vfRenderRef = ref(null)
    const qrcode = ref(null)
    const patientStore = usePatientStore()
    // 用户信息模板
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
    let formData = ref({
        TP0112: 1,
        age:"38",
        count:"10",
        desc:"腹泻",
        doctorname:1,
        identifyNumber:"12222*******100908",
        input108524: "李华",
        payway: 1,
        sex: 1,
        sheng: 1,
        shi: 1,
        xian: 1,
        科室: 78,
        departmentID:78,
        doctorID:1,
        registerType: 1
    })
    let patientInfo = ref({})

    onMounted(async()=>{
        // await getPatientInfoMudule({name:'PatientInfo'})
        await getPatientInfoMudule({id:3})
        patientInfo.value = await patientStore.getCurrentPatient()
        console.log(patientInfo.value);
        // 获取当前info，然后获取挂号模板

        // 自动填写数据
        await setPatientInfo()
    })

    async function regiserEvt(){
        // 获取数据
        // await getPatientInfo()
        // 提交数据
        try{
            console.log(formData.value);
            // return
        let res = await registerApi(formData.value)
        console.log(res);
        if(res.code===200){
            // // 返回签到码--暂时定为jobId
            let checkCode = res.data.jobId
            ElMessageBox.alert('挂号成功', '', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: 'OK',
                callback: (action) => {
                    ElMessage({
                        type: 'success',
                        message: `签到码如下: ${checkCode}`,
                    })
                },
                
            })
            // 跳转挂号单页面
            router.push({
                path: "/emrManage/registerAndCheckIn/PrintRegister",
                query: { checkCode }
            });
        }
        }catch(err){
            console.log(err);
            
        }
    }
    // 获取用户信息表单模板
    async function getPatientInfoMudule(query){
        // 根据id或者name获取
        const res2 = await selectTemplateApi(query)
    
        if(res2.code===200){
            console.log(res2.data);
            formJson.value = res2.data.payload.template
            vfRenderRef.value.setFormJson(formJson.value)
        }
        // console.log(list);
        // console.log(module);
    }
    async function getPatientInfo(){
        console.log(vfRenderRef.value.getFormData());
        formData.value = vfRenderRef.value.getFormData()
    }
    // 计算年龄
    function calculateAge(bornyearStr) {
        let birthDate = new Date(bornyearStr);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDifference = today.getMonth() - birthDate.getMonth();
        let dayDifference = today.getDate() - birthDate.getDate();
        
        // 如果今天还没到生日，那么年龄需要减一
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }
    
        return age;
    }
    // 填写信息
    async function setPatientInfo(){
        // 处理数据
        let bornyear = patientInfo.value.bornyear
        if(bornyear){
            let age = calculateAge(bornyear)
            formData.value.age = age
        }
       let patientInfoObj = {
        addressDetail: "上海市徐汇区虹桥路808号加华上午中心A-8510",
        addressTypeCode: null,
        areaId: null,
        army: false,
        averageIncome: null,
        bornyear: "1899-12-31T07:48:17.000Z",
        card_type_code: null,
        career: null,
        citizenHealthArchiveCode: null,
        citizenHealthCardCode: null,
        cityId: null,
        contacCateg: null,
        contactName: null,
        contactPhone: "021-64481180-105",
        countryId: 43,
        createDate: "2024-12-30T17:50:13.801Z",
        createUid: 2,
        die: false,
        dieLocation: null,
        dieReason: null,
        disaLv: null,
        disaRes: null,
        disability: false,
        domicileAddressDetail: null,
        domicileAreaId: null,
        domicileCityId: null,
        domicileStateId: null,
        fax: "021-64479122",
        gender: 10329,
        id: 10010,
        identifyid: "021-166321",
        identityType: "1",
        inpatient_flag: true,
        insurance: null,
        mail: "wujiali@scaltex.cn",
        mail_code: "200030",
        marry: null,
        name: "邬佳丽",
        nation: null,
        oldName: null,
        phonenumber: "21166",
        politicalface: null,
        remark: null,
        schoolgrade: null,
        stateId: null,
        unique: "b82c5e0fc71911efb702a497b15701d7",
        workName: null,
        workPhone: null,
        workSubjection: null,
        writeDate: "2024-12-30T17:50:13.801Z",
        writeUid: 2
       }
       formData.value.input108524 = patientInfo.value.name
       formData.value.patientID = patientInfo.value.id
       
       Object.assign(formData.value,patientInfo.value)
        // console.log(vfRenderRef.value.getFormData());
        // formData.value = vfRenderRef.value.getFormData()
        vfRenderRef.value.setFormData(formData.value)
        console.log(formData.value);
        
    }
</script>
<style lang="scss" scoped>

</style>
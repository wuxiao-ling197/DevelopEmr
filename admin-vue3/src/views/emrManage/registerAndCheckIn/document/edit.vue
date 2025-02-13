<template>
    <div class="app-container">
        <el-row :span="24">
            <el-col :span="8">
                <el-button @click="readCardEvt" style="width: 100%">读取身份证</el-button>
            </el-col>
        </el-row>
        <el-card>
            <template #header>
                <span>用户信息</span>
            </template>
            <!-- 填写用户档案 -->
            <!-- 用户档案信息表单区域 -->
            <div class='form-des' :key="key" style="margin-top:30px;">
                <el-scrollbar height="400px">
                    <v-form-render 
                    :form-json="formJson" 
                    :form-data="formData" 
                    :option-data="optionData" 
                    ref="vfRenderRef">
                    </v-form-render>
                </el-scrollbar>
            </div>
        </el-card>
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
    let formData = ref('')

    onMounted(async()=>{
        // 获取用户信息模板
        // await getPatientInfoMudule({name:'PatientInfo'})
        await getPatientInfoMudule({id:2})
        // 获取数据
        // 先是有无草稿或默认数据等
        // await getCardPatientInfoDate()
    })

    // 获取用户信息表单模板
    async function getPatientInfoMudule(query){
        // 根据id或者name获取
        const res1 = await getEMRModulesListApi()
        const res2 = await selectTemplateApi(query)
        if(res1.code===200){
            console.log(res1.data);
            
        }
        if(res2.code===200){
            console.log(res2.data);
            formJson.value = res2.data.payload.template
            vfRenderRef.value.setFormJson(formJson.value)
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
        console.log(vfRenderRef.value.getFormData());
        formData.value = vfRenderRef.value.getFormData()
        // 保存档案
        try{
            let res = await createDocumentApi(formData.value)
            console.log(res);
            if(res.code===200){
                ElMessage.success('档案已保存！')
                // 跳转到档案管理
                this.router.push('/emrManage/registerAndCheckIn/patientDocument')
            }
        }catch(err){
            console.error(err);
        }
        
    }
</script>
<style lang="scss" scoped>

.v-md-editor {
    height: 100%;
}
</style>
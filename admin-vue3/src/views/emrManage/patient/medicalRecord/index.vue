<template>
    <div class="app-container">
        <!-- <div>病历管理</div>
        <router-link class="link-type" :to="'/emrManage/doctor/elMedicalRecord'">添加病历</router-link> -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-button type="primery" @click="showEMREvt">病历管理</el-button>
                <router-link class="link-type" :to="'/emrManage/doctor/elMedicalRecord'">
                    <el-button type="primery" @click="switchPatient">添加病历</el-button>
                </router-link>
                <el-button type="primary" @click="showPatientInfo">切换患者</el-button>
            </el-col>
        </el-row>
        <el-empty v-if="isEmpty" :description="message">
            <el-button type="primary" @click="checkPatient">选择病人</el-button>
        </el-empty>
        <el-table 
        v-if="!isEmpty"
         ref="tableRef"
         row-key="date"
        :data="patientMR" 
        style="width: 100%"
        @select="selectEvt"
        @selection-change="selectionChangeEvt"
        @row-click="rowClickEvt"
        :row-class-name="tableRowClassName"
        >
            <el-table-column fixed type="selection" width="55" />
            <el-table-column 
            label="创建日期"
            height="250"
            width="180"
            sortable
            column-key="date">
                <template #default="scope">
                    {{ scope.row.date }}
                </template>
            </el-table-column>
            <el-table-column 
            property="name" 
            label="患者姓名" 
            width="120" />
            <el-table-column 
            property="type" 
            label="病历类型" 
            width="120" />
            <el-table-column 
            property="job_id" 
            label="工号"
            show-overflow-tooltip 
            width="300" />
            <el-table-column 
            fixed="right" 
            label="操作" 
            min-width="120">
                <template #default="scope">
                    <el-button
                     link type="primary"
                     size="small"
                     @click="handleClick">
                        Edit
                    </el-button>
                    <el-button 
                    link 
                    type="primary" 
                    size="small"
                    @click.prevent="deleteRow(scope.$index)"
                    >Detail</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 折叠面板列病历的话就不用弹窗显示详情 -->
        <el-collapse v-if="!isEmpty" v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(mr,index) in patientMR" :key="mr.id" :title="mr.payload.type" :name="index">
                <div class="form-render-container">
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
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    import { generateIDApi, getMedicalRecordListApi, getPatientMRApi } from '@/api/medicalRecord/emrApi';
    import { getHospitalMetadataCategoryApi } from '@/api/medicalRecord/formCreate';
    import usePatientStore from '@/store/modules/patient';
    import defaultJson from '../../template/json/default.json';

    const patientStore = usePatientStore();

    const isEmpty = ref(true);
    const vFormRanderRef = ref(null);
    const tableData = ref([
        {
            type:'出生证明',
            job_id:'2002-01-18>>19:19:23>>patient01>>job_id01',
            date:'2002-01-18',
            name:'patient01'
        },
    ]);
    // 从store或者本地localStorage获取当前病人
    const currentPatient = patientStore.getCurrentPatient();
    const currentUser = JSON.parse(localStorage.getItem('user-info')) || null;
    const message = ref('当前没有病历信息……');

    const defaultFormJson =  defaultJson;

    let patientMR = [];

    onMounted(async ()=>{
        // 测试能获取全局数据源对象是什么
        // getGsv()
        //判断当前有无选中病人
        if(!currentPatient){
            // 如果没有
            isEmpty.value = true
            message.value = '请先选择病人！'
        }else{
            // 如果有当前病人，先拿到当前病人信息，发送请求查询病历列表
            console.log(currentPatient);
            console.log(currentUser);
            const query = {
                // patientID:currentPatient.patientID || '654321',
                patientID: '654321',
            };
            const res = await getPatientMR(currentPatient.patientID);
            const metadata = await getMetadata('1');
            console.log(res);
            console.log(metadata);
            // 如果有病历数据，显示
            if(res.code===200){
                isEmpty.value = res.data.length>0 ? false : true;
                message.value = res.data ? '' : '当前病人没有历史病历……';
                patientMR = res.data
            }else{
                console.log(res);
            }
        }
    });
    // 获取所有病历列表
    async function getMedicalRecordList(query){
        console.log(query);
        return await getMedicalRecordListApi(query);
    }
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

    // 设置表单值(表单数据对象)
    function setFormDataValue(formData){
        vFormRanderRef.value.setFormData(formData)
    }
    function getGsv(){
        // console.log(vFormRanderRef.value.getGlobalDsv());
        
    }
    // 设置表单单个字段值
    function setFeildValueEvt(fieldName, fieldValue){
        try{
            vFormRanderRef.value.setFeildValue(fieldName, fieldValue)
        }catch(err){
            console.log(err);
            
        }
    }
    // 表单发生改变
    function formChangeEvt(fieldName, newValue, oldValue, formModel){
        // 发生改变的字段值
        console.log('changeFieldName::',fieldName);
        // 改变前后的值
        console.log(`change from ${oldValue} to ${newValue}`);
        // 表单数据对象
        console.log('formModel::');
        console.log(fieldName);
        
    }

    /**选择病人 */
    function checkPatient(){

    }
</script>
<style lang="scss" scoped>
body {
  margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
.link-type{
    padding-left: 2px;
}
</style>
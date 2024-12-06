<template>
    <div class="dialog-container">
        <el-dialog v-model="dialogVisible" :title="title" width="500">
            <el-form :model="form">
            <el-form-item label="Promotion name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Zones" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai" />
                <el-option label="Zone No.2" value="beijing" />
                </el-select>
            </el-form-item>
            </el-form>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                Confirm
                </el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
    name:"MyDialog",
    props:{
        title:{
            type:String,
            default:'用户信息'
        },
        form:{
            type:Object,
            default:()=>({
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            })
        },
        formLabelWidth:{
            type:String,
            default:'140px'
        }
    },
    setup(){
        const myDialogRef = ref(null);
        const dialogVisible = ref(false);
        function showDialog(){
            console.log('-------show-dialog--------------');
            dialogVisible.value = true
        };
        function closeDialog(){
            dialogVisible.value = false
        };
        return {
            myDialogRef,
            dialogVisible,
            showDialog,
            closeDialog
        }
    },
}
</script>
<style lang="scss" scoped>
    // .dialog-container{
    //     position: fixed;
    //     top: 50%;
    //     left: 50%;
    //     width: 50vw;
    //     height: 50vh;
    //     background: rgba(200, 102, 41, 0.3);
    //     z-index: 999;
    // }
</style>
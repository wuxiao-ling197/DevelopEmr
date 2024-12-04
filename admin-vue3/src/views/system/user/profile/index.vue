<template>
   <div class="app-container">
      <el-row :gutter="20">
         <el-col :span="6" :xs="24">
            <el-card class="box-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>个人信息</span>
                 </div>
               </template>
               <div>
                  <div class="text-center">
                     <userAvatar :user="state.user" @updateAvatar="updateAvatar"/>
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <svg-icon icon-class="user" />用户名称
                        <div class="pull-right">{{ state.user.login }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="phone" />手机号码
                        <div class="pull-right">{{ state.employee.workPhone }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="email" />用户邮箱
                        <div class="pull-right">{{ state.employee.workEmail }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="tree" />所属公司
                        <div class="pull-right">{{ state.companyGroup}}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="tree" />所属部门
                        <div class="pull-right" v-if="state.employee.departmentId" >{{ state.department.name.zh_CN }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="peoples" />所属角色
                        <div class="pull-right">{{ state.roleGroup || "未分配" }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="totp" />双重验证
                        <div class="pull-right">
                           <el-switch disabled v-model="totp_enable" style="padding-bottom:15px ;" @change="onTotp(totp_enable)"></el-switch>
                        </div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="date" />创建日期
                        <div class="pull-right">{{ parseTime(state.user.createDate)}}</div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="18" :xs="24">
            <el-card>
               <template v-slot:header>
                 <div class="clearfix">
                   <span>基本资料</span>
                 </div>
               </template>
               <el-tabs v-model="activeTab">
                  <el-tab-pane label="基本资料" name="userinfo">
                     <userInfo :user="state.employee" />
                  </el-tab-pane>
                  <el-tab-pane label="修改密码" name="resetPwd">
                     <resetPwd />
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile, createTotp, closeTotp } from "@/api/system/user";
import { ref } from "vue";

const activeTab = ref("userinfo");
const totp_enable = ref(false);
const state = reactive({
  user: {},
  employee: {},
  department: {},
  roleGroup: {},
  companyGroup: {},
});

function getUser() {
   //调用api函数getUserProfile， 同时response接收函数的返回值 response的结构与后端返回值一致
  getUserProfile().then(response => {
   //  console.log('getUserProfile response=', response.data, typeof(response.data.companys));
    state.user = response.data;
    state.employee = response.data.employee || null;
    if(typeof(response.data.companys) == 'object'){
      state.companyGroup = response.data.companys.name;
    }else{
      state.companyGroup = response.data.companys.map(comp=>comp.name)
    }
    state.department = response.data.employee.department || null;
    state.roleGroup = response.data.roles.map(role=>role.roleName);
    if(state.user.nestSecret !=null) totp_enable.value = true;
   // 传递数据给子组件
   //  user=state.employee;
  }).catch(error => {
    console.error('Error fetching user profile:', error);
});
};

function onTotp(value){
   console.log('totp=', value);
   //调用totp API enable
   if(value){
      createTotp(state.user.id).then((res)=>{

      })
   }else{
      //当关闭时
      closeTotp((state.user.id)).then((res)=>{

      })
   }
   
}

function updateAvatar(url) {
  state.user.avatar = url;
  console.log('---------->>>>>avatar=',state.user)
};

getUser();
</script>

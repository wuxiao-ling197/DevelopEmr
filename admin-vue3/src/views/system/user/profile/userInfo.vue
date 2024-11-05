<template>
   <el-form ref="userRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="login">
         <el-input v-model="user.name" maxlength="30" />
      </el-form-item>
      <el-form-item label="手机号码" prop="workPhone">
         <el-input v-model="user.workPhone" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱" prop="workEmail">
         <el-input v-model="user.workEmail" maxlength="50" />
      </el-form-item>
      <el-form-item label="性别">
         <el-radio-group v-model="user.gender">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
            <el-radio label="2">未知</el-radio>
         </el-radio-group>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
   </el-form>
</template>

<script setup>
import { updateUserProfile } from "@/api/system/user";
import {defineProps, ref} from "vue";

const props = defineProps({
  user: {
    type: Object,
  }
});
console.log('profile-userInfo=', props.user);

// 创建一个本地响应式用户数据，用于表单绑定
// const user = ref({ ...props.user });

const { proxy } = getCurrentInstance();

const rules = ref({
  login: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  workEmail: [{ required: true, message: "邮箱地址不能为空", trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
  workPhone: [{ required: true, message: "手机号码不能为空", trigger: "blur" }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
});

// 监听 props 的变化，更新本地用户数据
// watch(() => props.user, (newValue) => {
//   console.log('profile 表单更新：', newValue);
//   user.value = { ...newValue };
// });

/** 提交按钮 */
function submit() {
  // props.user.name=
  proxy.$refs.userRef.validate(valid => {
    console.log('profile-userinfo update=',valid, props.user);
    
    if (valid) {
      updateUserProfile(props.user).then(response => {
        proxy.$modal.msgSuccess("修改成功");
      });
    }
  });
};
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
};
</script>

<template>
   <div class="app-container">
      <h4 class="form-header h4">基本信息</h4>
      <el-form :model="form" label-width="80px">
         <el-row>
            <!-- <el-col :span="8" :offset="2">
               <el-form-item label="用户昵称" prop="name">
                  <el-input v-model="form.employee.name" disabled />
               </el-form-item>
            </el-col> -->
            <el-col :span="8" :offset="2">
               <el-form-item label="登录账号" prop="login">
                  <el-input v-model="form.login" disabled />
               </el-form-item>
            </el-col>
         </el-row>
      </el-form>

      <h4 class="form-header h4">角色信息</h4>
      <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="roleRef" @selection-change="handleSelectionChange" :data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)">
         <el-table-column label="序号" width="55" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
         <el-table-column label="角色编号" align="center" prop="roleId" />
         <el-table-column label="角色名称" align="center" prop="roleName" />
         <el-table-column label="权限字符" align="center" prop="roleKey" />
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />

      <el-form label-width="100px">
         <div style="text-align: center;margin-left:-120px;margin-top:30px;">
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="close()">返回</el-button>
         </div>
      </el-form>
   </div>
</template>

<script setup name="AuthRole">
import { getAuthRole, updateAuthRole } from "@/api/system/user";

const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const roleIds = ref([]);
const roles = ref([]);
const form = ref({
  name: undefined,
  login: undefined,
  userId: undefined
});

/** 单击选中行数据 */
function clickRow(row) {
  proxy.$refs["roleRef"].toggleRowSelection(row);
};
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map(item => item.roleId);
};
/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.roleId;
};
/** 关闭按钮 */
function close() {
  const obj = { path: "/system/user" };
  proxy.$tab.closeOpenPage(obj);
};
/** 提交按钮 */
function submitForm() {
  const userId = form.value.userId;
  const rIds = roleIds.value.join(",");
  updateAuthRole({ userId: userId, roleIds: rIds }).then(response => {
    proxy.$modal.msgSuccess("授权成功");
    close();
  });
};

(() => {
  const userId = route.params && route.params.userId; //处理对象用户
  if (userId) {
    loading.value = true;
   //  传入需要分配角色的用户ID，不是当前操作用户ID
    getAuthRole(userId).then(res => {
      console.log('分配角色=', res);
      
      const response = res.data;
      form.value = response.user;
      roles.value = response.roles;
      total.value = roles.value.length;
      nextTick(() => {
        roles.value.forEach(row => {
          if (row.flag) {
            proxy.$refs["roleRef"].toggleRowSelection(row);
          }
        });
      });
      loading.value = false;
    });
  }
})();
</script>

<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--侧栏部门树数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input
                  v-model="deptName"
                  placeholder="请输入部门名称"
                  clearable
                  prefix-icon="Search"
                  style="margin-bottom: 20px"
               />
            </div>
            <div class="head-container">
               <el-tree
                  :data="deptOptions"
                  :props="{ label: 'label', children: 'children' }"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="deptTreeRef"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick"
               />
            </div>
         </el-col>
         <!--用户查询数据-->
         <el-col :span="20" :xs="24">
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
               <el-form-item label="用户名称" prop="login">
                  <el-input
                     v-model="queryParams.login"
                     placeholder="请输入用户名称"
                     clearable
                     style="width: 240px"
                     @keyup.enter="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="员工名称" prop="name">
                  <el-input
                     v-model="queryParams.name"
                     placeholder="请输入员工名称"
                     clearable
                     style="width: 240px"
                     @keyup.enter="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="手机号码" prop="workPhone">
                  <el-input
                     v-model="queryParams.workPhone"
                     placeholder="请输入手机号码"
                     clearable
                     style="width: 240px"
                     @keyup.enter="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="状态" prop="active">
                  <el-select
                     v-model="queryParams.active"
                     placeholder="用户状态"
                     clearable
                     style="width: 240px"
                  >
                     <!-- <el-option
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                     /> -->
                     <el-option :key="true" label="正常" :value="true"></el-option>
                     <el-option :key="false" label="停用" :value="false"></el-option>
                  </el-select>
               </el-form-item>
               <el-form-item label="创建时间" style="width: 308px;">
                  <el-date-picker
                     v-model="dateRange"
                     value-format="YYYY-MM-DD"
                     type="daterange"
                     range-separator="-"
                     start-placeholder="开始日期"
                     end-placeholder="结束日期"
                  ></el-date-picker>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button icon="Refresh" @click="resetQuery">重置</el-button>
               </el-form-item>
            </el-form>

            <!-- 表格上方按钮 -->
            <el-row :gutter="10" class="mb8">
               <el-col :span="1.5">
                  <el-button
                     type="primary"
                     plain
                     icon="Plus"
                     @click="handleAdd"
                     v-hasPermi="['system:user:add']"
                  >新增</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="success"
                     plain
                     icon="Edit"
                     :disabled="single"
                     @click="handleUpdate"
                     v-hasPermi="['system:user:edit']"
                  >修改</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="danger"
                     plain
                     icon="Delete"
                     :disabled="multiple"
                     @click="handleDelete"
                     v-hasPermi="['system:user:remove']"
                  >删除</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="info"
                     plain
                     icon="Upload"
                     @click="handleImport"
                     v-hasPermi="['system:user:import']"
                  >导入</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="warning"
                     plain
                     icon="Download"
                     @click="handleExport"
                     v-hasPermi="['system:user:export']"
                  >导出</el-button>
               </el-col>
               <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
            </el-row>

            <!-- 表格数据 -->
            <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="50" align="center" />
               <el-table-column label="用户编号" align="center" key="id" prop="id" v-if="columns[0].visible" />
               <el-table-column label="用户名称" align="center" key="login" prop="login" v-if="columns[1].visible" :show-overflow-tooltip="true" fixed />
               <el-table-column label="员工" align="center" key="employee.name" prop="employee.name" v-if="columns[2].visible" :show-overflow-tooltip="true" >
                  <template #default="scope">
                     <span>{{ scope.row.employee ? scope.row.employee.name : '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="公司" align="center" key="company.name" prop="company.name" v-if="columns[11].visible" :show-overflow-tooltip="true" >
                  <template #default="scope">
                     <span>{{ scope.row.company?.name || '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="部门" align="center" key="employee.department.name.zh_CN" prop="employee.department.name.zh_CN" v-if="columns[3].visible" :show-overflow-tooltip="true" >
                  <template #default="scope">
                     <!-- <span>{{ scope.row.employee.department ? scope.row.employee.department.name.zh_CN : '无' }}</span> -->
                      <!-- 处理user没有绑定employee或department的问题 -->
                     <span>{{ scope.row.employee?.department?.name.zh_CN || '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="员工类型" align="center" key="employee.employeeType" prop="employee.employeeType" v-if="columns[4].visible" :show-overflow-tooltip="true" >
                  <template #default="scope">
                     <span>{{ scope.row.employee ? scope.row.employee?.employeeType : '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="手机号码" align="center" key="employee.workPhone" prop="employee.workPhone" v-if="columns[5].visible" width="120" >
                  <template #default="scope">
                     <span>{{ scope.row.employee ? scope.row.employee.workPhone : '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="状态" align="center" key="active" prop="active" v-if="columns[6].visible">
                  <template #default="scope">
                     <!--删除这两个属性后就不会弹出注销窗口了 active-value="true" inactive-value="false" -->
                     <el-switch
                        v-model="scope.row.active"
                        @change="handleStatusChange(scope.row)"
                     ></el-switch>
                  </template>
               </el-table-column>
               <el-table-column label="创建时间" align="center" prop="createDate" v-if="columns[7].visible" width="160">
                  <template #default="scope">
                     <span>{{ parseTime(scope.row.createDate) }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="通知类型" align="center" key="notificationType" prop="notificationType" v-if="columns[8].visible" width="120" >
                  <template #default="scope">
                     <span>{{ scope.row.employee ? scope.row.notificationType : '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="邮箱" align="center" key="employee.workEmail" prop="employee.workEmail" v-if="columns[9].visible" width="120" >
                  <template #default="scope">
                     <span>{{ scope.row.employee ? scope.row.employee.workEmail : '无' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="性别" align="center" key="employee.gender" prop="employee.gender" v-if="columns[10].visible" width="120" >
                  <template #default="scope">
                     <span>{{ scope.row.employee?.gender === 'male' ? '男' : scope.row.employee?.gender === 'female' ? '女' : '未知' }}</span>
                  </template>
               </el-table-column>
               <el-table-column label="部门结构" align="center" key="employee.department.virtual" prop="employee.department.virtual" v-if="columns[12].visible" :show-overflow-tooltip="true" >
                  <template #default="scope">
                     <span>{{ scope.row.employee?.department?.virtual === true ?'虚拟' : scope.row.employee?.department?.virtual === false ?'实体' : ''}}</span>
                  </template>
               </el-table-column>
               <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
                  <template #default="scope">
                     <el-tooltip content="修改" placement="top" v-if="scope.row.id !== 2">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                     </el-tooltip>
                     <el-tooltip content="删除" placement="top" v-if="scope.row.id !== 2">
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                     </el-tooltip>
                     <el-tooltip content="重置密码" placement="top" v-if="scope.row.id !== 2">
                         <el-button link type="primary" icon="Key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']"></el-button>
                     </el-tooltip>
                     <el-tooltip content="分配角色" placement="top" v-if="scope.row.id !== 2">
                        <el-button link type="primary" icon="CircleCheck" @click="handleAuthRole(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                     </el-tooltip>
                  </template>
               </el-table-column>
            </el-table>
            <pagination
               v-show="total > 0"
               :total="total"
               v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize"
               @pagination="getList"
            />
         </el-col>
      </el-row>

      <!-- 添加或修改用户配置对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="登录名" prop="login">
                     <el-input v-model="form.login" placeholder="请输入用户登录名" maxlength="30" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="员工名称" prop="name">
                     <el-input v-model="form.name" placeholder="请输入员工名称" maxlength="30" />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="所属公司"  prop="companyId">
                     <el-tree-select
                        v-model="form.companyId"
                        :data="compOptions"
                        :props="{ value: 'id', label: 'label', children: 'children' }"
                        value-key="id"
                        placeholder="请选择所属公司"
                        check-strictly
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item  label="归属部门" prop="departmentName">
                     <!--v-if="form.employee&&form.employee.department" form.employee.department.name.zh_CN" -->
                     <el-tree-select
                        v-model="form.departmentName"
                        :data="deptOptions"
                        :props="{ value: 'id', label: 'label', children: 'children' }"
                        value-key="id"
                        placeholder="请选择归属部门"
                        check-strictly
                     />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="手机号码" prop="workPhone">
                     <el-input v-model="form.workPhone" placeholder="请输入手机号码" maxlength="11" />
                  </el-form-item>
               </el-col>
               
               <el-col :span="12">
                  <el-form-item label="员工类型" prop="employeeType">
                     <el-select
                     v-model="form.employeeType"
                     placeholder="请选择"
                     clearable
                     style="width: 240px"
                  >
                     <el-option key="employee" label="员工" value="employee"></el-option>
                     <el-option key="student" label="学生" value="student"></el-option>
                     <el-option key="trainee" label="见习" value="trainee"></el-option>
                     <el-option key="contractor" label="合作方" value="contractor"></el-option>
                     <el-option key="freelance" label="自由职业者" value="freelance"></el-option>
                  </el-select>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="系统角色">
                     <el-select :disabled="isDisabled"  v-model="form.roles" multiple placeholder="请选择">
                        <el-option
                           v-for="item in roleOptions"
                           :key="item.roleId"
                           :label="item.roleName"
                           :value="item.roleId"
                           :disabled="item.status == 1"
                        ></el-option>
                        <!-- <el-option key="admin" label="超级管理员" value="admin"></el-option>
                        <el-option key="common" label="普通用户" value="common"></el-option> -->
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="用户性别" prop="gender">
                     <el-select v-model="form.gender" placeholder="请选择">
                        <!-- <el-option
                           v-for="dict in sys_user_sex"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"
                        ></el-option> -->
                        <el-option key="male" label="男" value="male"></el-option>
                        <el-option key="female" label="女" value="female"></el-option>
                        <el-option key="other" label="未知" value="other"></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="邮箱" prop="workEmail">
                     <el-input v-model="form.workEmail" placeholder="请输入邮箱" maxlength="50" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="婚姻状况" prop="marital">
                     <el-select
                     v-model="form.marital"
                     placeholder="请选择"
                     clearable
                     style="width: 240px"
                  >
                     <el-option key="single" label="单身" value="single" />
                     <el-option key="married" label="已婚" value="married" />
                     <el-option key="cohabitant" label="同居" value="cohabitant" />
                     <el-option key="widower" label="丧偶" value="widower" />
                     <el-option key="divorced" label="离异" value="divorced" />
                  </el-select>
                  </el-form-item>
               </el-col>
            </el-row>
            <!-- <el-row>
               <el-col :span="12">
                  <el-form-item label="状态" prop="active">
                     <el-radio-group v-model="form.active">
                        <el-radio label="true">正常</el-radio>
                        <el-radio label="false">停用</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row> -->
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
         <el-upload
            ref="uploadRef"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
         >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div>
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm">确 定</el-button>
               <el-button @click="upload.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="User">
// import { EMPLOYEE_USER_TYPE } from "@/server/src/common/constant/index.ts"
import { getToken } from "@/utils/auth";
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser, compTreeSelect, deptTreeSelect } from "@/api/system/user";
import { listRole } from "@/api/system/role";
import { ref } from "vue";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const compOptions = ref(undefined);
const initPassword = ref("123456");
const postOptions = ref([]);
const roleOptions = ref([]);
const isDisabled = ref(false)
// const employeeTypes = EMPLOYEE_USER_TYPE;
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `用户名称`, visible: true },
  { key: 2, label: `员工`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `员工类型`, visible: true },
  { key: 5, label: `手机号码`, visible: true },
  { key: 6, label: `状态`, visible: false },
  { key: 7, label: `创建时间`, visible: false },
  { key: 8, label:`通知类型`,visible: false},
  { key: 9, label:`邮箱`,visible: false},
  { key: 10, label:`性别`,visible: false},
  { key: 11, label:`公司`,visible: true},
  { key: 12, label:`部门结构`,visible: false},
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    login: undefined,
    name: undefined,
    workPhone: undefined,
    active: undefined,
    departmentName: undefined,
    companyId: undefined
  },
  rules: {
    login: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
    name: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
   //  password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
    workEmail: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    workPhone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  }
});

// queryParams是顶部查询参数
const { queryParams, form, rules } = toRefs(data);


/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
   // console.log('部门树=', response.data);
    deptOptions.value = response.data;
  });
};
/** 查询公司下拉树结构 */
function getCompTree() {
  compTreeSelect().then(response => {
   console.log('公司树=', response.data);
    compOptions.value = response.data;
  });
};
/**查询系统角色项 */
// function getAllRole(){
//    roleTreeSelect().then(response => {
//    console.log('角色列表=', response.data);
//     roleOptions.value = response.data;
//   });
// }
/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
   console.log('页面=', res);   
    loading.value = false;
    userList.value = res.data.list;
    total.value = res.data.total;
  })
//   .catch(error => {
//     console.log('Error fetching user list:', error);
// });
};
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.departmentId = data.id;
  handleQuery();
};
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value.deptName = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
};
/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
    return delUser(userIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
};
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/user/export", {
    ...queryParams.value,
  },`user_${new Date().getTime()}.xlsx`);
};
/** 用户状态修改  */
function handleStatusChange(row) {
   console.log('修改状态=', row.id, row.active);
   
  let text = row.active === true ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.login + '"用户吗?').then(function () {
    return changeUserStatus(row.id, row.active);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.active = row.active === true ? true : false;
  });
};
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
};
/** 跳转角色分配 */
function handleAuthRole(row) {
  const userId = row.id;
  console.log('vue 跳转角色分配：',userId);
  router.push("/system/user-auth/role/" + userId);
};
/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy.$prompt('请输入"' + row.login + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
  }).then(({ value }) => {
    resetUserPwd(row.id, value).then(response => {
      proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
    });
  }).catch(() => {});
};
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/user/importTemplate", {
  }, `user_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};
/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
   //  virtual: false,
    departmentId: undefined,
    companyId: undefined,
    login: undefined,
    name: undefined,
    password: undefined,
    workPhone: undefined,
    workEmail: undefined,
    gender: undefined,
    marital: undefined,
   //  postIds: [],
    roles: [],
    employeeType: undefined
  };
  proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
};
/** 中部新增按钮操作 */
function handleAdd() {
  reset();
  isDisabled.value=false;
  getUser().then(response => {
   //  postOptions.value = response.data.posts;
   console.log('add form=', response);
   
   // 新增按钮时系统角色项应该全部显示
    roleOptions.value = response.data.roles;
   //  roleOptions.value = response.roles;
    
    open.value = true;
    title.value = "添加用户";
    form.value.password = initPassword.value;
  });
};
function getRoles(){
   listRole((1,10)).then(response =>{
      roleOptions.value = response.data.list;
      console.log('add form get roles=', roleOptions.value);
   })
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  isDisabled.value = true;
  const userId = row.id || ids.value;
  getUser(userId).then(res => {
   const response = res.data;
    
    // 原角色项加载方法 10.31
    roleOptions.value = response.data?.roles || "";
    open.value = true;
    title.value = "修改用户";
   //  form.password = "";
    this.form.id = userId;
    this.form.departmentName = response.data.employee?.department?.name.zh_CN || "";
    this.form.marital = response.data.employee?.marital|| "";
    this.form.gender = response.data.employee?.gender || "";
    this.form.employeeType = response.data.employee?.employeeType || "";
    this.form.name = response.data.employee?.name || "";
    this.form.workEmail = response.data.employee?.workEmail || "";
    this.form.workPhone = response.data.employee?.workPhone || "";
   //  this.form.virtual = response.data.mployee?.department?.virtual || "";
    this.form.login = response.data.login || "";
   //  this.form.roles = roleOptions.value; //加载用户的角色信息 11.1修改为以下格式
   this.form.roles = response.roles || ""; //组件绑定的form.roles 中options :value=item.roleId, 因此传入的数据需要保证为roleId组成的数组
    console.log('form.roles=', this.form.roles);
    console.log('update res=', response);
    
    this.form.companyId = response.data.companyId || "";
  });
};
/**提交修改用户信息弹出框 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};

getDeptTree();
getCompTree();
// getAllRole();
getList();
</script>

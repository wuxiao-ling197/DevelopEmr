<template>
   <div class="app-container">
      <!-- 搜索框 -->
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
         <el-form-item label="部门名称" prop="name">
            <el-input
               v-model="queryParams.name"
               placeholder="请输入部门名称"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <!-- <el-form-item label="状态" prop="available">
            <el-input v-model="queryParams.available" placeholder="部门状态" clearable style="width: 200px">
            </el-input>
         </el-form-item> -->
         <el-form-item label="状态" prop="available">
                  <el-select
                     v-model="queryParams.available"
                     placeholder="状态"
                     clearable
                     style="width: 240px"
                  >
                     <el-option :key="true" label="正常" :value="true"></el-option>
                     <el-option :key="false" label="停用" :value="false"></el-option>
                  </el-select>
               </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:dept:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="info"
               plain
               icon="Sort"
               @click="toggleExpandAll"
            >展开/折叠</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 表格数据 -->
      <el-table
         v-if="refreshTable"
         v-loading="loading"
         :data="deptList"
         row-key="id"
         :default-expand-all="isExpandAll"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
         <el-table-column prop="name.zh_CN" label="部门名称" width="180"></el-table-column>
         <el-table-column prop="code" label="部门编码" width="120"></el-table-column>
         <el-table-column prop="virtual" label="虚拟部门" width="160">
            <template #default="scope"> 
               <el-switch v-model="scope.row.virtual" disabled ></el-switch>
               {{ scope.row.virtual ? '虚拟' : '非虚拟' }}
            </template>
         </el-table-column>
         <el-table-column prop="active" label="状态" width="120">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.active" />
               <el-switch v-model="scope.row.active" disabled></el-switch>
               {{ scope.row.active ? '已启用' : '停用' }}
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createDate" width="200">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createDate) }}</span>
            </template>
         </el-table-column>
         <el-table-column prop="available" label="是否弃用" width="100">
            <template #default="scope">
               <el-switch v-model="scope.row.available" disabled style="--el-switch-on-color: #13ce66;"
></el-switch>
               {{ scope.row.available ? '否' : '是' }}
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
               <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">新增</el-button>
               <el-button v-if="scope.row.parentId != 0" link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <!-- 添加或修改部门对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form ref="deptRef" :model="form" :rules="rules" label-width="80px">
            <el-row>
               <el-col :span="24" v-if="form.parentId !== 0">
                  <el-form-item label="上级部门" prop="parentId">
                     <el-tree-select
                        v-model="form.parentId"
                        :data="deptOptions"
                        :props="{ value: 'id', label: 'completeName', children: 'children' }"
                        value-key="id"
                        placeholder="选择上级部门"
                        check-strictly
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门名称" prop="name">
                     <el-input v-model="form.name" placeholder="请输入部门名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门编码" prop="code">
                     <el-input-number v-model="form.code" controls-position="right" :min="0" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="负责人" prop="dutyId">
                     <el-input v-model="form.dutyId" placeholder="请输入负责人" maxlength="20" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门属性" prop="property">
                     <el-input v-model="form.property" placeholder="请输入部门属性" maxlength="11" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="虚拟部门" prop="virtual" width="120px">
                     <template #default="scope">
                        <el-switch v-model="scope.row.virtual" style="padding-right: 10px;"></el-switch>{{ scope.row.virtual ? '是'  : '否' }}
                     </template>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门状态">
                     <el-radio-group v-model="form.available">
                        <el-radio
                           v-for="dict in sys_normal_disable"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Dept">
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import { ref } from "vue";

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const deptList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const deptOptions = ref([]);
const isExpandAll = ref(false);
const refreshTable = ref(true);

const data = reactive({
  form: {},
  queryParams: {
   //  pageNum: 1,
   //  pageSize: 10,
   //  parentId: undefined,
    name: undefined,
   //  dutyId: undefined,
   //  code: undefined,
   //  virtual: undefined,
    available: undefined
  },
  rules: {
   //  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    code: [{ required: true, message: "部门编码不能为空", trigger: "blur" }],
   //  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
   //  phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询部门列表 */
function getList() {
  loading.value = true;
  listDept(queryParams.value).then(response => {
    deptList.value = proxy.handleTree(response.data, "id");
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    parentId: undefined,
    name: undefined,
    code: undefined,
    dutyId: undefined,
    virtual: undefined,
    available: true
  };
  proxy.resetForm("deptRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd(row) {
  reset();
  listDept().then(response => {
   console.log("dept add form=", response.data);
   
    deptOptions.value = proxy.handleTree(response.data, "id");
  });
  if (row != undefined) {
    form.value.parentId = row.id;
  }
  open.value = true;
  title.value = "添加部门";
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  listDeptExcludeChild(row.id).then(response => {
    deptOptions.value = proxy.handleTree(response.data, "id");
  });
  getDept(row.id).then(response => {
   console.log("dept update form=", response.data);
    form.value = response.data;
    open.value = true;
    title.value = "修改部门";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["deptRef"].validate(valid => {
    if (valid) {
      if (form.value.deptId != undefined) {
        updateDept(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDept(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项?').then(function() {
    return delDept(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>

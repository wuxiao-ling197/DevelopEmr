<template>
    <div class="app-container">
      <el-scrollbar>
        <!-- 选项卡 -->
        <div>流程管理</div>
        <!-- 进入流程管理页面后，选择流程类型，比如审批， -->
        <el-tabs v-model="activeName"
          class="demo-tabs">
          <el-tab-pane label="新建审批" name="creatApproval">  
            <!-- 按钮区域 -->
            <el-row>
                <div>
                    src\views\emrManage\doctor\elMedicalRecord\process.vue
                </div>
            </el-row>

            <!-- 流程主体表格区域 -->
            <div class='form-des' :key="key" style="margin-top:30px;">
                <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
                </v-form-render>
            </div>

            <!-- 尾部保存按钮区域 -->
            <el-row>
              <el-col :span="24">
                <el-button class="mt-4" style="width: 100%" @click="saveFormEvt('temp')">
                    确定
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="添加成员" name="addMembers">  
            <!-- 按钮区域 -->
            <el-row>
                <div>
                    src\views\emrManage\doctor\elMedicalRecord\process.vue
                </div>
            </el-row>

            <!-- 流程主体表格区域 -->
            <div class='form-des' :key="key" style="margin-top:30px;">
                <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
                </v-form-render>
            </div>

            <!-- 尾部保存按钮区域 -->
            <el-row>
              <el-col :span="24">
                <el-button class="mt-4" style="width: 100%" @click="saveFormEvt('temp')">
                    确定
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
  
      <!-- 我的弹窗组件 -->
      <MyDialog ref="MyDialogRef" 
      :formConf="formConf" 
      :formJson="formJson" 
      :click_cancel="cancelEvt" 
      :click_confirm="confirmEvt"></MyDialog>
    </div>
  </template>
  
  <script setup>
    import MyDialog from '@/components/MyDialog/index.vue'
    import formJson from '../json/checkForm.json'
    const activeName = ref('creatApproval')
    // const formJson = 
  </script>
  
  <style lang="scss" scoped>
  .app-container {
    .records-list {
      height: 460px;
      ::v-deep .el-tabs--left{
        height: 100%!important;
        .el-tabs__header.is-left{
          min-width: 120px;
          .el-tabs__item.is-left {
              text-align: left; 
          }
        }
      }
      // ::v-deep .el-tabs--left .el-tabs__header.is-left{
      //   width: 144px;
      //   .el-tabs--left .el-tabs__item.is-left {
      //       text-align: left; 
      //   }
      // }
      ::v-deep .el-tabs__content{
        height: 100%;
        overflow-y: scroll;
        // overflow-x: hidden;
      }
    }
  
  }
  </style>
  
  
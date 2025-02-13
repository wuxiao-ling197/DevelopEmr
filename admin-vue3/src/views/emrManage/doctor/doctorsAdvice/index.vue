<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content ep-bg-purple">
          <!-- 进入本页面时hi显示当前病历（本次jobid下已有的基本信息和已有payload概览 -->
            <!-- 什么时候显示创建病历，什么时候显示添加记录 -->
          <el-button @click="createMedicalRecordEvt('1')" type="primary">
            添加医嘱
          </el-button>
          <el-button @click="createMedicalRecordEvt('2')" type="primary">
            创建markdown
          </el-button>
        </div>
      </el-col>
    </el-row>

    <div :key="key" style="margin-top:30px;">
      <div>
        医嘱分析
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoctorsAdvice',
  data() {
    return {
      key: 1 // 为了能每次切换权限的时候重新初始化指令
    }
  },
  methods: {
    createMedicalRecordEvt(type){
      console.log(type);
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


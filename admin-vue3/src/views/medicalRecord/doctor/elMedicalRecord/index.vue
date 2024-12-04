<template>
  <div class="app-container">
    <button @click="showDialogEvt">显示弹窗</button>

    <!-- 我的弹窗组件 -->
    <MyDialog ref="MyDialogRef" :form="formData"></MyDialog>

  </div>
</template>

<script>

// 引入我的组件
import MyDialog from '@/components/MyDialog'
import { onMounted, ref } from 'vue';

export default {
  name: 'MedicalRecord',
  components: { MyDialog },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
    }
  },
  setup(){
    const formData = ref({
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });
    const formLabelWidth = ref('40px');
    // 发送请求，初始化表单数据
    const initFormData = async()=>{
      // const res = await getFormDataApi(id);
      // if(!!res && res.code == 200 && res.data){
      //   formData.value = res.data;
      // }
    }
    onMounted(()=>{
      initFormData();
    });
    const updateFormData = (key,value)=>{
      formData.value[key] = value
    }
    return {
      formData,
      formLabelWidth,
      updateFormData
    }
  },
  mounted(){
    
  },
  methods: {
    showDialogEvt() {  
      console.log('2---------------');
      if (this.$refs.MyDialogRef) {  
        console.log(this.$refs.MyDialogRef);
        this.$refs.MyDialogRef.showDialog();  
      } else {
        console.error('MyDialogRef is not yet mounted or does not exist');  
      }  
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>


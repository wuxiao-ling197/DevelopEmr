<template>
  <div class="app-container">
    <button @click="showDialogEvt">显示弹窗</button>

    <!-- 我的弹窗组件 -->
    <MyDialog ref="MyDialogRef"></MyDialog>

  </div>
</template>

<script>
// 引入我的组件
import MyDialog from '../../components/MyDialog'

export default {
  name: 'MedicalRecord',
  components: { MyDialog },
  directives: { },
  data() {
    return {
      key: 1, // 为了能每次切换权限的时候重新初始化指令
    }
  },
  // setup(){
  //   const MyDialogRef = ref(null);
  //   const showDialogEvt = () => {  
  //     console.log('3---------------');
  //     if (MyDialogRef.value) {  
  //       console.log(MyDialogRef.value);
  //       MyDialogRef.value.showDialog();  
  //     } else {
  //       console.error('MyDialogRef is not yet mounted or does not exist');  
  //     }  
  //   };
  //   return {
  //     MyDialogRef,
  //     showDialogEvt
  //   }
  // },
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


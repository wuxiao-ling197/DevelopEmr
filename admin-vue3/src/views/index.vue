<template>
  <div class="app-container home">
    <div class="top">
      <el-card>
        <template #header>
          我的信息
        </template>
        <div class="content">

          nest-admin vue3
        </div>
      </el-card> 
      <el-card>
        <template #header>
          我的业务
        </template>
        
        <div class="content">

        </div>
      </el-card> 
    </div>
    <div class="bottom">
      <el-card>
        <template #header>
          我的待办
        </template>
        <div class="content">

        </div>
      </el-card> 
      <el-card>
        <template #header>
          通知
        </template>
        
        <div class="content">

        </div>
      </el-card> 
      <el-card>
        <template #header>
          日程安排
        </template>
        
        <div class="content">

        </div>
      </el-card>
    </div>
    
  </div>
</template>

<script setup name="Index">
const version = ref('3.8.6')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }
  ul {
    padding: 0;
    margin: 0;
  }
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;
  ul {
    list-style-type: none;
  }
  h4 {
    margin-top: 0px;
  }
  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }
  p {
    margin-top: 10px;
    b {
      font-weight: 700;
    }
  }
  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.app-container{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 59.5%;
    .el-card{
      width: 49.5%;
      height: 100%;
      .content{
        // min-height: 200px;
      }
    }
  }
  .bottom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 39.5%;
    .el-card{
      width: 33%;
      height: 100%;
      .content{
        // min-height: 200px;
      }
    }
  }
}


</style>


<template>
    <div class="top-header">
      <div class="top-header-left">
        <div class="check-header">
          <img src="../../../assets/401_images/401.gif" alt="">
          <div class="check-header-name">{{ header.name }}</div>
        </div>
        <button class="switch-button" @click="confirmSwitch">确认切换</button>
      </div>
      <div class="top-header-right">
        <div class="list-box">
          <span 
            v-for="item in mainContent" :key="item"
            @click = clickPatientEvt(item)
            >
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script>  
  export default {
    name: 'TopHeader',
    data() {
      return {
      }
    },
    props: {
        header:{
            type:Object,
            default:()=>({
                name:'default',
                image:''
            })
        },
        mainContent:{
            type:Array,
            required:true
        }
    },
    computed: {
     
    },
    watch: {
      
    },
    mounted() {
    //   getHeaderInfo();

    },
    methods: {
      // 初始化头像信息
      // 头像是传的，不用这里切换
      getHeaderInfo(){},
      // 点击列表项，切换病号
      clickPatientEvt(item){
        /** 子元素绑定点击事件，传递item的index给父组件
         * 父组件获取到index（或者其他标识）遍历数组获取到被选中的项
         * */ 
        // console.log(item);
        if(!!item.index){
          console.log(item.index);
          this.$emit('click-patient',item.index)
        }
      },
      // 确认切换
      confirmSwitch(){
        this.$emit('confirm-switch')
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
    @import "@/assets/styles/mixin.scss";
    @import "@/assets/styles/variables.module.scss";

   .top-header{
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: $top-header-height;
      justify-content: space-between;
      background: #fff;
      .top-header-left{
        border: 1px solid #ccc;
        // box-shadow: inset 2px 3px 3px #eee;
        // background: lightblue;
        width: 30%;
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        // align-items: center;
        .check-header{
          border: 1px solid #eee;
          border-radius: 5px;
          box-shadow: 2px 3px 3px #eee;
          margin-bottom: 5px;
          width: 60px;
          height: 70%;
          width: 100px;
          background: white;
          img{
            display: block;
            width: 100%;
            height: 70%;
          }
          .check-header-name{
            width: 100%;
            height: 40%;
          }
        }
        button{
          // background: pink;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
          box-shadow: 2px 3px 3px #ccc;
          // padding: 5px 5px 0px;
          flex: 1;
          &:hover{
            background: #ccc;
            border: 1px solid #a3a0a0;
          }
          &:active{
            background: grey;
            border: 2px solid #666;
          }
        }
      }
      .top-header-right{
        width: 70%;
        height: 100%;
        border: 1px solid #ccc;
        box-shadow: inset 2px 3px 3px #eee;
        // background: orange;
        text-align: center;
        overflow-x: hidden;
        .list-box{
          display: flex;
          flex-wrap: wrap;// 换行
          justify-content: flex-start;
          align-items: center;
          align-content: space-around;
          padding-bottom: 10px;
          overflow-x: hidden;
          span{
            cursor: pointer;
            // background: red;
            border: 1px solid #ccc;
            box-shadow: 2px 3px 3px #ccc;
            border-radius: 5px;
            font-size: 14px;
            // color: #fff;
            flex-shrink: 0;// 不压缩
            flex-grow: 0;// 不扩展
            width: 70px;
            height: 30px;
            line-height: 30px;
            margin: 20px 0px 0px 20px;
          }
        }
      }
    }
  </style>
  
  <style lang="scss">
  //reset element css of el-icon-close

  </style>
  
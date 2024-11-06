<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    
    <!-- try start -->
    <TopHeader 
    v-if="topHeaderView"
    :mainContent="patientList"
    :header="currentPatient"
    @click-patient="clickPatientEvt"
    @confirm-switch="confirmSwitchEvt"
    />
    <!-- try end -->
 
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar @setLayout="setLayout" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div> 
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import { AppMain, Navbar, Settings, TagsView } from './components'
import defaultSettings from '@/settings'

// try start
import TopHeader from './components/TopHeader/index.vue'
// try end

import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme);
const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);

// try start
const topHeaderView = computed(() => settingsStore.topHeaderView);
const patientList = ref([
  {
    index: 'pt-001',
    name: '赵四',
    image: '',
    baseInfo: {}
  },{
    index: 'pt-002',
    name: '王舞',
    image: '',
    baseInfo: {}
  },{
    index: 'pt-003',
    name: '刘天宇',
    image: '',
    baseInfo: {}
  },{
    index: 'pt-004',
    name: '萌芽池',
    image: '',
    baseInfo: {}
  },{
    index: 'pt-005',
    name: '典玉玉',
    image: '',
    baseInfo: {}
  }
])
const currentPatient = ref({
  index: 'pt-001',
  name: '赵四',
  image: '',
  baseInfo: {}
})
const tempChoosePatient = {}
function clickPatientEvt(index){
  /**
   * 子组件点击item，传递index，父组件接收到index
   * 遍历list，拿到当前选中病人，可以进行一些选中样式的区分
   * 弹窗，显示病人详情
   * 确定是否切换
   * */
  console.log(index);
  if(!!index){
    tempChoosePatient = patientList.value.find(item => item.index === index);
  }
  // 拿到当前点击用户，弹窗，展示用户信息
  showPatientInfo(index);
}
// 确认切换选中患者
function confirmSwitchEvt(){
  console.log(tempChoosePatient.value);
  currentPatient.value = Object.keys(tempChoosePatient).length > 0 ? tempChoosePatient : currentPatient.value;
  console.log(currentPatient);
  if(Object.keys(tempChoosePatient).length != 0){
    alert('切换成功')
  }else{
    alert('切换失败')
  }
}
// 展示患者用户信息弹窗
function showPatientInfo(item){
  /** 但是不知道传进来的是患者id还是info，
   * 如果是info就直接展示form，
   * 如果是id1就是需要发送请求查询患者详细信息
   * */ 
  alert('展示用户信息弹窗：患者-'+item)
  
  // if(!!item && item instanceof Object){
  //   if(Object.keys(item).length > 0){
  //     // item是对象且不为空，且有id属性
  //     const patientInfo = ref(curInfo)
  //     for(key in item){
  //       if(key in Object.keys(patientInfo.value)){
  //         patientInfo.value[key] = item[key]
  //       }
  //     }
  //   }
  // }else if(typeof item === "string" && !isNaN(parseFloat(item))){
  //   // 是数字
  //   // 发送请求，获取用户信息

  // }
}

// try end


const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watchEffect(() => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice('mobile')
    useAppStore().closeSideBar({ withoutAnimation: true })
  } else {
    useAppStore().toggleDevice('desktop')
  }
})

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false })
}

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/mixin.scss";
  @import "@/assets/styles/variables.module.scss";

  .app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
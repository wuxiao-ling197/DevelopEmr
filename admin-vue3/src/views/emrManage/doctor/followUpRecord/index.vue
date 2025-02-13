<template>
  <div class="app-container">
    <div :key="key" style="margin-top:30px;">
      <div>
        随访记录
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FollowUpRecord',
  components: { },
  data() {
    return {
      key: 1 // 为了能每次切换权限的时候重新初始化指令
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>


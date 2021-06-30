<template>
  <div id="app">
    <router-view></router-view>
    <closeModal />
  </div>
</template>

<script>
import closeModal from '@/components/closeModal'
export default {
  name: 'App',
  components: {
    closeModal
  },
}
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>

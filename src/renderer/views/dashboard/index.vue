<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="3" :offset="2"><div class="grid-content bg-purple"><span id="demo1" @click="routeLink">更新</span></div></el-col>
      <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo2" @click="routeLink">设置</span></div></el-col>
      <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo3" @click="routeLink">修改JSON文件</span></div></el-col>
      <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo4" @click="routeLink">i18n</span></div></el-col>
      <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo5" @click="routeLink">托盘</span></div></el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="3" :offset="2"><div class="grid-content bg-purple"><span id="demo6" @click="routeLink">二进制/文件流</span></div></el-col>
      <!-- <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo7" @click="routeLink">MQTT</span></div></el-col> -->
      <!-- <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo3" @click="routeLink">修改JSON文件</span></div></el-col> -->
      <!-- <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo4" @click="routeLink">i18n</span></div></el-col> -->
      <!-- <el-col :span="3" :offset="1"><div class="grid-content bg-purple"><span id="demo5" @click="routeLink">托盘</span></div></el-col> -->
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'dashboard',
  methods: {
    routeLink(e) {
      console.log(e.currentTarget.id)
      this.$router.push({ path: '/demoPage/' + e.currentTarget.id })
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  line-height: 36px;
  cursor: pointer;
  color: #3a97fa;
}
.el-row {
  margin: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  text-align: center;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #eaf0f5;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

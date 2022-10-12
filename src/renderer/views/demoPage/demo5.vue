<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
		<el-button @click="light" size="mini" :disabled="disable">闪烁</el-button>
	</div>
</template>

<script>
export default {
  data() {
    return {
      disable: false
    }
  },
  created() {
    this.$electron.ipcRenderer.on('disable', (event, data) => {
      console.log(JSON.stringify(data))
      this.disable = data.disable
    })
  },
  methods: {
    toIndex() {
      this.$router.push({ path: '/' })
    },
    light() {
      this.disable = true
      this.$electron.ipcRenderer.send('flash')
    }
  }
}
</script>

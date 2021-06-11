<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
		<el-button @click="clear">清空关闭设置</el-button>
	</div>
</template>

<script>
import { LreItem } from '@/utils/storage'
export default {
  data() {
    return {}
  },
  methods: {
    clear() {
      LreItem('closeChecked')
    },
    toIndex() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

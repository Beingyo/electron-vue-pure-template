<template>
	<div>
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
	},
}
</script>

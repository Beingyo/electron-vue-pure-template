<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},
	created() {
		const m = new Map()

		console.log()
	},
	methods: {
		toIndex() {
			this.$router.push({ path: '/' })
		},
	},
}
</script>

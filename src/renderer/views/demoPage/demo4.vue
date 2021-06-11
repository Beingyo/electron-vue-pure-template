<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
		<el-select v-model="value" @change="changeLaguages">
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
		<div style="font-size: 28px">
			<p>
				{{ $t('language.name') }}
			</p>
		</div>
	</div>
</template>

<script>
import { LgetItem, LsetItem } from '@/utils/storage'
export default {
	data() {
		return {
			value: '',
			options: [
				{
					value: 'zh',
					label: '中文',
				},
				{
					value: 'en',
					label: '英文',
				},
			],
		}
	},
	created() {
		this.value = LgetItem('lang')
	},
	methods: {
		toIndex() {
			this.$router.push({ path: '/' })
		},
		changeLaguages(val) {
			this.$i18n.locale = val
			LsetItem('lang', val)
		},
	},
}
</script>

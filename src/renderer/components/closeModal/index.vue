<template>
	<el-dialog
		title="关闭提示"
		:visible.sync="dialogVisible"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		width="400px"
	>
		<el-radio-group v-model="closeValue">
			<el-radio class="radioStyle" :label="1">最小化到托盘</el-radio>
			<el-radio class="radioStyle" :label="2">退出程序</el-radio>
			<el-checkbox class="radioStyle" v-model="closeChecked">
				不再提醒
			</el-checkbox>
		</el-radio-group>
		<span slot="footer" class="dialog-footer">
			<el-button size="mini" @click="cancel">取 消</el-button>
			<el-button size="mini" type="primary" @click="confirm">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { LgetItem, LsetItem } from '@/utils/storage'
export default {
	data() {
		return {
			dialogVisible: false,
			closeValue: 1,
			closeChecked: false,
		}
	},
	created() {
		this.$electron.ipcRenderer.on('win-close-tips', (event, data) => {
			const closeChecked = LgetItem('closeChecked')
			const isMac = data.isMac
			if (closeChecked || isMac) {
				// event.sender.invoke('win-close', LgetItem('closeValue'))
				this.$electron.ipcRenderer.send('win-close', LgetItem('closeValue'))
			} else {
				this.dialogVisible = true
				// event.sender.invoke('win-focus', this.closeValue)
				this.$electron.ipcRenderer.send('win-focus', this.closeValue)
			}
		})
	},
	destroyed: () => {
		this.$electron.ipcRenderer.removeListener('win-close-tips')
	},
	methods: {
		cancel() {
			this.dialogVisible = false
		},
		async confirm() {
			if (this.closeChecked) {
				LsetItem('closeChecked', true)
				LsetItem('closeValue', this.closeValue)
			}
			await this.$electron.ipcRenderer.send('win-close', this.closeValue)
			this.dialogVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.radioStyle {
	display: block;
	height: 30px;
	line-height: 30px;
}
/deep/ .el-dialog__body {
	padding-bottom: 0;
}
</style>

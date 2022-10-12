<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
		<el-select v-model="value" @change="changeLaguages">
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			>
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
      value: 'zh_CN',
      options: [
        {
          value: 'zh_CN',
          label: '简中'
        },
        {
          value: 'zh_HK',
          label: '繁中'
        },
        {
          value: 'en',
          label: '英文'
        }
      ]
    }
  },
  created() {
    if (LgetItem('lang') !== null) {
      this.value = LgetItem('lang')
    }
  },
  methods: {
    toIndex() {
      this.$router.push({ path: '/' })
    },
    changeLaguages(val) {
      this.$i18n.locale = val
      this.$electron.ipcRenderer.send('changeLanguage', val)
      LsetItem('lang', val)
    }
  }
}
</script>

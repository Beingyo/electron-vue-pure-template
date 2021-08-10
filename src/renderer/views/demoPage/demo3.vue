<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
		<div>
			<h3>JSON数据：</h3>
			<p>{{ msg }}</p>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  created() {
    const fs = require('fs')
    const pathUtil = require('@utils/pathUtil.js')
    const newList = []
    const that = this
    fs.readFile(
      pathUtil.getJsonMockPath('testData.json'),
      'utf8',
      function(err, data) {
        if (err) throw err
        const list = JSON.parse(data)
        that.msg = data
        list.forEach((item) => {
          newList.push(item)
        })
        var newData = {
          date: '2021-06-30',
          name: '老王',
          address: '上海市'
        }
        newList.push(newData)
        const newContent = JSON.stringify(newList)
        fs.writeFile(
          pathUtil.getJsonMockPath('testData.json'),
          newContent,
          'utf8',
          (err) => {
            if (err) throw err
            console.log('success done')
          }
        )
      }
    )
  },
  methods: {
    toIndex() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

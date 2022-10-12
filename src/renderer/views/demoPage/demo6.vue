<template>
	<div>
		<el-button @click="toIndex" size="mini">返回</el-button>
		<br /><br />
	</div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {
    // var fs = require('fs');//文件模块
    // fs.readFile('./AAA.jpg', function(err, data) {
    //   if (err) {
    //       // 错误处理
    //       return;
    //   }
    //   var base64str = new Buffer(data).toString('base64');  // 图片转换为字节
    //   console.log(base64str)
    //   console.log('base64str')
    //   fs.writeFileSync('./copy.jpg', base64str);                // 字节流保存为图片
    // });
  },
  methods: {
    // 返回
    toIndex() {
      this.$router.push({ path: '/' })
    },
    // 读写文本
    readWriteTXT() {
      var readline = require('readline');//读取文件每一行的模块
      var fs = require('fs');//文件模块
      var os = require('os');//一些基本的系统操作函数
      var fReadName = './demo6源文件.txt';//读取的文件
      var fWriteName = './demo6输出文件.txt';//导出文件（可以不新建 没有该文件  系统会帮忙新建）

      var option = { defaultEncoding: 'ANSI'}

      var fRead = fs.createReadStream(fReadName);//创建文件读入流
      var fWrite = fs.createWriteStream(fWriteName);//创建文件写入流

      var objReadline = readline.createInterface({
        input: fRead,//input 为可读流 output为可写流    读取文件流
        terminal: true
      });

      //攻击和属性的修改倍率
      // let power = 2
      objReadline.on('line', (line)=>{
        // ----👇 修改内容 👇----
        // let abc = line.split("L0_II")
        // if(abc[0] == "call "){
        //   let mysstr = abc[1].split(",")
        //   mysstr[2] = String(Number(mysstr[2]) * power)
        //   mysstr[4] = String(Number(mysstr[4]) * power)
        //   mysstr[5] = String(Number(mysstr[5]) * power)
        //   mysstr[6] = String(Number(mysstr[6]) * power)
        //   let result = mysstr.join(",")
        //   abc[1] = result
        //   let nowres = abc.join("L0_II")
        //   fWrite.write(nowres + os.EOL);//写入修改的内容
        // }else{
        //   fWrite.write(line + os.EOL);//写入原样的数据
        // }
        // ----👆 修改内容 👆----
        
        console.log('——————————————line————————————————')
        console.log(line)
        console.log(os.EOL)
        console.log('——————————————line————————————————')
        console.log('||||||||||||||||||||||||||||||||||')
        fWrite.write(line + os.EOL);//写入原样的数据

      });
      objReadline.on('close', ()=>{
        console.log('readline close...(读取关闭)');
      });
    }
  }
}
</script>

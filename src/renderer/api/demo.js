import request from '@/utils/request'

const demo = {
  // 获取串口列表
  getPortList() {
    return request({
      url: '/serialPort/portList',
      method: 'get'
    })
  }
}

export default demo


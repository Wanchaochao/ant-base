import {Err} from '../index'

export class Socket {
  websock
  authData
  clientSendHeartbeat = 0
  serverReplyHeartbeat = 1
  authRequest = 2
  authResponse = 3
  clientSendMsg = 4
  serverReplyAck = 5
  serverReplyMsg = 6
  clientSendReceipt = 7
  serverReplyError = -1

  heartbeatInterval = null
  handler

  init(data, handler) {
    // ws地址
    this.websock = new WebSocket('ws://10.64.146.16:10000/im')
    this.websock.onmessage = this.message.bind(this)
    this.websock.onclose = this.close.bind(this)
    this.websock.onopen = this.open.bind(this)
    this.authData = data
    this.handler = handler
    return this
  }

  open() {
    this.send(this.authData)
  }

  // 数据接收
  message(e) {
    console.info(e)
    if (!e.data) {
      console.info('出错了')
      return
    }

    let receiver = JSON.parse(e.data)

    // 授权成功发送的通知，表示可以正常通行，需要上报心跳了
    if (receiver.op == this.authResponse) {
      this.heartbeatInterval = setInterval(this.heartbeat.bind(this), 6e4)
    } else if (receiver.op == this.serverReplyMsg) {
      // 服务器发送消息过来
      let data = JSON.parse(receiver.body)
      try {
        this.callHandler(data, receiver)
      } catch (e) {
        console.info(data.type + ' 执行函数不存在')
      }
    }
  }

  // 数据发送
  send(data) {
    this.websock.send(JSON.stringify(data))
  }

  // 消息回执
  messageReceipt(message) {
    this.send({
      ...message,
      op: this.clientSendReceipt,
    })
  }

  // 关闭
  close(e) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    console.log('connection closed (' + e.code + ')')
  }

  // 心跳
  heartbeat() {
    this.send({
      op: this.clientSendHeartbeat,
    })
  }

  // 调用处理函数
  callHandler(body, receiver) {
    if (this.handler.hasOwnProperty(body.type)) {
      this.handler[body.type].call(this, body.data, receiver)
    } else {
      throw Err.instance('ws handler not found')
    }
  }
}

export const ws = new Socket()
window['ws'] = ws

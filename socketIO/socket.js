const chat = require('../db/models/chat')

module.exports = function (server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', function (socket) {
    console.log('socket 连接上了')
    // 监听客户端消息
    socket.on('sendMsg', function (data) {
      console.log('接收到客户端发送过来的消息:' + data)
      // 处理客户端发送的数据
      const { from, to, content } = data
      const chat_id = [from, to].sort().join('_')
      const create_time = Date.now()
      const read = false
      new chat({ from, to, content, chat_id, create_time, read }).save((err, chat) => {
        // 向客户端发送消息
        if (chat) {
          io.emit('receiveMsg', chat)
        }
      })
    })
  })
}

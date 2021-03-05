// conn_mongo.js
var mongoose = require('mongoose')
// 连接数据库
mongoose.connect('mongodb://localhost/react-zhipin', { useNewUrlParser: true, useUnifiedTopology: true })

// 创建 连接对象
const conn = mongoose.connection
// 绑定监听
conn.on('connected', function () {
  console.log('数据库连接成功。。。')
})

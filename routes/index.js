var express = require('express')
var router = express.Router()
var md5 = require('blueimp-md5')

require('../db/conn_mongo.js')
const User = require('../db/models/user')
const Chat = require('../db/models/chat')

// 过滤条件
const filter = { password: 0, __v: 0 }

// 注册
router.post('/register', function (req, res) {
  const { username, password, type } = req.body
  // 查询数据库
  User.findOne({ username }, (err, user) => {
    if (user) {
      return res.send({ code: 1, msg: '用户名已存在' })
    }
    new User({ username, password: md5(password), type }).save((err, data) => {
      if (err) {
        return res.send({ code: 1, msg: '注册失败' })
      }
      const { _id, username, type } = data
      res.cookie('userid', _id, { maxAge: 1000 * 60 * 60 * 24 })
      res.send({ code: 0, data: { _id, username, type } })
    })
  })
})

// 登录
router.post('/login', function (req, res) {
  const { username, password } = req.body
  User.findOne({ username, password: md5(password) }, filter, (err, user) => {
    if (!user) return res.send({ code: 1, msg: '不存在的用户名' })
    const { _id } = user
    res.cookie('userid', _id, { maxAge: 1000 * 60 * 60 * 24 })
    return res.send({ code: 0, data: user })
  })
})

// 自动登录
router.get('/user', function (req, res) {
  const id = req.cookies.userid
  User.findById(id, filter, (err, user) => {
    if (!user) return res.send({ code: 1, msg: '该用户不存在' })
    return res.send({ code: 0, data: user })
  })
})

// 更新用户信息
router.post('/update', function (req, res) {
  const id = req.cookies.userid
  console.log(id)
  // 手动删除 cookie 的情形
  if (!id) return res.send({ code: 1, msg: '请重新登录' })
  const user = req.body
  User.findByIdAndUpdate(id, user, function (err, oldUser) {
    if (!oldUser) {
      // 篡改 cookie 的情形
      res.clearCookie('userid') // 清除 cookie
      return res.send({ code: 1, msg: '请重新登录' })
    }
    const { _id, username, type } = oldUser
    res.send({ code: 0, data: Object.assign(user, { _id, username, type }) })
  })
})

// 获取用户列表
router.get('/userlist', (req, res) => {
  const type = req.query.type
  User.find({ type }, filter, (err, users) => {
    if (users) {
      res.send({ code: 0, data: users })
    }
  })
})

// 获取消息列表
router.get('/allchats', (req, res) => {
  const userid = req.cookies.userid
  if (userid) {
    User.find((err, usersData) => {
      if (usersData) {
        let users = {}
        usersData.forEach((user) => (users[user._id] = { avatar: user.avatar, username: user.username }))
        Chat.find({ $or: [{ from: userid }, { to: userid }] }, filter, (err, chats) => {
          if (chats) {
            res.send({ code: 0, data: { users, chats } })
          }
        })
      }
    })
  }
})

// 删除用户数据
router.get('/deleteusers', (req, res) => {
  User.remove((err, data) => {
    if (data) {
      res.send({ code: 0, data: { msg: '已删除所有 users 数据' } })
    }
  })
})

// 删除消息数据
router.get('/deletechats', (req, res) => {
  Chat.remove((err, data) => {
    if (data) {
      res.send({ code: 0, data: { msg: '已删除所有 chats 数据' } })
    }
  })
})

// 修改消息状态为已读
router.post('/read', (req, res) => {
  const { from } = req.body
  const to = req.cookies.userid
  Chat.updateMany({ from, to, read: false }, { read: true }, { multi: true }, (err, count) => {
    if (count) {
      res.send({ code: 0, data: count })
    }
  })
})

module.exports = router

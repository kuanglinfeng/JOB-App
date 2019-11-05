const express = require('express')
const utils  = require('utility')
const Router = express.Router()
const models = require('./model')

const User = models.getModel('user')
const Chat = models.getModel('chat')
const _filter = {'pwd': 0, '__v': 0}
// Chat.remove({}, () => {})
// User.remove({}, function(err,doc){})


Router.get('/list', (req, res) => {

  const {type} = req.query

  User.find({type}, (err, doc) => {
    return res.json({code: 0, data: doc})
  })
})

Router.get('/getmsglist', (req, res) => {
  const user = req.cookies.userid

  User.find({}, (err, userdoc) => {
    let users = {}
    userdoc.forEach(v => {
      users[v._id] = {name: v.user, avatar: v.avatar}
    })
    Chat.find({'$or':[{from: user},{to: user}]}, (err, doc) => {
      if (!err) {
        return res.json({code: 0, msgs: doc, users: users})
      }
    })
  })
  // {'$or': [{from: user, to: user}]}

})

Router.post('/readmsg', (req, res) => {
  const userid = req.cookies.userid
  const {from} = req.body
  Chat.update({from, to:userid}, {'$set': {read: true}}, {'multi': true}, (err, doc) => {
    if (!err) {
      return res.json({code:0, num: doc.nModified})
    }
    return res.json({code:1, msg: '修改失败'})
  })
})

Router.post('/update', (req, res) => {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json.dumps({code: 1})
  }
  const body = req.body
  User.findByIdAndUpdate(userid, body, (err, doc) => {
    const data = Object.assign({}, {
      user: doc.user,
      type: doc.type
    }, body)
    return res.json({code:0, data})
  })
})

Router.post('/login', (req, res) => {
  const {user, pwd} = req.body
  User.findOne({user, pwd:md5Pwd(pwd)}, _filter, (err, doc) => {
    if (!doc) {
      return res.json({code:1, msg: '用户名或密码错误'})
    }
    res.cookie('userid', doc._id)
    return res.json({code: 0, data: doc})
  })
})

Router.post('/modify', (req, res) => {
  const {user, pwd, type, _id} = req.body
  User.findOne({user:user}, (err, doc) => {
    console.log(doc)
  })
})

Router.post('/register', (req, res) => {
  console.log(req.body)
  const {user, pwd, type} = req.body
  User.findOne({user:user}, (err, doc) => {

    if (doc) {
      return res.json({code: 1, msg: '用户名重复'})
    }

    const userModel = new User({user, type, pwd: md5Pwd(pwd)})
    // 保存用户信息
    userModel.save((err, doc) => {
      if (err) {
        return res.json({code: 1, msg: '后端出错了'})
      }
      const {user, type, _id} = doc
      // 设置cookie
      res.cookie('userid', _id)
      return res.json({code: 0, data: {user, type, _id}})
    })


  })
})

Router.get('/info', (req, res) => {
  const {userid} = req.cookies

  // 用户有没有cookie 
  if (!userid) {
    return res.json({code: 1})
  }
  User.findOne({_id: userid}, _filter, (err, doc) => {
    if (err) {
      return res.json({code: 1, msg: '后端出错了'})
    }
    if (doc) {
      return res.json({code: 0, data: doc})
    }
  })
})

// 密码加密
function md5Pwd(pwd) {
  const salt = 'flinn_is_good_3952!3082404@.%'
  return utils.md5(utils.md5(pwd + salt))
}


module.exports = Router
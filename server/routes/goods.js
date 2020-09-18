/**
 * Created by wlp6897 on 2020/9/18.
 */
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

var Goods = require('../models/goods')
// 链接mongoDB数据库
// mongoose.connect('mongodb://root:admin@127.0.0.1:27017')
mongoose.connect('mongodb://127.0.0.1:27017/dumall')

// 链接成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
})

// 链接失败
mongoose.connection.on("error", function () {
  console.log("MongoDB connected error.")
})

// 链接断开
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
})

router.get('/', function (request, response, next) {
  // response.send('hello,goods list')
  Goods.find({}, function (err, doc) {
    if (err) {
      response.json({
        status: '1',
        msg: err.message
      })
    }else{
      response.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

module.exports = router;

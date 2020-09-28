/**
 * Created by wlp6897 on 2020/9/18.
 */
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

var Goods = require('../models/goods')
// 链接mongoDB数据库
// mongoose.connect('mongodb://root:admin@127.0.0.1:27017')
// mongoose.connect('mongodb://127.0.0.1:27017/dumall')
mongoose.connect('mongodb://39.105.50.203:27017/dumall')

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

router.get('/list', function (request, response, next) {
  let page = parseInt(request.param("page"))
  let pageSize= parseInt(request.param("pageSize"))
  let priceLevel= request.param("priceLevel")
  let sort = request.param("sort")
  let skip = (page - 1) * pageSize
  let params = {}
  let priceGt="",priceLte=""
  if(priceLevel!="all"){
    switch (priceLevel) {
      case '0':priceGt= 0;priceLte=100;break;
      case '1':priceGt= 100;priceLte=500;break;
      case '2':priceGt= 500;priceLte=1000;break;
      case '3':priceGt= 1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({"salePrice" : sort})//排序
  goodsModel.exec(function (err, doc) {
    if (err) {
      response.json({
        status: '1',
        msg: err.message
      })
    } else {
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

router.post('/addCart',function(req,res,next){
  let userId = '100000077',productId=req.body.productId;
  let User = require("../models/users");
  User.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    } else{
      // console.log("userDoc:"+userDoc)
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach(function (item){
            if(item.productId===productId){
              goodsItem=item;
              item.productNum++;
            }
        })
        if(goodsItem){
          userDoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:"0",
                msg:"",
                result:"success"
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},function (err1,goodDoc) {
            if(err1){
              res.json({
                status:"1",
                msg:err.message
              })
            }else{
              if(goodDoc){
                console.log(goodDoc)
                goodDoc= {
                  "productId":goodDoc.productId,
                  "productName": goodDoc.productName,
                  "salePrice": goodDoc.salePrice,
                  "productImage": goodDoc.productImage,
                  "productUrl":goodDoc.productUrl,
                  productNum:1,
                  checked:1
                }
                userDoc.cartList.push(goodDoc)
                userDoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:"0",
                      msg:"",
                      result:"success"
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router;

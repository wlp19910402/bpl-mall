var express = require('express');
var router = express.Router();
require('./../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
let User = require("../models/users");
//登录
router.post('/login',function(req,res,next){
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    } else{
      if(userDoc){
        res.cookie("userId",userDoc.userId,{
          path:'/',
          maxAge:1000*60*60
        })
        res.cookie("userName",userDoc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
        // req.session.user = userDoc
        res.json({
          status:'0',
          msg:'',
          result:userDoc
        })
      }else{
        res.json({
          status:"1",
          msg:'用户名或密码错误'
        })
      }
    }
  })
})
//登出接口
router.get("/logout",function(req,res,next){
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  })
  res.cookie("userName","",{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:"",
    result:""
  })
})
//是否登录
router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
})
//查询购物车列表
router.get('/cartList',function (req,res,next) {
  let userId = req.cookies.userId
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
//全中的购物车列表
router.get('/cartList/checked',function (req,res,next) {
  let userId = req.cookies.userId
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc&&doc.cartList){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList.filter(item=>item.checked==='1')
        })
      }
    }
  })
})
//购物车的长度
router.get('/cartList/len',function (req,res,next) {
  let userId = req.cookies.userId
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc&&doc.cartList){
        let len=0;
        doc.cartList.forEach(item=>{
          len+=item.productNum
        })
        res.json({
          status:'0',
          msg:'',
          result:len
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:0
        })
      }
    }
  })
})
//购物车删除
router.post('/cart/del',function(req,res,next){
  let userId = req.cookies.userId,productId= req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  })
})
//编辑购物车列表的商品数量

router.post('/cart/edit',function (req,res,next) {
  let userId = req.cookies.userId,
    productId=req.body.productId,
    productNum=req.body.productNum,
    checked=req.body.checked;
  User.update(
    {"userId":userId,'cartList.productId':productId},
    {'cartList.$.productNum':productNum,'cartList.$.checked':checked},
    function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    }
  )
})

//全选或者取消全选
router.post('/cart/editCheckAll',function(req,res,next){
  var userId=req.cookies.userId,
    checkAll=req.body.checkAll?'1':'0';
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.cartList.forEach(item=>{
          item.checked=checkAll
        })
        doc.save(function(err1,cartDoc){
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'success'
            })
          }

        })
      }
    }
  })
})

//收货地址
router.get('/address/list',function (req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({"userId":userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:[]
        })
      }
    }
  })
})
router.post('/address/default',function (req,res,next) {
  let userId = req.cookies.userId,addressId=req.body.addressId;
  User.findOne({'userId':userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.addressList.forEach(item=>{
          if(item.addressId===addressId){
            item.isDefault=true
          }else{
            item.isDefault=false
          }
        })
        doc.save(function (err1,addressDoc) {
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:"success"
            })
          }
        })
      }else{
        res.json({
          status:'1',
          msg:err1.message,
          result:''
        })
      }
    }
  })
})
router.post('/address/del',function (req,res,next) {
let userId=req.cookies.userId,
  addressId=req.body.addressId;
    User.update({'userId':userId},{$pull:{"addressList":{"addressId":addressId}}},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:"",
          result:"success"
        })
      }
    })
})

router.post('/payment',function (req,res,next) {
  let userId = req.cookies.userId,addressId=req.body.addressId,orderTotal=req.body.orderTotal;
  User.findOne({"userId":userId},function (err,userDoc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let addressInfo='',goodsList=[];
      //获取当前用户订单的收货地址
      userDoc.addressList.forEach(item=>{
        if(item.addressId===addressId){
          addressInfo=item
        }
      })
    //获取订单的商品列表
      userDoc.cartList.forEach(item=>{
        if(item.checked==='1'){
          goodsList.push(item)
        }
      })

      //生成id号和当前系统日期
      let platform='622'
      let r1=Math.floor(Math.random()*100);
      let r2=Math.floor(Math.random()*100);
      let sysDate = new Date()
      let sysDateId = sysDate.Format('yyyyMMddhhmmss')
      let createDate= sysDate.Format('yyyy-MM-dd hh:mm:ss')
      let orderId= platform+r1+sysDateId+r2
      let order={
        "orderId" : orderId,
        "orderTotal" : orderTotal,
        "orderStatus" : '1',
        "createDate" : createDate,
        "goodsList" : goodsList,
        "addressInfo" : addressInfo
      }
      userDoc.orderList.push(order)
      userDoc.save(function(err1,doc){
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:"0",
            msg:"",
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })
    }
  })
})

//根据订单id查询订单信息
router.get('/orderDetail',function (req,res,next) {
  let userId=req.cookies.userId,
    orderId=req.param('orderId');
  User.findOne({"userId":userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        let orderList=''
        doc.orderList.forEach(item=>{
          if(item.orderId===orderId){
            orderList=item
            console.log('dddd')
          }
        })
        res.json({
          status:'0',
          msg:'',
          result:orderList
        })
      }else{
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }
    }
  })
})
module.exports = router;

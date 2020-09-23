var express = require('express');
var router = express.Router();

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
module.exports = router;

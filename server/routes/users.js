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
//
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
module.exports = router;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


let User = require("../models/users");
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
        console.log(res)
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
module.exports = router;

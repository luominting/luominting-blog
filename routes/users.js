var express = require('express');
var router = express.Router();
var User = require('../model/User');
var crypto = require('crypto');

/* GET users listing. */
router.get('/reg', function(req, res, next) {
  res.render('user/register');
});

router.post('/reg',function(req,res,next){
  var username = req.body.username,
      password = req.body.password,
      password_repeat = req.body['password_repeat'];

  if(!username){
    req.flash('error','用户名不能为空');
    return res.redirect('back');
  }

  if(!password || password != password_repeat){

    req.flash('error','密码不一致，请重新输入！');
    return res.redirect('back');
  }
  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');

  var newUser = new User({
      username: username,
      password: password,
      email: req.body.email
  });

  User.get(username,function(err,user){
      if(err){
          req.flash('error','查询出错！');
          return res.redirect('back');
      }else{
          if(user){
              req.flash('error','该用户已存在，请重新输入');
              return res.redirect('back');
          }else{
              newUser.save(function(err,user){
                  if(err){
                    req.flash('err','注册失败');
                    return res.redirect('back');
                  }else{
                    req.session.user = user;
                    req.flash('success','注册成功');
                    res.redirect('/');
                  }
              });
          }
      }
  });

});


module.exports = router;

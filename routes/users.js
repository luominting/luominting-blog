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

router.get('/logout',function(req,res,next){
    req.session.user = null;
    req.flash('success','退出成功');
    res.redirect('/');
});

router.get('/login', function(req, res, next) {
  res.render('user/login');
});

router.post('/login',function(req,res,next){
  var username = req.body.username,
      password = req.body.password;

  if(!username){
    req.flash('error','用户名不能为空');
    return res.redirect('back');
  }

  if(!password){
    req.flash('error','密码不能为空！');
    return res.redirect('back');
  }

  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');

  User.get(username,function(err,user){
      if(err){
          req.flash('error','查询失败');
          return res.redirect('back');
      }else{
          if(user){
              if(user.password == password){
                  req.session.user = user;
                  req.flash('success','登陆成功');
                  return res.redirect('/');
              }else{
                  req.flash('err','用户名或密码错误');
                  return res.redirect('back');
              }
          }else{
              req.flash('error','该用户不存在，请重新输入');
              return res.redirect('back')
          }
      }
  })

});



module.exports = router;

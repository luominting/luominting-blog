var express = require('express');
var router = express.Router();
var User = require('../model/User');
var crypto = require('crypto');

/* GET users listing. */
router.get('/reg', function(req, res, next) {
  res.render('user/reg',res.locals);
});

router.post('/reg', function(req, res, next) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        password_repeat = req.body.password_repeat;

    if(!username){
        req.flash('error','用户名不能为空');
        return res.redirect('back');      //返回当前页面
    }

    if(!password || password != password_repeat){
        req.flash('error','两次输入密码不一致，请重新输入');
        return res.redirect('back');
    }

    var md5 = crypto.createHash('md5'),
    password = md5.update(password).digest('hex');   //加密

    var newUser = new User({
        username:username,
        password:password,
        email: req.body.email
    });
    User.get(username,function(err,user){
        if(err){
            req.flash('error','查询出错');
            return res.redirect('back');
        }else{
            if(user){
                req.flash('error','用户名已存在，请重新输入');
                return res.redirect('back');
            }else{
                newUser.save(function(err,user){
                    if(err){
                        req.flash('error','注册失败');
                        return res.redirect('back');
                    }else{
                        req.session.user = user;
                        req.flash('success','注册成功');
                        res.redirect('/');
                    }
                })
            }
        }
    });

  //res.send(req.body);
  //res.redirect('/');   //重新定向要某个路径从根路径，不是从当前路径）
});

router.get('/login', function(req, res, next) {
    res.render('user/login');
});

router.get('/logout', function(req,res,next){
    req.session.user = null;
    req.flash('success','退出成功');
    res.redirect('/');

});

router.post('/login', function(req, res, next) {
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    User.get(req.body.username, function(err,user){
        if(err){
            req.falsh('error','查询出错');
            return res.rediect('back');
        }else{
            if(user){
                if(user.password != password){
                    req.flash('error','密码不正确，请重新输入');
                    return res.redirect('back');
                }else{
                    req.session.user = user;
                    req.flash('success','登陆成功'+user.username);
                    res.redirect('/');
                }
            }else{
                req.flash('error','用户名不存在，请重新输入');
                return res.redirect('back');
            }
        }
    })
});

module.exports = router;

var express = require('express');
var router = express.Router();
var DateUtil = require('../util/DateUtil');
var Article = require('../model/Article'); 

router.get('/add', function(req, res, next) {
    res.render('article/add',{
        cmd: 'add',
        article: {}
    });
});

router.post('/add',function(req,res, next){
    var title = req.body.title,
    	content = req.body.content,
    	tags = [req.body.tag1,req.body.tag2,req.body.tag3],
    	user = req.session.user,
    	ts = DateUtil.getTime();
    	
    if(!title){
    	req.flash('error','请输入标题');
    	return res.redirect('back');
    }

    if(!content){
    	req.flash('error','内容不能为空哦！');
    	return res.redirect('back');
    }

    var newArticle = new Article({
    	userId: user._id,
    	title:title,
    	content:content,
    	tags: tags,
    	createTime:ts,
    	updateTime:ts
    });

    newArticle.save(function(err,article){
    	if(err){
    		req.flash('error','发表失败，请重试！');
    		return res.redirect('back');
    	}else{
    		req.flash('success','发表成功');
    		res.redirect('/');
    	}
    });
});

module.exports = router;

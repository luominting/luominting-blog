var express = require('express');
var router = express.Router();
var DateUtil = require('../util/DateUtil');
var Article = require('../model/Article');
var settings = require('../settings');

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

router.get('/list/:pageNum/:pageSize',function(req,res,next){
    var num = req.params.pageNum;
    var size = req.params.pageSize;
    var pageNum = num && num > 0 ? parseInt(num) : 1;
    var pageSize = size && size > 0 ? parseInt(size) : settings.pageSize;
    var query = {};
    var searchBtn = req.query.searchBtn;
    if(searchBtn){
        req.session.keyword = req.query.keyword;
    }

    if(req.session.keyword){
        var pattern = new RegExp(req.session.keyword,'i');
        query['title'] = pattern;
    }

    Article.pageQuery(query,{pageNum:pageNum,pageSize:pageSize},function(err,count,articles){
        if(err){
            next(err);
        }else{
            var totalPage = Math.ceil(count/pageSize);
            res.render('index',{
                pageNum: pageNum,
                pageSize: pageSize,
                totalPage: totalPage,
                articles: articles
            });
        }
    })
});

router.get('/view/:articleId',function(req,res,next){
    Article.findById(req.params.articleId,function(err,article){
        res.render('article/view',{
            article:article
        });
    })
});

router.get('/edit/:articleId',function(req,res,next){
    Article.findById(req.params.articleId,function(err,article){
        res.render('article/add',{
            cmd:'edit',
            article: article
        });
    });
});

router.post('/edit',function(req,res,next){
    var content = req.body.content,
        updateTime = DateUtil.getTime();

    if(!content){
        req.flash('error','内容不能为空哦！');
        return res.redirect('back');
    }

    var newArticle = new Article({
        content:content,
        updateTime:updateTime
    });

    newArticle.update(req.body._id,function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }else{
            req.flash('success','更新文章成功');
            res.redirect('/article/view/' + req.body._id);
        }
    });
});

router.get('/delete/:articleId', function(req,res,next){
    Article.deleteById(req.params.articleId,function(err,article){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }else{
            req.flash('success','删除文章成功');
            res.redirect('/');
        }
    });
});

router.post('/addComment',function(req,res,next){
    var _id = req.body._id,
        userId = req.body.userId,
        content = req.body.content;
    Article.addComment(_id,userId,content,function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }else{
            req.flash('success','评论成功');
            res.redirect('/article/view/'+ _id);
        }
    })
});

router.get('/tags',function(req,res,next){
    Article.getTags(function(err,tags){
        if(err){
            next(err);
        }else{
            res.render('article/tags',{
                tags:tags
            });
        }

    });
});

router.get('/tags/:tag',function(req,res,next){
    Article.getTagArticles(req.params.tag,function(err,count,articles){
        if(err){
            next(err);
        }else{
            res.render('index',{
                count:count,
                articles: articles
            });
        }
    });
});


module.exports = router;

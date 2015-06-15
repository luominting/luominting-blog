var mongoose = require('../db');
var markdown = require('markdown').markdown;

var CommentSchema = new mongoose.Schema({
	userId: {type:mongoose.Schema.ObjectId,ref:'User'},
	content:String
});

var articleSchema = new mongoose.Schema({
	userId: {type:mongoose.Schema.ObjectId,ref:'User'},
	title: String,
	content:String,
	createTime: Object,
	updateTime: Object,
	pv: Number,
	tags: [String],
	comments: [CommentSchema]
},{collection:'article'});

var articleModel = mongoose.model('Article',articleSchema);

function Article(article){
	this.userId = article.userId,
	this.title = article.title,
	this.content = article.content,
	this.createTime = article.createTime,
	this.updateTime = article.updateTime,
	this.tags = article.tags
}

Article.prototype.save = function(callback){
	var newArticle = new articleModel({
		userId : this.userId,
		title : this.title,
		content : this.content,
		createTime : this.createTime,
		updateTime : this.updateTime,
		tags : this.tags
	});

	newArticle.save(function(err,article){
		if(err){
			callback(err);
		}else{
			callback(null,article)
		}
	})
};

Article.prototype.update = function(_id,callback){
	articleModel.update({_id:_id},{$set:{content:this.content,updateTime:this.updateTime}},function(err,article){
		if(err){
			return callback(err);
		}else{
			return callback(null,article);
		}
	});
};

Article.pageQuery = function(query,pageInfo,callback){
	// count 查询当前集合的数据条数
	articleModel.count(query,function(err,count){
		var queryCursor = articleModel.find(query).sort({'createTime.ts':-1});
		if(pageInfo && pageInfo.pageNum){
			queryCursor = queryCursor.skip((pageInfo.pageNum-1)*pageInfo.pageSize).limit(pageInfo.pageSize);
		}

		queryCursor.populate('userId').exec(function(err,articles){
			if(err){
				callback(err);
			}else{
				callback(err,count,articles);
			}
		});

	});
};

Article.findById = function(_id,callback){
	articleModel.findOne({_id:_id}).populate('userId').populate('comments.userId').exec(function(err,article){
		if(err){
			return callback(err);
		}else{
			article.content = markdown.toHTML(article.content);
			articleModel.update({_id:_id},{$inc:{'pv':1}},function(err){
				callback(err,article);
			});
		}
	});
};

Article.deleteById = function(_id,callback){
	articleModel.remove({_id:_id},function(err){
		callback(err);
	});
};

Article.addComment = function(_id,userId,content,callback){
	articleModel.update({_id:_id},{$push:{comments:{userId:userId,content:content}}},function(err,ret){
		if(err){
			callback(err);
		}else{
			callback(null,ret);
		}
	});
}

Article.getTags = function(callback){
	articleModel.distinct('tags',function(err,tags){
		callback(err,tags);
	});
};

Article.getTagArticles = function(tag,callback){
	var query = {tags:tag};
	articleModel.count(query,function(err,count){
		articleModel.find(query).sort({'createTime.minute': -1}).populate('userId').exec(function(err,articles){
			if(err){
				callback(err);
			}else{
				callback(err,count,articles);
			}
		});
	});
};
module.exports = Article;
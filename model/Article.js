var mongoose = require('../db');

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

module.exports = Article;
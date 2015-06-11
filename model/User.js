/**
 * Created by luominting on 15/6/11.
 */
var mongoose = require('../db');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avator: String
},{collection:'user'});

var userModel = mongoose.model('User',userSchema);

function User(user){
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}

User.prototype.save = function(callback){
    var md5 = crypto.createHash('md5'),
        emailMd5 = md5.update(this.email.toLowerCase()).digest('hex'),
        avatar = 'http://secure.gravatar.com/avatar/'+emailMd5+'?s=48';

    var newUser = new userModel({
        username: this.username,
        password: this.password,
        email: this.email,
        avatar: avatar
    });

    newUser.save(function(err,user){
        if(err){
            callback(err);
        }else{
            callback(null,user);
        }
    });
};

User.get = function(username,callback){
  userModel.findOne({username:username},function(err,user){
    if(err){
        return callback(err);
    }else{
        callback(null,user);
    }
  });
};

module.exports = User;

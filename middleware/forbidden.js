
/**
 *
 * @param options
 * mustLogin 必须登陆的路径
 * mustNotLogin 必须没登陆的路径
 * @returns {Function}
 */
var url = require('url');
module.exports = function(options){
    if(!options){
        options = {};
    }
    return function(req,res,next){
        var pathname = url.parse(req.url).pathname;
        if(pathname != '/'){
            if(options.mustLogin && new RegExp(pathname,'i').test(options.mustLogin)){
                if(!req.session.user){
                    req.flash('error','你尚未登陆，请登陆!');
                    return res.redirect('/users/login')
                }
            }

            if(options.mustNotLogin && new RegExp(pathname,'i').test(options.mustNotLogin)){
                if(req.session.user){
                    req.flash('error','你已经登陆，不能执行此操作');
                    return res.redirect('back')
                }
            }
        }
        next();
    }
};
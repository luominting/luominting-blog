/**
 * Created by luominting on 15/6/10.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/min-blog');

module.exports = mongoose;

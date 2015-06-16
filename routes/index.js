var express = require('express');
var router = express.Router();
var settings = require('../settings');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/article/list/1');
});

module.exports = router;

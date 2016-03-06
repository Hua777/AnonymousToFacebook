var express = require('express');
var router = express.Router();

var functions = require('../functions.js');
var facebookMysql = require('../facebook-mysql.js');

router.post('/', function (req, res, next) {
    var PostOptions = req.body;
    PostOptions.MainString = functions.StringFixLength(PostOptions.MainString, PostOptions.Mode);
    res.end(JSON.stringify({
        RandomId: facebookMysql.PostToFacebook(PostOptions.MainString, PostOptions.Base64, PostOptions.Mode, req.connection.remoteAddress)
    }));
});

module.exports = router;

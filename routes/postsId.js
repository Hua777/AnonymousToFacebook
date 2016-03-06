var express = require('express');
var router = express.Router();

var kaobei = require('../kaobei.js');
var facebookMysql = require('../facebook-mysql.js');

router.get('/:id', function (req, res, next) {
    facebookMysql.DBConnection.query("SELECT * FROM ?? WHERE ?", [
        kaobei.FanPageEnglishName,
        {
            id: req.params.id
        }
    ], function (error, rows, fields) {
        if (error || rows.length != 1) {
            next();
            return;
        }
        var ThisPost = rows[0];
        var getDataIdArray = ThisPost.postId.split("_");//123_456 to array [123,456]
        var ts_now = Math.floor(new Date() / 1000);
        var ts_post = parseInt(ThisPost.postTime);
        if (ts_now > ts_post) {
            res.render('posts', {
                title: kaobei.FanPageChineseName,
                shortTitle: kaobei.FanPageEnglishName,
                fanpageId: kaobei.FanPageId,
                dataIdHead: getDataIdArray[0],//fanpageId
                dataIdTail: getDataIdArray[1],//postId
                hashTag: "#" + kaobei.FanPageChineseName + ThisPost.id
            });
        } else {
            res.render('countdown', {
                seconds: ts_post - ts_now
            });
        }
    });
});

module.exports = router;

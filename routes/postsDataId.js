var express = require('express');
var router = express.Router();

var kaobei = require('../kaobei.js');
var facebookMysql = require('../facebook-mysql.js');

router.get('/:dataId', function (req, res, next) {
    facebookMysql.DBConnection.query("SELECT * FROM ?? WHERE ?", [
        kaobei.FanPageEnglishName,
        {
            dataId: req.params.dataId
        }
    ], function (error, rows, fields) {
        if (error || rows.length != 1) {
            next();
            return;
        }
        var redirect = "/hashtag/" + rows[0].id;
        res.redirect(redirect);
    });
});

module.exports = router;

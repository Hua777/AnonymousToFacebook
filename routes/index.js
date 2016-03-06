var express = require('express');
var router = express.Router();

var kaobei = require('../kaobei.js');
var themes = require('../themes.js');
var fonts = require('../fonts.js');

router.get('/', function (req, res, next) {
    res.render('index', {
        title: kaobei.FanPageChineseName,
        shortTitle: kaobei.FanPageEnglishName,
        fanpageId: kaobei.FanPageId,
        Themes: themes,
        Fonts: fonts
    });
});

module.exports = router;

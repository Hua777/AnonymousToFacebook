var express = require('express');
var router = express.Router();

var kaobei = require('../kaobei.js');
var functions = require('../functions.js');

router.post('/', function (req, res, next) {
    var DrawOptions = req.body;
    if (functions.ClearlyString(DrawOptions.MainString) == "") {
        DrawOptions.MainString = kaobei.FanPageChineseName;
    }
    DrawOptions.MainString = functions.StringFixLength(DrawOptions.MainString, "photo");
    DrawOptions.SignString = kaobei.FanPageChineseName;
    res.end(JSON.stringify({
        src: functions.StringToCanva(
            800,
            400,
            30,
            DrawOptions.MainString,
            DrawOptions.SignString,
            DrawOptions.Theme,
            DrawOptions.FontFamily,
            80,
            40).toDataURL()
    }));
});

module.exports = router;

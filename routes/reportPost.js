var express = require('express');
var router = express.Router();

var kaobei = require('../kaobei.js');
var facebookMysql = require('../facebook-mysql.js');

router.get('/:dataId', function (req, res, next) {
    var loginCallBack = kaobei.AppLoginCallBack + req.params.dataId;
    if (req.query.code === undefined || req.query.code == "") {
        //FB 登入後會回傳 Code
        var url = facebookMysql.FBConnection.getLoginUrl({
            scope: kaobei.AppLoginScope,
            redirect_uri: loginCallBack
        });
        res.redirect(url);
    } else {
        //利用 Code 轉為 AccessToken 後，轉為 User Id
        facebookMysql.FBConnection.api("/oauth/access_token", 'get', {
            client_id: kaobei.AppId,
            client_secret: kaobei.AppSecret,
            redirect_uri: loginCallBack,
            code: req.query.code
        }, function (fbresAT) {
            if (!fbresAT || fbresAT.error) {
                next();
                return;
            }
            facebookMysql.FBConnection.api("/me", 'get', {
                access_token: fbresAT.access_token
            }, function (fbresUI) {
                if (!fbresUI || fbresUI.error) {
                    next();
                    return;
                }
                facebookMysql.OneReport(fbresUI.id, req.params.dataId, req.connection.remoteAddress);
                res.redirect('/close');
            })
        })
    }
});

module.exports = router;

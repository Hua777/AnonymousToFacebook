var fb = require('fb');
var mysql = require('mysql');

var aboutThisSite = require('./about-this-site.js');
var kaobei = require('./kaobei.js');
var functions = require('./functions.js');

/**
 * 設定 Facebook App 連線
 */
fb.options({
    version: kaobei.AppVersion,
    appId: kaobei.AppId,
    appSecret: kaobei.AppSecret
});
fb.setAccessToken(kaobei.FanPageAccessToken);

/**
 * 與資料庫連線
 */
var connection = mysql.createConnection({
    host: kaobei.DBHost,
    user: kaobei.DBUser,
    password: kaobei.DBPassword,
    database: kaobei.DB
});
connection.connect();

/**
 * 從資料庫更新貼文在 FB 上的 ID
 */
var UpdatePostId = function (_dataId, _postId) {
    connection.query('UPDATE `' + kaobei.FanPageEnglishName + '` SET ? WHERE ?', [{ postId: _postId }, { id: _dataId }], function (error, result) { });
}

/**
 * 送至 Facebook 並 PO 出
 * IP 必須傳入
 */
var PostToFacebook = function (_mainString, _base64, _mode, _ip) {
    var secondsToPost = functions.RandomInt(10, 120);
    var urls = functions.UrlsInString(_mainString);
    var hashtags = functions.HashtagsInString(_mainString);
    var randomId = functions.RandomString(10);
    var shortPostUrl = functions.ShortUrl(aboutThisSite.AnnoyPostUrl + "?" + randomId);
    var shortReportUrl = functions.ShortUrl(aboutThisSite.LoginReportUrl + randomId);

    var ts_now = Math.floor(new Date() / 1000);
    var ts_post = ts_now + secondsToPost + 5;

    var photoUrl = "";
    
    //儲存 Base64 編碼資料為圖片
    if (_mode == "photo") {
        photoUrl = functions.SaveBase64ToPNG(_base64, ts_now);
    }

    //建立一筆資料
    connection.query('INSERT INTO `' + kaobei.FanPageEnglishName + '` SET ?', {
        dataId: randomId,
        postTime: ts_post,
        ip: _ip
    }, function (error, result) {
        if (error) {
            return;
        }

        var insertId = result.insertId;
        var postTitle = "#新" + kaobei.FanPageChineseName + insertId + " 匿名發文: " + shortPostUrl + " 檢舉濫用: " + shortReportUrl;
        var mainMessage = "";
        
        //某秒後送至 FB
        setTimeout(function () {
            mainMessage += postTitle;
            if (_mode == "photo") {
                
                //加入所有 Hashtag
                if (hashtags != null) {
                    mainMessage += "\n\n" + functions.UseCharMergeArray(hashtags, "");
                }
                
                //加入所有 url
                if (urls != null) {
                    mainMessage += "\n\n" + functions.UseCharMergeArray(urls, "\n");
                }
                
                //送出至 FB
                fb.api(kaobei.FanPageId + '/photos', 'post', {
                    message: mainMessage,
                    url: photoUrl
                }, function (res) {
                    if (!res || res.error) {
                        return;
                    }
                    UpdatePostId(insertId, res.post_id);
                });

            } else if (_mode == "message") {
                mainMessage += "\n\n" + _mainString;
                
                //偵測第一個出現在主要字串中的 url
                var firstUrl = "";
                if (urls != null) {
                    firstUrl = urls[0];
                }
                
                //送出至 FB
                fb.api(kaobei.FanPageId + '/feed', 'post', {
                    message: mainMessage,
                    link: firstUrl
                }, function (res) {
                    if (!res || res.error) {
                        return;
                    }
                    UpdatePostId(insertId, res.id);
                });
            }
        }, secondsToPost * 1000);
    });

    return randomId;
}

/**
 * 送出一筆檢舉資料
 */
var OneReport = function (_fbUserId, _dataId, _ip) {
    //檢查是否重複檢舉
    connection.query("SELECT * FROM ?? WHERE ? AND ?", [
        kaobei.ReportDT,
        {
            fbUserId: _fbUserId
        },
        {
            dataId: _dataId
        }
    ], function (error, rows, fields) {
        if (error || rows.length > 0) {
            return;
        }
        var ts_now = Math.floor(new Date() / 1000, 10);
        //新增一筆檢舉資料
        connection.query("INSERT INTO ?? SET ?", [
            kaobei.ReportDT,
            {
                fbUserId: _fbUserId,
                dataId: _dataId,
                reportTime: ts_now,
                ip: _ip
            }
        ], function (error, result) {
            if (error) {
                return;
            }
            //檢查檢舉人數，超標時(5人)刪除貼文
            connection.query("SELECT * FROM ?? WHERE ?", [
                kaobei.ReportDT,
                {
                    dataId: _dataId
                }
            ], function (error, rows, fields) {
                if (error || rows.length < 5) {
                    return;
                }
                //人數超標，取得貼文ID
                connection.query("SELECT * FROM ?? WHERE ?", [
                    kaobei.FanPageEnglishName,
                    {
                        dataId: _dataId
                    }
                ], function (error, rows, fields) {
                    if (error || rows.length != 1) {
                        return;
                    }
                    var postId = rows[0].postId;
                    //刪除貼文相關資料
                    //facebook
                    fb.api("/" + postId, "DELETE", function (fbdelres) {
                        if (!fbdelres || fbdelres.error) {
                            return;
                        }
                    });
                    //datatable kb
                    connection.query("DELETE FROM ?? WHERE ?", [
                        kaobei.FanPageEnglishName,
                        {
                            dataId: _dataId
                        }
                    ], function (error, result) {
                        if (error) {
                            return;
                        }
                    });
                    //datatable report
                    connection.query("DELETE FROM ?? WHERE ?", [
                        kaobei.ReportDT,
                        {
                            dataId: _dataId
                        }
                    ], function (error, result) {
                        if (error) {
                            return;
                        }
                    });
                })
            })
        })
    });
}

module.exports = {
    DBConnection: connection,
    FBConnection: fb,
    PostToFacebook: PostToFacebook,
    OneReport: OneReport
};
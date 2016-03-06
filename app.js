var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/**
 * 路由
 */
var rtIndex = require('./routes/index');
var rtPostsDataId = require('./routes/postsDataId');
var rtPostsId = require('./routes/postsId');
var rtReport = require('./routes/report');
var rtReportPost = require('./routes/reportPost');
var rtReview = require('./routes/review');
var rtSubmit = require('./routes/submit');
var rtClose = require('./routes/close');
var rtError = require('./routes/error');

/**
 * express 模組
 */
var app = express();

/**
 * 網頁模組設定為 ejs 模版
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * 對 app 告知模組
 * 01 - 設定網站 logo
 * 02 - 記錄網站所有資訊
 * 03 - 可解析 post 進來的資料 json
 * 03 - 可解析 post 進來的資料 urlencoded
 * 04 - 可解析 cookie 紀錄
 * 05 - 設定網站根目錄
 */
app.use(favicon(path.join(__dirname, 'public', 'images', 'kaobei.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 用戶請求路徑
 * 伺服器回覆請求
 */
app.use('/', rtIndex);//首頁
app.use('/', rtPostsDataId);//存在於資料庫的資料顯示 dataId
app.use('/hashtag/', rtPostsId);//存在於資料庫的資料顯示 id
app.use('/report/', rtReport);//檢舉濫用此系統發出的貼文
app.use('/reportPost/', rtReportPost);//FB登入後檢舉
app.use('/review', rtReview);//文字化為圖片
app.use('/submit', rtSubmit);//匿名發文
app.use('/close', rtClose);//關閉此畫面
app.use('*', rtError);//不存在或錯誤的畫面

module.exports = app;

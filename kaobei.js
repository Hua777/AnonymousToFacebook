var aboutThisSite = require('./about-this-site.js');

module.exports = {
    FanPageChineseName: "匿名發文專頁名稱",
    FanPageEnglishName: "英文簡稱 連接資料表將使用此名稱",
    FanPageId: "專頁 ID",
    FanPageAccessToken: "你的 FB APP 對你的專頁獲得的 AccessToken",
    AppId: "你的 FB APP ID",
    AppSecret: "你的 FB APP SECRET",
    AppVersion: "v2.5",
    AppLoginCallBack: aboutThisSite.DomainName + "FB 登入後回到的 url FB APP 內也必須設定",
    AppLoginScope: "想取得登入者的相關資料(ex: email)",
    DBHost: "資料庫 Host",
    DBUser: "資料庫 User",
    DBPassword: "資料庫 Password",
    DB: "資料庫名稱",
    ReportDT: "檢舉資料表"
};

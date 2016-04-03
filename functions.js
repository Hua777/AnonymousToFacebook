var syncRequest = require('sync-request');
var canvas = require('canvas');
var path = require('path');
var fs = require('fs');

var aboutThisSite = require('./about-this-site.js');
var fonts = require('./fonts.js');
var themes = require('./themes.js');

/**
 * 將字串擷取制符合長度
 */
var StringFixLength = function (_string, _mode) {
    if (_string == "") {
        return "";
    }
    var maxLength = 0;
    if (_mode == "photo") {
        maxLength = 300;
    } else if (_mode == "message") {
        maxLength = 1024;
    }
    return _string.substr(0, maxLength);
};

/**
 * 把所有類似 url 的字串，從某字串中擷取出來存為陣列
 */
var UrlsInString = function (_string) {
    var tmpRegex = /(https?:\/\/[^\s]+)/g;
    return _string.match(tmpRegex);
};

/**
 * 把所有類似 hashtag 的字串，從某字串中擷取出來存為陣列
 */
var HashtagsInString = function (_string) {
    var tmpRegex = /(^|\W)(#[a-z\d][\w-]*)/ig;
    return _string.match(tmpRegex);
};

/**
 * 亂數產生某長度的字串
 */
var RandomString = function (_length) {
    var result = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < _length; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
};

/**
 * 亂數
 */
var RandomInt = function (_min, _max) {
    return Math.floor(Math.random() * (_max - _min + 1) + _min);
};

/**
 * 將某陣列合併且兩兩加入某字元
 */
var UseCharMergeArray = function (_array, _char) {
    var result = "";
    for (var i = 0; i < _array.length; i++) {
        if (i > 0) {
            result += _char;
        }
        result += _array[i];
    }
    return result;
};

/**
 * 同步執行，從 bit.ly 取得短網址
 */
var ShortUrl = function (_longUrl) {
    var bitlyUrl = "http://api.bit.ly/v3/shorten?longUrl=" + _longUrl + "&login=[USERNAME]&apikey=[APIKEY]]&format=json";
    var result = syncRequest('GET', bitlyUrl);
    var bitlyResult = JSON.parse(result.getBody('utf8'));
    return bitlyResult.data.url;
};

/**
 * 偵測某一字串在某 Font 時所佔據的長與寬
 */
var StringWidthHeight = function (_string, _fontFamilyKey, _fontSize) {
    var tmpCanvas = new canvas(10, 10);
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.textBaseline = "top";
    tmpCtx.font = _fontSize + "px '" + fonts[_fontFamilyKey] + "'";
    var tmpBox = tmpCtx.measureText(_string);
    var result = {
        "width": tmpBox.width,
        "height": tmpBox.actualBoundingBoxDescent - tmpBox.actualBoundingBoxAscent
    }
    return result;
};

/**
 * 將某一字串畫成圖片
 * Params
 *  圖片最小寬度
 *  圖片最小長度
 *  Padding
 *  主要文字，將被畫在正中央
 *  簽名文字，將被畫在右下角
 *  主題 Key，將透過 themes[key] 獲得相關資訊以利畫圖
 *  字體 Key，將透過 fonts[key] 或的正確的字體名稱
 *  主要文字大小
 *  簽名文字大小，通常比主要文字小
 */
var StringToCanva = function (_minWidth, _minHeight, _padding, _mainString, _signString, _themeKey, _fontFamilyKey, _mainFontSize, _signFontSize) {
        
    //首先偵測要被畫的文字長寬
    var mainStringBox = StringWidthHeight(_mainString, _fontFamilyKey, _mainFontSize);
    var signStringBox = StringWidthHeight(_signString, _fontFamilyKey, _signFontSize);

    //開始定義圖片長寬
    if (_minWidth < mainStringBox.width) {
        _minWidth = mainStringBox.width;
    }
    if (_minHeight < mainStringBox.height + signStringBox.height) {
        _minHeight = mainStringBox.height + signStringBox.height;
    }
    _minWidth += _padding * 2;
    _minHeight += _padding * 2;
    
    //建立 Canva 物件
    var resultCanva = new canvas(_minWidth, _minHeight);
    var canvaCtx = resultCanva.getContext('2d');

    //設定背景色
    canvaCtx.fillStyle = themes[_themeKey]["bg"];
    canvaCtx.fillRect(0, 0, _minWidth, _minHeight);
    
    //設定文字基準線
    canvaCtx.textBaseline = "top";
    
    //畫出主文字
    canvaCtx.fillStyle = themes[_themeKey]["text"];
    canvaCtx.font = _mainFontSize + "px '" + fonts[_fontFamilyKey] + "'";
    canvaCtx.fillText(_mainString,
        (_minWidth - mainStringBox.width) / 2,
        (_minHeight - signStringBox.height - mainStringBox.height) / 2);
        
    //畫出簽名文字
    canvaCtx.font = _signFontSize + "px '" + fonts[_fontFamilyKey] + "'";
    canvaCtx.fillText(_signString,
        _minWidth - signStringBox.width - _padding,
        _minHeight - signStringBox.height - _padding);

    return resultCanva;
};

/**
 * 將 Base64 檔案存成 PNG 回傳 URL
 */
var SaveBase64ToPNG = function (_base64, _fileName) {
    var filePath = path.join(__dirname, 'public', 'uploads', _fileName + ".png");
    var urlPath = aboutThisSite.DomainName + "uploads/" + _fileName + ".png";
    _base64 = _base64.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(filePath, _base64, 'base64');
    return urlPath;
}

/**
 * 清除字串多於字元，保持字串乾淨
 */
var ClearlyString = function (_string) {
    return _string.replace(/ /g, "").replace(/\n/g, "");
}

module.exports = {
    StringFixLength: StringFixLength,
    UrlsInString: UrlsInString,
    HashtagsInString: HashtagsInString,
    RandomString: RandomString,
    RandomInt: RandomInt,
    UseCharMergeArray: UseCharMergeArray,
    ShortUrl: ShortUrl,
    StringToCanva: StringToCanva,
    SaveBase64ToPNG: SaveBase64ToPNG,
    ClearlyString: ClearlyString
};

# AnonymousToFacebook
Use Node.js and Facebook Graph API to build this "annonymous to facebook" system.<br/>
<a href="https://nodejs.org/" target="_blank">Node.js</a><br/>
<a href="https://developers.facebook.com/tools/explorer/" target="_blank">Facebook Graph API</a>

# Install
1. Edit these three files

        kaobei.js
        about-this-site.js
        functions.js 內的 shorturl
    
2. Install canvas

        https://github.com/Automattic/node-canvas

3. Enter this project

4. npm install

5. forever start bin/www

# Draw Image
You can also use my API.

        Method: POST,
        URL: http://kbss.ga:81/API/PNG,
        Body: {
            PNGMinWidth: 750,                   //圖片最小寬度
            PNGMinHeight: 300,                  //圖片最小高度
            PNGPadding: 20,                     //圖片 Padding
            PNGBackgroundColor: "#000000",      //背景顏色
            PNGStringColor: "#FFFFFF",          //文字顏色
            MainString: "test",                 //中間位置的主要文字
            SignString: "test",                 //右下角簽名文字
            FontFamilyKey: "微軟正黑粗體",      //字體請參考下面可使用的字體列表
            MainStringFontSize: 70,             //主要文字的大小px
            SignStringFontSize: 30              //簽名文字的大小px
        },
        Response: {
            HeadBase64: "Base64 編碼的圖片包含 data:image/png;base64,"
        } | {
            error: true,
            message: "錯誤訊息"
        }

Get can be used fonts in this API server.

        Method: GET,
        URL: http://kbss.ga:81/API/FONTS,
        Response: {
            Fonts: [
                "微軟正黑粗體"
                ...
            ]
        }

#  Facebook Graph API
Post only message to facebook.

        Method: POST
        URL: /{fanpageid}/feed
        Body: {
            message: 訊息,
            link: 預覽網址
        }

Post photo to facebook.

        Method: POST
        URL: /{fanpageid}/photos
        Body: {
            message: 訊息,
            url: 圖片網址
        }

# bitly short url
Use bitly API to get short url from long url.

        Method: GET
        URL: http://api.bit.ly/v3/shorten?longUrl={1}&login={2}&apikey={3}&format=json";
        //1: 長網址
        //2: bitly使用者名稱
        //3: bitly API Key
        Response: {
            data: {
                url: 短網址
                ...
            }
            ...
        }

# Example
<a href="https://www.facebook.com/toolmanpage/" target="_blank">靠北工具人</a><br/>
<a href="http://toolman.kaobei.ga/" target="_blank">發文系統</a>

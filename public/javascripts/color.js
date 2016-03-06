
var RandomHexColor = function () {
    var hex = "0123456789ABCDEF";
    var ans = "#";
    var i;
    for (i = 0; i < 6; i++) {
        ans += hex[Math.floor(Math.random() * 16)];
    }
    return ans;
}

var ColorfulBgColor = function (_ele) {
    $(_ele).animate({
        backgroundColor: RandomHexColor()
    }, 1000, function () {
        setTimeout(function () {
            ColorfulBgColor(_ele);
        }, 1000);
    });
}

$(function () {
    /*
     *  colorful background
     */
    $(".colorful-background").each(function () {
        ColorfulBgColor($(this));
    });
});
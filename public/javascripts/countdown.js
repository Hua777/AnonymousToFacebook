
var SecondsFormat = function (_seconds) {
    var hours = Math.floor(_seconds / 60 / 60);
    var minutes = Math.floor(_seconds / 60) % 60;
    var seconds = _seconds % 60;
    var result = (hours < 10 ? "0" : "") + hours + "時" + (minutes < 10 ? "0" : "") + minutes + "分" + (seconds < 10 ? "0" : "") + seconds + "秒";
    return result;
}

var CountDown = function (_ele, _seconds) {
    if (_seconds < 0) {
        location.reload();
        return;
    } else {
        $(_ele).text(SecondsFormat(_seconds));
        setTimeout(function () {
            CountDown(_ele, _seconds - 1);
        }, 1000);
    }
}

$(function () {
    CountDown($("#CountDown"), $("#CountDown").attr("data-seconds"));
});
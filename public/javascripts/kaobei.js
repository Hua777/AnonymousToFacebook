
var StrIsEmpty = function (_str) {
    var tmpClearlyStrLength = _str.replace(/ /g, "").replace(/\n/g, "").length;
    if (tmpClearlyStrLength == 0) {
        return true;
    }
    return false;
}

var Redraw = function () {
    var tmpMode = $("[name='mode']:checked").val();
    var tmpMessage = $("#Message").val();
    var tmpTheme = $("#Theme").val();
    var tmpFontFamily = $("#FontFamily").val();
    if (tmpMode == "photo") {
        var DrawOptions = new Object({
            MainString: tmpMessage,
            Theme: tmpTheme,
            FontFamily: tmpFontFamily
        });

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/review',
            data: DrawOptions,
            success: function (req) {
                $("#PhotoReview").attr("src", req.src);
            }
        });
    }
}


$(function () {

    var d_down;
    var d_up;

    Redraw();

    $("[name='mode']").on('change', function () {
        var tmpMode = $(this).val();
        if (tmpMode == "photo") {
            Redraw();
            $("#PhotoPartA").show();
            $("#PhotoPartB").show();
        } else if (tmpMode == "message") {
            $("#PhotoPartA").hide();
            $("#PhotoPartB").hide();
        }
    });

    $("#Theme, #FontFamily").on('change', function () {
        Redraw();
    });

    $("#Message").on('keydown', function () {
        d_down = Date.now();
    });

    $("#Message").on('keyup', function () {
        setTimeout(function () {
            d_up = Date.now();
            if (d_up - d_down >= 240) {
                Redraw();
            }
        }, 250);
    });

    $("#Redraw").on('click', function () {
        Redraw();
    });

    $("#GotoPost").on('click', function () {
        var tmpMode = $("[name='mode']:checked").val();
        var tmpMessage = $("#Message").val();
        var tmpPhoto = $("#PhotoReview").attr("src");

        if (!StrIsEmpty(tmpMessage)) {
            $('#GotoPost').replaceWith('<button type="button" class="col-md-12 post-button" disabled="disabled">執行中...</button>');
            var PostOptions = new Object({
                Mode: tmpMode,
                MainString: tmpMessage,
                Base64: tmpPhoto
            });

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/submit',
                data: PostOptions,
                success: function (req) {
                    window.location.href = "/" + req.RandomId;
                }
            });
        } else {
            $("#Message").focus();
            alert("請輸入內容");
        }

    });

});


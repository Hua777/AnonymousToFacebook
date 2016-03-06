$(function () {
    $("#GotoReport").on('click', function () {
        var dataId = $('#GotoReport').attr("data-id");
        $('#GotoReport').replaceWith('<button type="button" class="col-md-12 post-button" disabled="disabled">執行中...</button>');
        window.location.href = "/reportPost/" + dataId;
    });
});
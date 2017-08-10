$(function () {
    $('.btn').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        CommonUtil.redirectUrl('loan/index.html?v_'+ (new Date().getTime()));
        return false;
    });
});
$(function () {
    $('.btn').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        location.href = 'repay/repay_index.html?v_'+ (new Date().getTime())
        return false;
    });
});
$(function () {
    $('.btn').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        location.href = 'loan/index.html?v_'+ (new Date().getTime())
        return false;
    });
});
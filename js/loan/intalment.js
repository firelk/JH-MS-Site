$(function () {
    $('.box-5 li').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        $.alert('<div class="yzm-fail-error" style="text-align: left;font-size: 0.7rem;line-height: 1rem;">\
            <p>本期本金: ￥160.00</p><p>分期息费: 约￥20.00</p><p>违约金: ￥0.00</p></div>','第1/6期');
        return false;
    });
    $('.btn-submit').on('click',  function(event) {


        CommonUtil.redirectUrl('loan/account-bill.html?v_'+ (new Date().getTime()));
        return false

    });
});
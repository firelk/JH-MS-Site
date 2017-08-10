$(function() {

    // 激活账户
    $('#activate').on('click', function(e) {

        var $form = $('#activate-form');
        if ($form.validator()) {
            $.postJSON('services/ayh/checkwhite', $form.serializeJSON(), function(json) {
                CommonUtil.parseHttpResponse(json, function() {
                    CommonUtil.redirectUrl('activationCheck?auth_no='+json.result.auth_no);
                }, function(errorMsg) {
                    $.error($.empty2def(errorMsg, '验证码错误'));
                });
            });

        }

    });

});
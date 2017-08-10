$(function() {

    // 登录
    $('#login').on('click', function(e) {

        var $form = $('#login-form');
        if ($form.validator()) {
            var data = $form.serializeJSON();
            data.password = sha256_digest(data.password);
            $.postJSON('services/ayh/binding', data, function(json) {
                CommonUtil.parseHttpResponse(json, function() {
                    CommonUtil.replaceUrl(window.REDIRECT_URL || 'loan');
                }, function(errorMsg) {
                    $.error($.empty2def(errorMsg, '登录失败，请重新登录'));
                });
            });
        }

    });

});
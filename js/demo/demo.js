/**
 * Created by jie.ding on 2016/9/26.
 */
$(function(){

    // 验证规则
    var rules = {

        // 银行卡
        bankCardNo : function(value) {
            value = value.replace(/[^\d]*/g, '');
            return /^[\d]{14,19}$/.test(value);
        },

        // 姓名
        name: function(value) {
            return /^[\u4E00-\u9FA5][\u0391-\uFFE5\.]{0,18}[\u4E00-\u9FA5]$/.test(value);
        }
    };

    // 记录所有支持银行卡列表
    window.BANKCARD = [];

    // 银行卡输入事件监听
    $('INPUT[name="bankCardNo"]').on('keyup input', function(e) {
        var $this = $(this);
        var keyCode = e.keyCode || e.which;
        var bankCardNo = $this.val();
        bankCardNo = bankCardNo.replace(/[^\d]*/g, "");
        if ($.inArray(keyCode, [KEYCODE.Tab, KEYCODE.Enter, KEYCODE.Shift, KEYCODE.Ctrl, KEYCODE.Alt,
                KEYCODE.CapsLock, KEYCODE.Esc, KEYCODE.Up, KEYCODE.Down, KEYCODE.Left, KEYCODE.Right]) == -1) {
            // 格式化银行卡号
            if (/^[\d]{4,}$/.test(bankCardNo)) {
                bankCardNo = bankCardNo.replace(/([\d]{4})/g, '$1 ').replace(/[\s]+$/, "");
            }
            $this.val(bankCardNo);
        }
    }).on('blur', function() {
        var bankCardNo = $(this).val();
        bankCardNo = bankCardNo.replace(/[^\d]*/g, "");
        if (rules.bankCardNo(bankCardNo)) {
            // 获得银行卡信息
            var bankInfo = CommonUtil.getBankInfo(bankCardNo);
            // 判断是否获取到银行卡信息
            if (bankInfo) {
                // 判断银行卡长度是否正确
                if (bankInfo['card_number_length'] == bankCardNo.length) {
                    $('#bankCardSupport').val('yes');
                    return;
                } else {
                    $.warn($(this).data('ruleMsg'));
                }
            }
        }
        $('#bankCardSupport').val('');
    });

    // 提交按钮
    $('.button[name="save"]').on('click', function() {
        var $form = $('form');
        if ($form.validator(rules)) {
            var data = $form.serializeJSON();
            data.ident = $('INPUT[name="ident"]').data('value') || data.ident;
            data.bankCardNo = $('INPUT[name="bankCardNo"]').data('value') || data.bankCardNo.replace(/[^\d]*/g, "");
            $.postJSON('services/ayh/saveUserInfo', data, function(json) {
                CommonUtil.parseHttpResponse(json, '保存信息', function(json) {
                    // 成功回调函数
                }, function(errMsg) {
                    // 失败回调函数
                });
            });
        }
    });

});
$(function () {

    var rules = {
        // 姓名
        name: function(value) {
            return /^[\u4E00-\u9FA5][\u0391-\uFFE5\.]{0,18}[\u4E00-\u9FA5]$/.test(value);
        },
        idCard: function(value) {
            return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(value);
        },
        bankCard: function(value) {
            return /^[\d]{14,19}$/.test(value);
        }
    }

    // 缓存验证码串号
    var captchaId = '';
    $('.sms-code').click(function () {
        var $this = $(this);
        var $valid = $('.validator');
        if ($valid.validator(rules)) {
            var $form = $('#add-card-form');
            var data = $form.serializeJSON();
            var idCard=$("input[name='id_number']").val();
            var params= {
                identity_card:{real_name:data.real_name,number:idCard},
                bankcard:{phone_number:data.phone_number,deposit_bank_province_code:data.deposit_bank_province_code,deposit_bank_city_code:data.deposit_bank_city_code,number:data.number}
            };
            $.postJSON('services/ayh/bankcardCaptcha', params, function(json) {
                CommonUtil.parseHttpResponse(json, function() {
                    captchaId = json.result.bankcard_captcha_id;
                    $.success('短信验证码已发送至手机，请注意查收', function () {
                        // 设置按钮倒计时
                        $this.countDown();
                        // 清空验证码输入框
                        $('[name="bankcard_captcha"]').val('');
                    });
                }, function(errorMsg) {
                    $.error($.empty2def(errorMsg, '保存信息失败'))
                });
            });
        }
    })

    $('.btn-add-card').on('click', function(e) {
        var idCard=$("input[name='id_number']").val();
        var $form = $('#add-card-form');
        if ($form.validator(rules)) {
            var data = $form.serializeJSON();
            var params = {
                bankcard:{
                    number:data.number,
                    phone_number:data.phone_number,
                    deposit_bank_province_code:data.deposit_bank_province_code,
                    deposit_bank_city_code:data.deposit_bank_city_code
              },
                identity_card: {
                    real_name: data.real_name,
                    number: idCard
                },
                bankcard_captcha:{
                    bankcard_captcha_id:captchaId,
                    bankcard_captcha:data.bankcard_captcha
                }
            };
            $.postJSON('services/ayh/addBankcards', params, function(json) {
                CommonUtil.parseHttpResponse(json, function () {
                    CommonUtil.sessionStorage.set('SET_ADD_CARD', '1');
                    CommonUtil.sessionStorage.set('SET_MAIN_CARD', '1');
                    $.toast('添加主卡成功！',1000,function(){
                        history.go(-1);
                    });
                }, function (errorMsg) {
                    $.error($.empty2def(errorMsg, '保存信息失败'))
                });
            });
        }

    });
    //收不到验证码
    $('.yzm-fail a').click(function(){
        $.alert('<div class="yzm-fail-error" style="text-align: left;font-size: 0.7rem;line-height: 1rem;"><p>短信提交申请已发送到预留手机</p><p>如未收到:<br>1.请确认当前使用的号码为预留手机号码<br>2.请检查短信是否被安全软件拦截</p></div>')
    })
});

/**
 * Created by hua.yang on 2016/9/30.
 */

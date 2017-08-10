$(function() {
    //去空格
    $("input[name='real_name']").change(function() {
        var val = $(this).val();
        $(this).val($.trim(val));
    });
    // 缓存验证码串号
    var captchaId = '';
    $('.sms-code').click(function() {
        var $this = $(this);
        var $valid = $('.validator');
        if ($valid.validator()) {
            var $form = $('#user-info-form');
            var data = {
                openId: $.cookie('openId'),
                // hyId: $.cookie('hyid'),
                hykNo: $.cookie('hykNo'),
                cardNo: $(".cardNo").val(),
                cellphone: $(".cellphone").val(),
                certNo: $(".certNo").val(),
                cardProvinceCode: $(".cardProvinceCode").val(),
                cardCityCode: $(".cardCityCode").val(),
                name: $(".name_text").val()
            }
            console.log('form', data)

            // 四要素鉴权发短信
            $.ajax({
                    url: window._appPath + 'auth4/sms.do',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                })
                .done(function(data) {
                    // var json = JSON.parse(data)
                    var json = data
                    console.log(json)
                    if (json.code == 0) {
                        // $('body').data('id',json.data.data)
                        $.cookie('orderNo', json.data.data, {
                            path: '/'
                        })
                        $('.sms-code').attr({
                            disabled: 'disabled'
                        });
                        window.s = null
                        window.n = 60
                        window.ov = $('.sms-code').val()
                        var sfn = function(value) {
                            window.n--
                                console.log(window.n)
                            $('.sms-code').attr({
                                disabled: 'disabled'
                            }).val('(' + window.n + ')');
                            if (window.n < 1) {
                                clearTimeout(window.s)
                                $('.sms-code').val(window.ov).removeAttr('disabled')

                                return
                            }
                            window.s = setTimeout(function() {
                                sfn(window.n)
                            }, 1000)
                        }
                        sfn()

                        $('#next').removeAttr('disabled')
                    } else {
                        $.alert(json.message)
                    }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        }
    });
    // 
    $.ajax({
            url: window._appPath + 'gethykno.do',
            type: 'POST',
            dataType: 'json',
            data: {
                openId: $.cookie('openId'),
            },
        })
        .done(function(data) {
            // var json = JSON.parse(data)
            var json = data
            console.log(json)
            if (json.code == 0) {
                // $('body').data('id',json.data.data)
                // $.cookie('orderNo',json.data.data,{path:'/'})
                $.cookie('hykNo', json.data.hykno, {
                    path: '/'
                })
                $('.member_number').val(json.data.hykno)
                    // json.data.data.hykno
            }
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

    // 激活账户
    $('#next').on('click', function(e) {
        console.log(11111)
            // 
            // CommonUtil.redirectUrl('loan/loan_step2.html?v_'+ (new Date().getTime()));
        var data = {
                orderNo: $.cookie('orderNo'),
                smsCode: $('.form-yzm').val()
            }
            // 四要素鉴权发短信
        $.post(window._appPath + '/auth4/check.do', data, function(data, textStatus, xhr) {
            /*optional stuff to do after success */
            var json = JSON.parse(data)
            console.log(json)
            if (json.code == 0) {
                location.href = 'loan/loan_step2.html?v_'+ (new Date().getTime())

            } else {
                $.alert(json.message)
            }

        });
        return;


        var $form = $('#user-info-form');
        if ($form.validator()) {
            var data = {
                identity_card: {
                    real_name: $(".name_text").val(),
                    number: $(".card_text").val()
                },
                bankCard: {
                    phone_number: $(".phone_number").val(),
                    number: $(".form-card").val(),
                    deposit_bank_city_code: $("select[name='deposit_bank_city_code']").val(),
                    deposit_bank_province_code: $("select[name='deposit_bank_province_code']").val()
                },
                bankcardCaptcha: {
                    bankcard_captcha_id: captchaId,
                    bankcard_captcha: $(".form-yzm").val()
                }
            }
            data.application_temp_id = CommonUtil.sessionStorage.get('APPLICATION_TEMP_ID');
            console.log(data, '1111')
                // $.postJSON('services/ayh/bankcard', data, function(json) {
                //     CommonUtil.parseHttpResponse(json, function() {
                //         // 缓存身份信息
                //         CommonUtil.redirectUrl(base_url+'?titlebar=1&apply_no='+json.result.applyNo+'&callback='+hrel+'&product_code='+json.result.productCode+'&secret_key='+secret_key+'&x_token='+json.result.token+'&x_application_id='+x_application_id+'&x_client=;;;;;;;;;;;;;;');
                //    }, function(errorMsg) {
                //         if(json.errorCode=="40000007"){//操作超时跳转到借款首页
                //             $.error($.empty2def(errorMsg, '保存信息失败'),function(){
                //                 CommonUtil.redirectUrl('loan');
                //             })
                //         }else{
                //             $.error($.empty2def(errorMsg, '保存信息失败'));
                //         }

            //    });
            // });
        }

    });
    //收不到验证码
    $('.yzm-fail a').click(function() {
            $.alert('<div class="yzm-fail-error" style="text-align: left;font-size: 0.7rem;line-height: 1rem;"><p>短信提交申请已发送到预留手机</p><p>如未收到:<br>1.请确认当前使用的号码为预留手机号码<br>2.请检查短信是否被安全软件拦截</p></div>')
        })
        // member_number
});
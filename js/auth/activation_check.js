$(function () {
    var rules = {
        bankCard: function (value) {
            return /^[\d]{14,19}$/.test(value);
        }
    };

    //借款用途填充
    var purposeHtml="";
    for(var i=0;i<window.PURPOSES.length;i++){
        purposeHtml+='<option value="'+window.PURPOSES[i].code+'">'+window.PURPOSES[i].text+'</option>'
    }
    $('.purpose').append(purposeHtml);

    //去空格
    $("input[name='real_name']").change(function () {
        var val = $(this).val();
        $(this).val($.trim(val));
    });
    // 缓存验证码串号
    var captchaId = '';
    $('.sms-code').click(function () {
        var $this = $(this);
        var $valid = $('.validator');
        if ($valid.validator(rules)) {
            var $form = $('#activate-checkout-form');
            var data = $form.serializeJSON();
            var params = {
                identity_card: {
                    real_name: data.real_name,
                    number: data.idCard
                },
                bankcard: {
                    phone_number: data.phone_number,
                    deposit_bank_province_code: data.deposit_bank_province_code,
                    deposit_bank_city_code: data.deposit_bank_city_code,
                    number: data.number
                }
            };
            $.postJSON('services/ayh/bankcardCaptcha', params, function (json) {
                CommonUtil.parseHttpResponse(json, function () {
                    captchaId = json.result.bankcard_captcha_id;
                    $.success('短信验证码已发送至手机，请注意查收', function () {
                        // 设置按钮倒计时
                        $this.countDown();
                        // 清空验证码输入框
                        $('[name="bankcard_captcha"]').val('');
                    });
                }, function (errorMsg) {
                    $.error($.empty2def(errorMsg, '保存信息失败'))
                });
            });
        }
    })

    $('.btn-activate').on('click', function (e) {
        var $form = $('#activate-checkout-form');
        var val = $('.form-yzm').val();
        var checked=$('#agreement-radio').is(":checked");
        if(!checked){
            $.warn('请同意借款和征信协议');
        }
        if ($form.validator(rules)&&checked) {
            var data = $form.serializeJSON();
            var params = {
                auth_no: authNo,
                identity_card: {
                    real_name: data.real_name,
                    number: data.idCard
                },

                bankcard: {
                    phone_number: data.phone_number,
                    number: data.number,
                    deposit_bank_province_code: data.deposit_bank_province_code,
                    deposit_bank_city_code: data.deposit_bank_city_code
                },
                bankcard_captcha: {
                    bankcard_captcha_id: captchaId,
                    bankcard_captcha: val
                },
                loanPurpose:data.loanPurpose
            };

            $.postJSON('services/ayh/whiteapply', params, function (json) {
                CommonUtil.parseHttpResponse(json, function () {
                    if (json.errorCode == '0') {
                        CommonUtil.redirectUrl('loan/status?id=' + json.result.application_id);
                    }else {
                        $.warn(json.errorMsg);
                    }
                }, function (errorMsg) {
                    $.error($.empty2def(errorMsg, '保存信息失败'))
                });
            });
        }

    });

    //借款用途改变事件

    $('.purpose').change(function(){
        var val=this.value;
        var html=$(this).find('option[value="'+val+'"]').html();
        if(this.value == 0){
            $(this).parent().find('input').val('');

        }else{
            $(this).parent().find('input').val(html);

        }
    });


    //收不到验证码
    $('.yzm-fail a').click(function () {
        $.alert('<div class="yzm-fail-error" style="text-align: left;font-size: 0.7rem;line-height: 1rem;"><p>短信提交申请已发送到预留手机</p><p>如未收到:<br>1.请确认当前使用的号码为预留手机号码<br>2.请检查短信是否被安全软件拦截</p></div>')
    });
    //协议
    $("input[name='real_name']").change(function () {
        var val = $.trim($(this).val());

        if (val !== '') {
            $('.greement-box').find('.loan-agreement').addClass('agreement-act');
            //检测征信
            var idCardVal = $.trim($("input[name='idCard']").val());
            if (idCardVal != '') {
                $('.greement-box').find('.loan-cragreement').addClass('agreement-act');
            } else {
                $('.greement-box').find('.loan-cragreement').removeClass('agreement-act');
            }
        } else {
            $('.greement-box').find('.loan-agreement').removeClass('agreement-act');
            $('.greement-box').find('.loan-cragreement').removeClass('agreement-act');
        }
    }).trigger('change');


    $("input[name='idCard']").change(function () {
        var val = $.trim($(this).val());
        var nameVal = $("input[name='real_name']").val();
        if (nameVal !== '') {
            if (val !== '') {
                $('.greement-box').find('.loan-cragreement').addClass('agreement-act');
            } else {
                $('.greement-box').find('.loan-cragreement').removeClass('agreement-act');
            }
        } else {
            $('.greement-box').find('.loan-cragreement').removeClass('agreement-act');

        }
    }).trigger('change');

//借款协议
    $('.loan-agreement').click(function () {
        var val = $.trim($("input[name='real_name']").val());
        console.log(val)
        if ($(this).hasClass("agreement-act")) {
            $.ajax({
                type: 'post',
                url: "services/ayh/aloan",
                data:{name: val},
                success: function(json){
                    if(json.errorCode!='0'){
                        $.warn(json.errorMsg);
                    }else{
                        $.alert(json.result);
                    }
                }
            });

        } else {

            if (name == '') {
                $.warn('姓名不能为空');
            }

        }
    });
    //征信协议
    $('.loan-cragreement').click(function () {
        var name = $.trim($("input[name='real_name']").val());
        var idNo = $.trim($("input[name='idCard']").val());
        var data = {
            idNo: idNo,
            name: name
        };
        if ($(this).hasClass("agreement-act")) {
            $.ajax({
                type: 'post',
                url: "services/ayh/zxaloan",
                data:data,
                success: function(json){
                    if(json.errorCode!='0'){
                        $.warn(json.errorMsg);
                    }else{
                        $.alert(json.result);
                    }
                }
            });
        } else {
            if (name == '' && idNo == '') {
                $.warn('姓名身份证不能为空');
            }
            if (name == '' && idNo !== '') {
                $.warn('姓名不能为空');
            }
            if (idNo == '' && name !== '') {
                $.warn('身份证不能为空');
            }

        }
    });


});


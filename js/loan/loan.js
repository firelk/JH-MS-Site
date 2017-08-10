$(function () {
    localStorage.setItem('hasTransPwd',RESULT.hasTransPwd);
    var min = RESULT.min_cash_charge_amount, left_amount = Math.floor(RESULT.left_withdraw_amount), value = Math.floor(left_amount / 200) * 100;
    var max=0;//计算额度范围的最大值
    if(left_amount%100==0){
            max=left_amount;
        }else{
        max=(left_amount-left_amount%100);
    }
    if(RESULT.is_overdue==true || RESULT.is_overdue=="true"){//是否逾期
         $('#withdraw').attr("disabled","disabled").addClass("disabled");
         $.alert("输入的金额不能大于最大可用额度");
    }
        // 提款
    $('#withdraw').on('click', function (e) {
        debugger;
            var val = $('.manual-input').val();
            var numberVal=val*1;
            //判断最小值，并且不出现溢缴款
            if((parseFloat(val)<parseFloat(RESULT.minimum_withdraw_amount)) && (parseFloat(RESULT.left_withdraw_amount)<=parseFloat(RESULT.credit_total_amount))){
                $.toast('提款额度最小为'+RESULT.minimum_withdraw_amount,2000,function(){
                    $('.manual-input').val(RESULT.minimum_withdraw_amount);
                    $('.manual-input').trigger("change");
                });
                return false;
            }
            if(numberVal > left_amount){
                $.toast('输入的金额不能大于最大可用额度');
                return false;
            }
            if (val % 100 !== 0) {
                $.toast('请输入不小于100并且是100的倍数的整数',2000,function(){
                        var value=(val-val%100);
                        $('.manual-input').val(value);
                        $('.manual-input').trigger("change"); 
                });
                return false;
            }
            if(val=='0' && (parseFloat(RESULT.left_withdraw_amount)<=parseFloat(RESULT.credit_total_amount))){
                $.toast('提款额度不能为0');
                return false;
            }
            // 是否允许借款
            if (RESULT.is_withdrawable) {
                //判断是否有溢缴款
                if(parseFloat(RESULT.left_withdraw_amount)>parseFloat(RESULT.credit_total_amount)){
                    $.confirm('当前账户有溢缴款，如仅提取溢缴款，直接手动输入0即可',function(){
                        var spill_money=parseFloat(parseFloat(RESULT.left_withdraw_amount)-parseFloat(RESULT.credit_total_amount)).toFixed(2);
                        loan(parseFloat(val)+parseFloat(spill_money));
                    });
                }else{
                    loan(val);
                }
            } else {
                $.error('当前不允许借款，请稍后再试');
            }
        });
        //借款
    function loan(val){
        //判断是否已经存在合同
        console.log(RESULT,000);
        CommonUtil.sessionStorage.set('bank_img',RESULT.bank_img);
        CommonUtil.sessionStorage.set('card_no',RESULT.card_no);
        if ($.isEmpty(RESULT.contract_id)) {
                    //console.log(val)
                        $.postJSON('services/ayh/applications',{cash_amount:val}, function(json) {
                            CommonUtil.parseHttpResponse(json, function() {
                                // 缓存申请单号
                                CommonUtil.sessionStorage.set('APPLICATION_TEMP_ID',json.result.application_temp_id);
                                // 进入第一步
                                CommonUtil.redirectUrl('loan/step1');
                            }, function(errorMsg) {
                                $.error($.empty2def(errorMsg, '获取申请号失败'))
                            });
                        },{contentType: "application/json; charset=UTF-8"});

                } else {
                    // 第二次借款流程
                    CommonUtil.redirectUrl('loan/verify?money=' + parseFloat(val).toFixed(2)+'&contract_id='+RESULT.contract_id+'&repayment_date='+RESULT.repayment_date+'&serviceCharge='+serviceCharge);
                }
        }

    /**
     * 获得贷款金额区间
     */
    var getAmountRange = function(value) {
        $('.manual-input').val(value);
        // 测试创建刻度滑动条
            $('#tickSlider').tickSlider({
            value: value,
            min: 0,
            max: max,
            step:100,
            onChange: function(value) {
                $('.manual-input').val(value);
                var val = value * 1;
                serviceCharge = val * RESULT.cash_charge_rate;
                //serviceCharge = Math.min(Number(RESULT.max_cash_charge_amount), RESULT.service_charge_rate * val);
                if(serviceCharge<=RESULT.min_cash_charge_amount){
                    $('.price-number').text('¥' + RESULT.min_cash_charge_amount.toFixed(2));
                }else if(serviceCharge>=RESULT.max_cash_charge_amount){
                    $('.price-number').text('¥' + RESULT.max_cash_charge_amount.toFixed(2));
                }else{
                    $('.price-number').text('¥' + serviceCharge.toFixed(2));
                }
            }
        });
    };
    getAmountRange(value);
        // 金额变化
        var serviceCharge=0;
        $('.manual-input').change(function () {
            var val = $(this).val() * 1;
            serviceCharge = Math.min(Number(RESULT.max_cash_charge_amount), RESULT.service_charge_rate * val);
            $('.price-number').text('¥' + serviceCharge.toFixed(2));
            $(".tick-slider").remove();
            getAmountRange(val);
        }).trigger('change');

    //刷新
    $('.top-refurbish').click(function(){
        window.location.reload();
    })
});
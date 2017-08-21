$(function () {
    if (CommonUtil.sessionStorage.get('SET_MAIN_CARD') == '1') {
        CommonUtil.sessionStorage.remove('SET_MAIN_CARD');
        console.log(CommonUtil)
        CommonUtil.reloadPage(true);
        return;

    }
    var url=window.location.href;
    var money=CommonUtil.getQueryString(url,"money");
    var serviceCharge=CommonUtil.getQueryString(url,"serviceCharge");
    var contract_id=CommonUtil.getQueryString(url,"contract_id");
    var repayment_date=CommonUtil.getQueryString(url,"repayment_date");
    var laon_data=CommonUtil.sessionStorage.getJSON('LOAN_DATA');//缓存的数据
    var bank_img=CommonUtil.sessionStorage.get('bank_img');
    var card_no=CommonUtil.sessionStorage.get('card_no');
    if(laon_data.money){
        money=laon_data.money;
        serviceCharge=laon_data.serviceCharge;
        contract_id=laon_data.contract_id;
        repayment_date=laon_data.repayment_date;
        CommonUtil.sessionStorage.remove('LOAN_DATA');       
        CommonUtil.redirectUrl('loan/verify?money=' + parseFloat(money).toFixed(2)+'&contract_id='+contract_id+'&repayment_date='+repayment_date+'&serviceCharge='+serviceCharge);
    }
    $(".money").html(money);//还款金额
    $(".service_charge").html(serviceCharge);//手续费
    $(".date").html(repayment_date);//还款日期
    $(".contractId").html(contract_id);//合同号
    $(".icon-zs img").attr("src",bank_img)
    $(".num_n").html(card_no)
//确认交易密码弹窗
    $('.btn-confirm').click(function() {
        //var hasTransPwd=localStorage.getItem('hasTransPwd');
        //if(hasTransPwd && (hasTransPwd.toUpperCase() == 'NO')){
        //    CommonUtil.redirectUrl('pwd/firstSetPwd');
        //    return;
        //}
        $.confirm('<div class="pay-title">请输入交易密码</div><div class="msxf-container" id="paypassword-container"><input maxlength="6" tabindex="1" id="payPassword_rsainput" name="payPassword_rsainput" class="ui-input i-text trader-password" oncontextmenu="return false" onpaste="return false" oncopy="return false" oncut="return false" autocomplete="off" value="" type="password"> <div class="digit-password" tabindex="0"> <i class="active"><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><span class="guangbiao" style="left:0px;"></span></div></div><p class="forget-link"><a href="javascript:void(0)" onclick="findPwd()">忘记交易密码?</a></p>',function(){
            var val=$('.trader-password').val();
            if(val!==''){
                var data={};
                data.cash_amount=money;
                data.contract_id=contract_id;
                data.payment_password= sha256_digest(val);
                console.log(data);
                $.postJSON('services/ayh/second_withdraw', data, function(json) {
                    CommonUtil.parseHttpResponse(json, function() {
                            CommonUtil.redirectUrl('loan/loanSuccess?money=' + data.cash_amount);
                    }, function(errorMsg) {
                        if(json.errorCode=='40012207'){
                            $.error(errorMsg);
                        }
                        else{
                            CommonUtil.redirectUrl('loan/loanFail?msg='+json.errorMsg+'&errorCode=' +json.errorCode);
                        }

                    });
                });
            }else{
                $.error('交易密码不能为空');
            }
        });
        //密码框效果
        $(".i-text").keyup(function()
        {
            var inp_v = $(this).val();
            var inp_l = inp_v.length;
            $(".digit-password").find("i").eq( inp_l ).addClass("active").siblings("i").removeClass("active");
            $(".digit-password").find("i").eq( inp_l ).prevAll("i").find("b").css({"display":"block"});
            $(".digit-password").find("i").eq( inp_l - 1 ).nextAll("i").find("b").css({"display":"none"});

            $(".guangbiao").css({"left":inp_l *43});//光标位置

            if( inp_l == 0)
            {
                $(".digit-password").find("i").eq( 0 ).addClass("active").siblings("i").removeClass("active");
                $(".digit-password").find("b").css({"display":"none"});
                $(".guangbiao").css({"left":0});
            }
            else if( inp_l == 6)
            {
                $(".digit-password").find("b").css({"display":"block"});
                $(".digit-password").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
                $(".guangbiao").css({"left":5 * 43});
            }

        });
    });
  

});
//缓存借款数据
function cacheLoanData(){
        var money=$(".money").html();//还款金额
        var serviceCharge=$(".service_charge").html();//手续费
        var repayment_date=$(".date").html();//还款日期
        var contract_id=$(".contractId").html();//合同号
        var cacheData={"money":money,"serviceCharge":serviceCharge,"contract_id":contract_id,"repayment_date":repayment_date};
        CommonUtil.sessionStorage.setJSON('LOAN_DATA', cacheData);
}
//忘记交易密码
  function findPwd(){
        cacheLoanData();
        CommonUtil.redirectUrl('pwd/findTrpwd?type=1');
}

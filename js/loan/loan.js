$(function(){function a(a){console.log(RESULT,0),CommonUtil.sessionStorage.set("bank_img",RESULT.bank_img),CommonUtil.sessionStorage.set("card_no",RESULT.card_no),$.isEmpty(RESULT.contract_id)?$.postJSON("services/ayh/applications",{cash_amount:a},function(a){CommonUtil.parseHttpResponse(a,function(){CommonUtil.sessionStorage.set("APPLICATION_TEMP_ID",a.result.application_temp_id),CommonUtil.redirectUrl("loan/step1")},function(a){$.error($.empty2def(a,"获取申请号失败"))})},{contentType:"application/json; charset=UTF-8"}):CommonUtil.redirectUrl("loan/verify?money="+parseFloat(a).toFixed(2)+"&contract_id="+RESULT.contract_id+"&repayment_date="+RESULT.repayment_date+"&serviceCharge="+r)}localStorage.setItem("hasTransPwd",RESULT.hasTransPwd);RESULT.min_cash_charge_amount;var t=Math.floor(RESULT.left_withdraw_amount),e=100*Math.floor(t/200),o=0;o=t%100==0?t:t-t%100,1!=RESULT.is_overdue&&"true"!=RESULT.is_overdue||($("#withdraw").attr("disabled","disabled").addClass("disabled"),$.alert("输入的金额不能大于最大可用额度")),$("#withdraw").on("click",function(e){var o=$(".manual-input").val(),n=1*o;return parseFloat(o)<parseFloat(RESULT.minimum_withdraw_amount)&&parseFloat(RESULT.left_withdraw_amount)<=parseFloat(RESULT.credit_total_amount)?($.toast("提款额度最小为"+RESULT.minimum_withdraw_amount,2e3,function(){$(".manual-input").val(RESULT.minimum_withdraw_amount),$(".manual-input").trigger("change")}),!1):n>t?($.toast("输入的金额不能大于最大可用额度"),!1):o%100!=0?($.toast("请输入不小于100并且是100的倍数的整数",2e3,function(){var a=o-o%100;$(".manual-input").val(a),$(".manual-input").trigger("change")}),!1):"0"==o&&parseFloat(RESULT.left_withdraw_amount)<=parseFloat(RESULT.credit_total_amount)?($.toast("提款额度不能为0"),!1):void(RESULT.is_withdrawable?parseFloat(RESULT.left_withdraw_amount)>parseFloat(RESULT.credit_total_amount)?$.confirm("当前账户有溢缴款，如仅提取溢缴款，直接手动输入0即可",function(){var t=parseFloat(parseFloat(RESULT.left_withdraw_amount)-parseFloat(RESULT.credit_total_amount)).toFixed(2);a(parseFloat(o)+parseFloat(t))}):a(o):$.error("当前不允许借款，请稍后再试"))});var n=function(a){$(".manual-input").val(a),$("#tickSlider").tickSlider({value:a,min:0,max:o,step:100,onChange:function(a){$(".manual-input").val(a),(r=1*a*RESULT.cash_charge_rate)<=RESULT.min_cash_charge_amount?$(".price-number").text("¥"+RESULT.min_cash_charge_amount.toFixed(2)):r>=RESULT.max_cash_charge_amount?$(".price-number").text("¥"+RESULT.max_cash_charge_amount.toFixed(2)):$(".price-number").text("¥"+r.toFixed(2))}})};n(e);var r=0;$(".manual-input").change(function(){var a=1*$(this).val();r=Math.min(Number(RESULT.max_cash_charge_amount),RESULT.service_charge_rate*a),$(".price-number").text("¥"+r.toFixed(2)),$(".tick-slider").remove(),n(a)}).trigger("change"),$(".top-refurbish").click(function(){window.location.reload()})});
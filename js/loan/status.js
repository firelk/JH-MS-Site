$(function(){document.createElement("blue");var t=60,e=null,s=function(){$.getJSON("services/ayh/getApplyResult",{application_id:ID},function(t){CommonUtil.parseHttpResponse(t,function(){var a=t.result.apply_status;0==a?setTimeout(s,5e3):-1==a?(e&&clearInterval(e),2==t.result.status.length?($(".status1").removeClass("hide").siblings(".status").addClass("hide"),$('[name="tipMsg"]').text(t.result.apply_msg),$('[name="checkFailTime"]').text(t.result.status[1].created)):($(".status2").removeClass("hide").siblings(".status").addClass("hide"),$('[name="tipMsg"]').text(t.result.apply_msg),$('[name="checkSuccessTime"]').text(t.result.status[1].created),$('[name="withdrawFailTime"]').text(t.result.status[2].created))):1==a&&(e&&clearInterval(e),2==t.result.status.length?($(".status3").removeClass("hide").siblings(".status").addClass("hide"),$('[name="tipMsg"]').html(t.result.apply_msg),$('[name="checkSuccessTime"]').text(t.result.status[1].created)):($(".status4").removeClass("hide").siblings(".status").addClass("hide"),$('[name="tipMsg"]').html(t.result.apply_msg),$('[name="checkSuccessTime"]').text(t.result.status[1].created),$('[name="withdrawSuccessTime"]').text(t.result.status[2].created)))},function(t){setTimeout(s,5e3)})},{loading:!1,error:function(){setTimeout(s,5e3)}})};if("1"==CommonUtil.sessionStorage.get("SET_status_CARD"))return CommonUtil.sessionStorage.remove("SET_status_CARD"),void CommonUtil.redirectUrl("loan/loan");e=setInterval(function(){0==t?t=60:t--,$(".audit-right .time").text(t)},1e3),setTimeout(s,5e3)});
$(function(){$("#activate").on("click",function(t){var e=$("#activate-form");e.validator()&&$.postJSON("services/ayh/checkwhite",e.serializeJSON(),function(t){CommonUtil.parseHttpResponse(t,function(){CommonUtil.redirectUrl("activationCheck?auth_no="+t.result.auth_no)},function(t){$.error($.empty2def(t,"验证码错误"))})})})});
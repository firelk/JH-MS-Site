$(function(){$("#login").on("click",function(o){var n=$("#login-form");if(n.validator()){var i=n.serializeJSON();i.password=sha256_digest(i.password),$.postJSON("services/ayh/binding",i,function(o){CommonUtil.parseHttpResponse(o,function(){CommonUtil.replaceUrl(window.REDIRECT_URL||"loan")},function(o){$.error($.empty2def(o,"登录失败，请重新登录"))})})}})});
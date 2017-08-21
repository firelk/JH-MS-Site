$(function(){
	// if(!$.cookie('openId')){
	// 	$.cookie('openId', 123003, {path:'/'})
	// }
	
	// $.cookie('openId',null,{path:'/'})
	
	// $.cookie('openId', openId, {path:'/'});

	if(CommonUtil.getQueryString(location.href,'openId')){
		var openId = CommonUtil.getQueryString(location.href,'openId') || 135001
		$.cookie('openId', openId, {path:'/'});
	}
	if(CommonUtil.getQueryString(location.href,'openid')){
		var openId = CommonUtil.getQueryString(location.href,'openid') || 135001
		$.cookie('openId', openId, {path:'/'});
	}
	// if(!$.cookie('hyid')){

		new Vue({
			el:'.body',
			data:{},
			created:function(){

				console.log(window._appPath +'gethyid.do')
				this.$http.post(window._appPath +'gethyid.do',{
					'openId':$.cookie('openId')
				},{
				    emulateJSON:true
				}).then(function(res){
					console.log(res.data)
					var json = res.data
					if (json.code ==0) {
						$.cookie('hyid',json.data.hyid, {path:'/'})
					}else{
						$.alert(json.message)
					}

				},function(){})
			}
		})
		// // 获取会员Id
		// $.ajax({
		// 	url: window._appPath +'gethyid.do',
		// 	type: 'post',
		// 	dataType: 'json',
		// 	data: {openId:$.cookie('openId')},
		// })
		// .done(function(data) {
		// 	// var json = JSON.parse(data)
		// 	var json = data
		// 	console.log(json)
		// 	$.cookie('hyid', json.data.hyid, {path:'/'})
		// })
		// .fail(function() {
		// 	console.log("error");
		// })
		// .always(function() {
		// 	console.log("complete");
		// });
		
		// $.post(window._appPath +'gethyid.do', {openId:'123'}, function(data, textStatus, xhr) {
		// 	var json = JSON.parse(data)
		// 	console.log(json)
		// 	$.cookie('hyid',json.data.hyid,{path:'/'})
		// });
	// }
	// $.postForm(window._appPath +'gethyid.do', {openId:'123'}, function(json) {
 //        CommonUtil.parseHttpResponse(json, function() {
 //            captchaId = json.result.bankcard_captcha_id;
 //            $.success('ddd', function () {

 //                // 设置按钮倒计时
 //                $this.countDown();
 //                // 清空验证码输入框
 //                $('[name="bankcard_captcha"]').val('');
 //            });
 //        }, function(errorMsg) {
 //            if(json.errorCode=="40000007"){//操作超时跳转到借款首页
 //                $.error($.empty2def(errorMsg),function(){
 //                    // CommonUtil.redirectUrl('/loan');
 //                })
 //            }else{
 //                $.error($.empty2def(errorMsg));
 //            }
 //        });
 //    },{contentType: "application/json; charset=UTF-8"});
});
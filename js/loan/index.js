$(function() {
	// $('#repayment').on('click', function(event) {
	// 	event.preventDefault();
	// 	/* Act on the event */
	// 	console.log(12223)
	// 	CommonUtil.redirectUrl('pay/pay_password.html?v_'+ (new Date().getTime()));
	// 	// CommonUtil.redirectUrl('activities/active_list.html?v_'+ (new Date().getTime()));
	// });
	$('.btn-huankuan').on('click', function(event) {
		event.preventDefault();
		CommonUtil.redirectUrl('loan/account-bill.html?v_'+ (new Date().getTime()));
	});
	// new Vue({
	// 	el:'#payment', 
	// })
	new Vue({
		el: '#Vueindex',
		data: {
			// needPayAmount: data.data.needPayAmount,
			validAmount: '',
			// firstStmtDate: '',
			pmtDueDate: '',
			stmtDate: '',
			needPay: '',
			shdRepayAmt: '',
			// lastStmtDate: ''
		},
		methods:{
			paymentFn:function(){
				var _this = this;
				// 查询是否经过认证
				this.$http.post(window._appPath + 'face/auth/status/wechat.do', {
					openId: $.cookie('openId')
				},{
				    emulateJSON:true
				}).then(function(res) {
					if (res.data.code == 0) {
						var data = res.data.data || res.data.date
						if (data.status=='Y') {
							CommonUtil.redirectUrl('pay/pay_password.html?v_'+ (new Date().getTime()));
						}else{

							if (data.remainTimes=='N') {// 没有验证过
								alert('您还没有认证，去认证！');
								faceFn()
							}else if (data.remainTimes>0) {
								alert('您认证次数还有'+ data.remainTimes +'次！')
								faceFn()
							}else{
								alert('您认证次数已用完！')
								return false;
							}
							function faceFn(argument) {
								// body...
								$.getJSON(window._appPath + 'face/auth/wechat.do', {openId: $.cookie('openId')}, function(res, textStatus) {
									console.log(res)
									if (res.code == 0) {
										var data = res.data 
										// 活体认证
										CommonUtil.redirectUrl(data.url);
										
									}
								});
							}
							// _this.$http.post(window._appPath + 'face/auth/wechat.do', {
							// 	openId: $.cookie('openId')
							// },{
							//     emulateJSON:true
							// }).then(function(res) {
							// 	if (res.data.code == 0) {
							// 		var data = res.data.data || res.data.date
							// 		// 活体认证
							// 		CommonUtil.redirectUrl(data.url);
									
							// 	}
							// }, function(res) {

							// })
							// CommonUtil.redirectUrl('loan/loan_id_callback.html?v_'+ (new Date().getTime()));
						}
					}else{
						$.alert('稍后再试！')
					}
				}, function(res) {

				})
				
			},
			repaymentFn:function(){
				CommonUtil.redirectUrl('loan/account-bill.html?v_'+ (new Date().getTime()));
			}
		},
		created: function() {
			this.$http.post(window._appPath + 'accountInfo.do', {
				openId: $.cookie('openId')
			},{
			    emulateJSON:true
			}).then(function(res) {
				if (res.data.code == 0) {
					var data = res.data.data || res.data.date
					this.validAmount = data.validAmount.toFixed(2);
					this.pmtDueDate = data.pmtDueDate;
					// this.firstStmtDate = data.firstStmtDate;
					this.needPay = data.needPay.toFixed(2);
					this.shdRepayAmt = data.shdRepayAmt.toFixed(2);
					// this.lastStmtDate = data.lastStmtDate;
					this.stmtDate = data.stmtDate;
				}
			}, function(res) {

			})
		}
	});

	// 获取会员额度
	// 		$.ajax({
	// 			url:,
	// 			type: 'post',
	// 			dataType: 'json',
	// 			data: {openId:$.cookie('openId')},
	// 		})
	// 		.done(function(data) {
	// 			// var json = JSON.parse(data)
	// 			var json = data
	// 			console.log(json)
	// 			if(data.code == 0){
	// 				// $('.validAmount').html(data.data.validAmount.toFixed(2));
	// 				// $('.firstStmtDate').html(data.data.firstStmtDate);
	// 				// $('.needPay').html(data.data.needPay.toFixed(2));
	// 				// $('.lastStmtDate').html(data.data.lastStmtDate);
	// 				var app = new Vue({
	//                   el: '#Vueindex',
	//                   data: {
	//                     // needPayAmount: data.data.needPayAmount,
	//                     validAmount: data.data.validAmount.toFixed(2),
	//                     firstStmtDate: data.data.firstStmtDate,
	//                     needPay: data.data.needPay.toFixed(2),
	//                     lastStmtDate: data.data.lastStmtDate
	//                   }
	//                 });
	// // name	String	是	姓名
	// // idType	String	是	证件类型
	// // idNo	String	是	证件号码
	// // mobile	String	是	手机号
	// // isValid	Int	是	额度账户是否有效
	// // totalAmount	Double	是	账户总额度
	// // validAmount	Double	是	剩余可用额度
	// // firstStmtDate	String	是	首个账单日
	// // needPay	Double	是	全部应还款额
	// // lastStmtDate	String	是	上个账单日

	// 			}

	// 		})
	// 		.fail(function() {
	// 			console.log("error");
	// 		})
	// 		.always(function() {
	// 			console.log("complete");
	// 		});
});
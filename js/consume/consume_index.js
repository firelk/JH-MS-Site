$(function() {
	// $('.history-bill .li1').on('click', function(event) {
	// 	event.preventDefault(); 
	// 	location.href = 'consume/consume_bill.html?v_'+ (new Date().getTime())
	// });
	// $('.history-bill .li2').on('click', function(event) {
	// 	event.preventDefault(); 
	// 	location.href = 'consume/repay_bill.html?v_'+ (new Date().getTime())
	// });
	// 	 openId	String	否	openId	
	// partnerId	String	是	消费的商户标识	
	// orderId	String	否	订单的流水	
	// beginDate	String	是如无orderId则必填	查询起始交易时间（payTime）	yyyy-MM-dd HH:mm:ss
	// endDate	String	是如无orderId则必填	查询结束交易时间（payTime）	yyyy-MM-dd HH:mm:ss
	// status	Int	是	结果	1成功2失败3冲正4撤销
	// page	Int	是	页码	
	// pageSize	Int	是	页数	

	var app = new Vue({
		el: '.main',
		data: {
			totalAmount: '',
			validAmount: '',
			firstStmtDate: '',
			needPay: '',
			lastStmtDate: ''
		},

		methods: {
			xiaofeiFn:function(){
				CommonUtil.redirectUrl('consume/consume_bill.html?v_'+ (new Date().getTime()));
			},
			huankuaiFn:function(){
				// 没接口
				CommonUtil.redirectUrl('consume/repay_bill.html?v_'+ (new Date().getTime()));
			}
		},
		created: function() {
			this.$http.post(window._appPath + 'accountInfo.do', {
				openId: $.cookie('openId')
			},{
				emulateJSON:true
			}).then(function(res) {
				if (res.data.code == 0) {
					var data = res.data.data || res.data.date;
					this.totalAmount = data.totalAmount.toFixed(2);
					this.validAmount = data.validAmount.toFixed(2);
					this.firstStmtDate = data.firstStmtDate;
					this.needPay = data.needPay.toFixed(2);
					this.lastStmtDate = data.lastStmtDate;
				};
			}, function(res) {

			})
		}
	});
	// var app = new Vue({
	// 	el: '.main',
	// 	data: {
	// 		validAmount: '',
	// 		firstStmtDate: '',
	// 		needPay: '',
	// 		lastStmtDate: '',
	// 		list:[]
	// 	},

	// 	methods: {
	// 		// itemFn: function(term, fee, rate, iamt, amt, date, refNo) {
	// 		// 	location.href = 'loan/instalment.html?refNo=' + this.refNo + '&term=' + term + '&fee=' + fee + '&rate=' + rate + '&iamt=' + iamt + '&amt=' + amt + '&date=' + date;
	// 		// }
	// 	},
	// 	created: function() {
	// 		this.$http.post(window._appPath + 'getsaleinfo.do', {
	// 			openId: $.cookie('openId'),
	// 			page: 0,
	// 			pageSize: 20,
	// 		}, {
	// 			emulateJSON: true
	// 		}).then(function(res) {
	// 			console.log(res.data, 111)
	// 			var data = res.data
	// 			console.log(data.data)
	// 			if (data.code == 0) {
	// 				this.list = data.data.salelist
	// 			}
	// 		}, function() {})
	// 	}
	// });
	// $.ajax({
	// 		url: window._appPath + 'getsaleinfo.do',
	// 		type: 'post',
	// 		dataType: 'json',
	// 		data: {
	// 			openId: $.cookie('openId'),
	// 			partnerId: '11111',
	// 			orderId: 1,
	// 			beginDate: CommonUtil.dateFormatFn(new Date().getTime(), 'yyyy-MM-dd'),
	// 			endDate: CommonUtil.dateFormatFn(new Date().getTime(), 'yyyy-MM-dd'),
	// 			status: 1,
	// 			page: 1,
	// 			pageSize: 1,
	// 		},
	// 	})
	// 	.done(function(data) {
	// 		// var json = JSON.parse(data)
	// 		var json = data
	// 		console.log(json)
	// 		if (data.code == 0) {
	// 			var app = new Vue({
	// 				el: '#consumeIndex',
	// 				data: {
	// 					validAmount: data.data.validAmount.toFixed(2),
	// 					firstStmtDate: data.data.firstStmtDate,
	// 					needPay: data.data.needPay.toFixed(2),
	// 					lastStmtDate: data.data.lastStmtDate
	// 				}
	// 			});
	// 		}

	// 	})
	// 	.fail(function() {
	// 		console.log("error");
	// 	})
	// 	.always(function() {
	// 		console.log("complete");
	// 	});
});
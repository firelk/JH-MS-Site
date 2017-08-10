jQuery(function($){

	var app = new Vue({
		el: '.main',
		data: {
			validAmount: '',
			firstStmtDate: '',
			needPay: '',
			lastStmtDate: '',
			list:[]
		},

		methods: {
			// itemFn: function(term, fee, rate, iamt, amt, date, refNo) {
			// 	location.href = 'loan/instalment.html?refNo=' + this.refNo + '&term=' + term + '&fee=' + fee + '&rate=' + rate + '&iamt=' + iamt + '&amt=' + amt + '&date=' + date;
			// }
		},
		created: function() {
			this.$http.post(window._appPath + 'getsaleinfo.do', {
				openId: $.cookie('openId'),
				page: 0,
				pageSize: 20,
			}, {
				emulateJSON: true
			}).then(function(res) {
				console.log(res.data, 111)
				var data = res.data
				console.log(data.data)
				if (data.code == 0) {
					var list = data.data.salelist
					for (var i = 0; i < list.length; i++) {
						list[i].jysj = $.fn.dateFormatFn(list[i].jysj,'yyyy-MM-dd hh:mm:ss')
					};
					this.list = list
				}
			}, function() {})
		}
	});

	// var app = new Vue({
	// 	el: '.main',
	// 	data: {
	// 		totalAmount: '',
	// 		validAmount: '',
	// 		firstStmtDate: '',
	// 		needPay: '',
	// 		lastStmtDate: '',
	// 		page:0,
	// 		pageSize:20,
	// 		salelist:[]
	// 	},

	// 	methods: {
	// 		// itemFn: function(term, fee, rate, iamt, amt, date, refNo) {
	// 		// 	location.href = 'loan/instalment.html?refNo=' + this.refNo + '&term=' + term + '&fee=' + fee + '&rate=' + rate + '&iamt=' + iamt + '&amt=' + amt + '&date=' + date;
	// 		// }
	// 		xiaofeiFn:function(){
	// 			CommonUtil.redirectUrl('consume/consume_bill.html?v_'+ (new Date().getTime()))
	// 		}
	// 	},
	// 	created: function() {
	// 		this.$http.post(window._appPath + 'getsaleinfo.do', {
	// 			openId: $.cookie('openId'),
	// 			page:this.page,
	// 			pageSize:this.pageSize,
	// 		},{
	// 		    emulateJSON:true
	// 		}).then(function(res) {
	// 			if (res.data.code == 0) {
	// 				var data = res.data.data 
	// 				this.totalAmount = data.totalAmount.toFixed(2)
	// 				this.validAmount = data.validAmount.toFixed(2)
	// 				this.firstStmtDate = data.firstStmtDate
	// 				this.needPay = data.needPay.toFixed(2)
	// 				this.lastStmtDate = data.lastStmtDate
	// 				this.salelist = data.salelist

	// 			};
	// 		}, function(res) {

	// 		})
	// 	}
	// });
	
})
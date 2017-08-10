$(function () {
    // 跳转详细页面
    $('.box-2').on('click', '.item', function(event) {
        event.preventDefault();
        /* Act on the event */
        var id = $(this).data('id');
        CommonUtil.redirectUrl('loan/instalment.html?'+ id)
        // location.href = 'loan/instalment.html?'+ id;
    });

    var app = new Vue({
          el: '.main',
          data: {
             refNo:CommonUtil.getQueryString(location.href,'refNo'),
             date:'',
             amt:0,
             list:[]
          },
          methods:{
            itemFn:function(term, fee, rate, iamt, amt, date, refNo){

              CommonUtil.redirectUrl('loan/instalment.html?refNo='+ this.refNo +'&term='+ term + '&fee='+ fee + '&rate='+ rate +'&iamt='+ iamt +'&amt='+ amt +'&date='+ date)
              // location.href = ;
            }
          },
          created:function(){
            var _this = this;
            this.$http.post(window._appPath +'consume/installment/calculate.do',{
                openId: $.cookie('openId'),
                refNo:CommonUtil.getQueryString(location.href,'refNo'),
                amount: CommonUtil.getQueryString(location.href,'amount')
            },{
                emulateJSON:true
            }).then(function(res){
                console.log(res.data,111)
                var data = res.data
                console.log(data.data,'data.data')
                // console.log(data.data.data.amt,'data.data.data.amt')
                if(res.data.code==0){
                  _this.date = data.data.date
                  _this.amt = data.data.amt
                  _this.list = data.data.list
                }
            },function(){})
          }
        });
    
});

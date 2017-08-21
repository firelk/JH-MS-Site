$(function() {
    // $('.box-5 li').on('click',  function(event) {
    //     event.preventDefault();
    //     /* Act on the event */
    //     $.alert('<ul class="model-box" style="text-align: left;font-size: 0.75rem;line-height: 2rem;">\
    //         <li class="bdb1px"><div class="l">本期本金 </div><div class="r">￥<span class="color-red">160.00</span></div></li>\
    //         <li class="bdb1px"><div class="l">分期息费 </div><div class="r">约￥<span class="color-red">20.00</span></div></li>\
    //         <li class=""><div class="l">违约金 </div><div class="r">￥<span class="color-red">0.00</span></div></li></ul>'
    //         ,'第1/6期');
    //     return false;
    // });
    $('.submit').on('click', function(event) {
        CommonUtil.redirectUrl('loan/account-bill.html?v_'+ (new Date().getTime()));
        return false;
    })

    var app = new Vue({
        el: '.main',
        data: {
            refNo: CommonUtil.getQueryString(location.href, 'refNo'),
            term: CommonUtil.getQueryString(location.href, 'term'),
            fee: CommonUtil.getQueryString(location.href, 'fee'),
            rate: CommonUtil.getQueryString(location.href, 'rate'),
            iamt: CommonUtil.getQueryString(location.href, 'iamt'),
            amt: CommonUtil.getQueryString(location.href, 'amt'),
            date: CommonUtil.getQueryString(location.href, 'date'),
            list: []
        },
        methods: {
            clickLiFn: function(amt,term,fee) {

                $.alert('<ul class="model-box" style="text-align: left;font-size: 0.75rem;line-height: 2rem;">\
                    <li class="bdb1px"><div class="l">本期本金 </div><div class="r">￥<span class="color-red">'+ (amt/term).toFixed(2) +'</span></div></li>\
                    <li class="bdb1px"><div class="l">分期息费 </div><div class="r">约￥<span class="color-red">'+ fee +'</span></div></li>\
                    <li class=""><div class="l">违约金 </div><div class="r">￥<span class="color-red">0.00</span></div></li></ul>', '第1/6期');
                return false;
            },
            submitFn: function() {
                var _this = this

                this.$http.post(window._appPath +'consume/installment/confirm.do',{
                    openId: $.cookie('openId'),
                    date: _this.date ,
                    term: _this.term ,
                    refNo:_this.refNo,
                    amount: _this.amt
                },{
                    emulateJSON:true
                }).then(function(res){
                    console.log(res.data,111)
                    var data = res.data
                    // console.log(data.data)
                    if(data.code==0){

                        // $.alert('<ul class="model-box" style="text-align: left;font-size: 0.75rem;line-height: 2rem;">\
                        //     <li class="bdb1px"><div class="l">本期本金 </div><div class="r">￥<span class="color-red">'+ (amt/term).toFixed(2) +'</span></div></li>\
                        //     <li class="bdb1px"><div class="l">分期息费 </div><div class="r">约￥<span class="color-red">'+ fee +'</span></div></li>\
                        //     <li class=""><div class="l">违约金 </div><div class="r">￥<span class="color-red">0.00</span></div></li></ul>', '第1/6期');
                 
                        CommonUtil.redirectUrl('loan/account-bill.html?v_'+ (new Date().getTime()));
                    }
                },function(){})
                return false;

            }
        },
        created: function() {
            for (var i = 0; i < this.term; i++) {
                this.list.push(i + 1)
            }
            console.log(this.term, this.fee, this.rate, this.iamt, this.amt, this.date)
                // this.$http.post(window._appPath +'consume/installment/calculate.do',{
                //     openId: $.cookie('openId'),
                //     refNo:CommonUtil.getQueryString(location.href,'refNo'),
                //     amount: CommonUtil.getQueryString(location.href,'amt')||CommonUtil.getQueryString(location.href,'amount')
                // },{
                //     emulateJSON:true
                // }).then(function(res){
                //     console.log(res.data,111)
                //     var data = res.data
                //     console.log(data.data)
                //     if(data.code==0){
                //         this.date = data.data.date
                //         this.amt = data.data.amt
                //         this.list = data.data.list
                //     }
                // },function(){})
        }
    });

});
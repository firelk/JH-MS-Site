$(function () {
    new Vue({
        el:'.btn-next',
        methods:{
            submitFn:function(){ 
                // // openId  String  是   外部支付平台用户唯一标识openId
                // // cardProvinceCode    String  否   开户银行省编码
                // // cardCityCode    String  否   开户银行市编码
                // // contractName    String  否(非白必填) 联系人姓名
                // // contractPhone   String  否(非白必填) 联系人手机号
                // // address String  否(非白必填) 详细住址信息
                // // authSerialNo    String  是   征信授权流水号
                // purpose 借款用途
                var _t = this;
                        
                    var $valid = $('.user-info-form');
                    if ($valid.validator()) {
                        $('.btn-next').attr('disabled','disabled').html('loading...')

                        setTimeout(function(){
                            $('.btn-next').removeAttr('disabled').html('下一步')
                        },10000)
                        _t.$http.post( window._appPath +'apply.do', {
                            openId:$.cookie('openId'),
                            // cardProvinceCode:'',
                            cardCityCode:$('select[name=countyCode]').val() ,//$('.form-cardCityCode').val()
                            contractName: $('.form-contractName').val(),
                            contractPhone: $('.form-contractPhone').val(),
                            //省市区县
                            provinceCode: $('[name=provinceCode]').val(),
                            provinceName: $('input[name=provinceName]').val(),
                            cityCode: $('[name=cityCode]').val(),
                            cityName: $('input[name=cityName]').val(),
                            zoneCode: $('[name=countyCode]').val(),
                            zoneName: $('input[name=countyName]').val(),
                            // 地址
                            address: $('.form-address').val(),
                            purpose: $('.form-purpose').val(),//请选择借款用途
                            contactRelation: $('.form-contactRelation').val(),//请选择与申请人关系
                            recomendPhone: $('input[name=recomendPhone]').val()
                            // authSerialNo:$.cookie('orderNo'),

                        },{
                            emulateJSON:true
                        }).then(function(res){
                            var data = res.data 
                             console.log(data,1111)
                            if(data.code==0){
                                // if(data.data.status){}
                                // A 通过
                                // N 签署
                                // U 处理中
                                // 其他 拒绝
                                // CommonUtil.redirectUrl('loan/loan_step3.html?v_'+ (new Date().getTime()))
                                CommonUtil.redirectUrl('loan/loan_step2-id.html?v_'+ (new Date().getTime()))
                            }else if(data.code == '10002'){
                                CommonUtil.redirectUrl('loan/loan_step2-id.html?v_'+ (new Date().getTime()));
                                // CommonUtil.redirectUrl('loan/loan_step3.html?v_'+ (new Date().getTime()));
                            }else if(data.code == '101'){
                                $.alert(data.message)
                            }else{
                                $.alert(data.message)
                            }
                        },function(){});
                    }
                // this.$http.post(window._appPath +'consume/installment/calculate.do',{
                //     openId: $.cookie('openId'),
                //     refNo:CommonUtil.getQueryString(location.href,'refNo'),
                //     amount: CommonUtil.getQueryString(location.href,'amount')
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
        },
        created:function(){

        }
    })

});


$(function () {
    new Vue({
        el:'.btn-next',
        methods:{
           
        },
        created:function(){
            CommonUtil.redirectUrl('loan/index.html?v_'+ (new Date().getTime()))
            // var _t = this;
            // _t.$http.post( window._appPath +'/face/auth/wechat/callback.do', {
            //     openId:$.cookie('openId')

            // },{
            //     emulateJSON:true
            // }).then(function(res){
            //     console.log(res)
            //     var data = res.data 
            //     console.log(data,1111)

            //     // if(data.code==0){
            //         CommonUtil.redirectUrl('loan/index.html?v_'+ (new Date().getTime()))
            //     // }
            // },function(){});
        }
    })

});



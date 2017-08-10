$(function () {
    new Vue({
        el:'.btn-next',
        methods:{
            submitFn:function(){ 

                var _t = this;
                var $valid = $('.user-info-form');
                if($('#zsta').attr('src')=='img/shenfenzheng-A.png'){
                    $.alert('身份证人像面');
                    return false;
                }
                if($('#zstb').attr('src')=='img/shenfenzheng-B.png'){
                    $.alert('身份证国徽面');
                    return false;   
                }
                if (1) {
                    $('.btn-next').attr('disabled','disabled').html('loading...')

                    // _t.$http.post( window._appPath +'file/upload.do', {
                    // window._appPath = 'http://192.168.28.248:9090/msxfInterface/'
                    _t.$http.post( window._appPath +'file/upload.do', {
                        openId:$.cookie('openId'),
                        photo_A:$('#zsta').attr('src'),
                        photo_B:$('#zstb').attr('src')

                    },{
                        emulateJSON:true
                    }).then(function(res){
                        // console.log(res)
                        var data = res.data 
                        console.log(data,1111)

                        if(data.code==0){

                            // setInterval(function(){
                                querybtn();
                            // },3000);
                        //     // if(data.data.status){}
                        //     // A 通过
                        //     // N 签署
                        //     // U 处理中
                        //     // 其他 拒绝
                        //     // CommonUtil.redirectUrl('loan/loan_step3.html?v_'+ (new Date().getTime()))
                            // CommonUtil.redirectUrl('loan/loan_step2_1.html?v_'+ (new Date().getTime()))
                        // }else if(data.code == '10002'){
                        //     CommonUtil.redirectUrl('loan/loan_step2_1.html?v_'+ (new Date().getTime()));
                        //     // CommonUtil.redirectUrl('loan/loan_step3.html?v_'+ (new Date().getTime()));
                        // }else if(data.code == '101'){
                        //     $.alert(data.message)
                        // }else{
                        //     $.alert(data.message)
                        }else{

                        // setTimeout(function(){
                            $('.btn-next').removeAttr('disabled').html('提交');
                        // },1000)
                        }
                    },function(){});
                }
 
            }
        },
        created:function(){

        }
    })

});



function querybtn(){
    // if(null == openid || "null" == openid || undefined == openid || '' == openid ){
    //     alert("获取openid失败");
    //     location.reload();
    //     //return ;
    // }

    // var method = "file/uploadStatusQuery.do";
    // var unencrypted_data = '{"openId":"'+openid+'"}';
    var data = {
        // "method" : method,
        // "version" : version,
        openId:$.cookie('openId')
        // "timestamp" : timestamp,
        // "data" : unencrypted_data
    };
    var port_url = window._appPath +"file/uploadStatusQuery.do";
    $.ajax({
        type: "POST",
        url:port_url,
        timeout : 120000,
        data: data,
        error: function(response) {
           alert("连接错误,请稍后再试", {time : 1000});
           // location.reload();
        },
        success: function(response) {
            // if (response.code == -1||(response.code >= 10052&&response.code <= 10099)) {
            //     alert(response.message);
            //     location.reload();
            // }
            //             "data":{"uploadFileStatus":"1"},"code":"0"}
            // uploadFileStatus：-1 未上传 0 正在上传 1上传成功
                console.log(response)
            if (response.code == 0) {
                if (response.data.uploadFileStatus == 1) {
                    // 阅读协议
                    window.location.href="loan/loan_step2_1.html";
                }
                
            } else {
                setTimeout(function(){
                    querybtn();
                },1000)
                // alert(response.message);
                // location.reload();
            }
        }
    });
}
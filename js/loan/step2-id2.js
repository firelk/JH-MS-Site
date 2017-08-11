$(function () {
    new Vue({
        el:'.btn-next',
        methods:{
            submitFn:function(){ 

                var _t = this;
                var $valid = $('.user-info-form');
                if($('#zsta').attr('src')=='img/shenfenzheng-A.png' || $('#zsta').attr('src')== "/bulid/img/lodding.gif"){
                    $.alert('请上传完成身份证人像面后提交！');
                    return false;
                }
                if($('#zstb').attr('src')=='img/shenfenzheng-B.png' || $('#zstb').attr('src')=='/bulid/img/lodding.gif'){
                    $.alert('请上传完成身份证国徽面后提交！');
                    return false;   
                }
                if($('#zstc').attr('src')=='img/shouchishenfenzheng.png' || $('#zstc').attr('src')=='/bulid/img/lodding.gif'){
                    $.alert('请上传完成手持身份证后提交！');
                    return false;   
                }
                if (1) {
                    $('.btn-next').attr('disabled','disabled').html('loading...')

                    // _t.$http.post( window._appPath +'file/upload.do', {
                    // window._appPath = 'http://192.168.28.248:9090/msxfInterface/'

                    _t.$http.post( window._appPath +'file/singleUploadStatusQuery.do', {
                        openId:$.cookie('openId')
                    },{
                        emulateJSON:true
                    }).then(function(res){
                        // console.log(res)
                        var data = res.data 
                        console.log(data,1111)

                        if(data.code==0){
                            if (data.data.faceFStatus==1 && data.data.faceRStatus==1 && data.data.faceDStatus==1) {
                                window.location.href="loan/loan_step2_1.html";
                            }
                            if(data.data.faceFStatus==0){//0未上传 1上传成功 2上传失败
                                alert('身份证人像面未上传')
                            }else if(data.data.faceFStatus==2){
                                alert('身份证人像面上传失败')
                            }
                            if(data.data.faceRStatus==0){
                                alert('身份证国徽面未上传')
                            }else if(data.data.faceRStatus==2){
                                alert('身份证国徽面上传失败')
                            }
                            if(data.data.faceDStatus==0){
                                alert('手持身份证未上传')
                            }else if(data.data.faceDStatus==2){
                                alert('手持身份证上传失败')
                            }

                            // window.location.reload();
                        }else{
                            alert('请重新上传！');
                            window.location.reload();
                        // setTimeout(function(){
                            // $('.btn-next').removeAttr('disabled').html('提交');
                        // },1000)
                        }

                    },function(){});
                }
 
            }
        },
        created:function(){

            var imgw = $('#zsta').width()
            imgw = imgw>500?500:imgw;
            var imgh = 180/290*imgw;
            $('#zsta').height(imgh).css('opacity',1);
            $('#zstb').height(imgh).css('opacity',1);
            $('#zstc').height(imgh).css('opacity',1);

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
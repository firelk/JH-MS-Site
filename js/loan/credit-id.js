$(function() {
    var clicknumber=0;
    $("#submit_button")[0].addEventListener('touchend',function(){
        var a=$("#zsta").attr("src");
        var b=$("#zstb").attr("src");
        var c=$("#zstc").attr("src");
        var d=$("#sign").attr("src");
        if(a.indexOf("id1.png")>-1||b.indexOf("id2.png")>-1||c.indexOf("id3.png")>-1||a.indexOf("lodding.gif")>-1||b.indexOf("lodding.gif")>-1||c.indexOf("lodding.gif")>-1) {
            alert("请上传身份证图片");
            return;
        }
        // if(d.indexOf("id6.png")>-1){
        //     alert("请手写签名");
        //     return;
        // }

        if(clicknumber==0) {
            clicknumber=1;
            $(".button_bg").html("<img src=\"images/lodding.gif\" />提交中...");
            $("#submit_button").prop("disabled",'disabled');
            setTimeout("savebtn()",10);
            // setTimeout(function(){
            //     $(".button_bg").html("提交");
            //     $("#submit_button").removeProp("disabled");
            // },30000)
        }
    });
    $('.id_sign').click(function(){
        var wp = new WritingPad();
    });
    /*$('#submit_button').click(
        function(){
        }
    );*/
});

function savebtn(){
    // if(null == openid || "null" == openid || undefined == openid || '' == openid ){
    //     alert("获取openid失败");
    //     location.reload();
    //     //return ;
    // }
    var openid = $.cookie('openId')
    var a=$("#zsta").attr("src");
    var b=$("#zstb").attr("src");
    var c=$("#zstc").attr("src");
    var d=$("#sign").attr("src");
    if(a.indexOf("id1.png")>-1||b.indexOf("id2.png")>-1||c.indexOf("id3.png")>-1||a.indexOf("lodding.gif")>-1||b.indexOf("lodding.gif")>-1||c.indexOf("lodding.gif")>-1) {
        alert("请上传身份证图片");
        // location.reload();
        return;
    }
    // if(d.indexOf("id6.png")>-1){
    //     alert("请手写签名");
    //     // location.reload();
    //     return;
    // }

    var port_url =  window._appPath +"file/upload.do";
    // var port_url =  'http://192.168.28.248:9090/msxfInterface/file/upload.do';
    // var unencrypted_data = '{"openId":"'+openid+'","photo_A":"'+ a +'","photo_B":"'+ b +'","photo_C":"'+ c +'","photo_D":"'+ d +'"}';
    // var unencrypted_data = '{"openId":"'+ openid +'","photo_A":"'+ a +'","photo_B":"'+ b +'"}';
    var data = {
        // "method" : method,
        // "version" : version,
        "appid" : appid,
        // "timestamp" : timestamp,
        // "data" : unencrypted_data,
        "photo_A": a,
        "photo_B": b//,
        // "photo_C": c//,
        // "photo_D": d
    }

    // console.log(data)

    $.ajax({
        cache: true,
        type: "POST",
        url:port_url,
        timeout : 120000,
        data: data,
        async: false,
        error: function(response) {
           alert("连接错误,请稍后再试", {time : 1000});
           // location.reload();
        },
        success: function(response) {
            console.log(response)
            // return 
            if (response.code == 0) {
                
                // window.location.href = 'loan_step2_1.html'
                // setInterval(function(){
                //     querybtn();
                // },5000);
                // setTimeout(function(){
                //     alert('请求超时，请重新输入验证码！');
                //     window.location.href="credit-phone.html";
                // },42000);
            } else {
                // alert(response.message);
                // location.reload();
            }
        }
    });
}
function querybtn(){
    if(null == openid || "null" == openid || undefined == openid || '' == openid ){
        alert("获取openid失败");
        location.reload();
        //return ;
    }

    var method = "stxfInterface.authIDcard.check3.query";
    var unencrypted_data = '{"openId":"'+openid+'"}';
    var data = {
        "method" : method,
        "version" : version,
        "appid" : appid,
        "timestamp" : timestamp,
        "data" : unencrypted_data
    };
    $.ajax({
        cache: true,
        type: "POST",
        url:port_url,
        timeout : 120000,
        data: data,
        async: false,
        error: function(response) {
           alert("连接错误,请稍后再试", {time : 1000});
           // location.reload();
        },
        success: function(response) {
            if (response.code == -1||(response.code >= 10052&&response.code <= 10099)) {
                alert(response.message);
                location.reload();
            }
            if (response.code == 0) {
                // 阅读协议
                window.location.href="credit-contentHtml.html?fileType=author";
                // window.location.href="credit.html";
                // if(!!response.data) {
                //     var data=eval("("+response.data+")");
                //     if(data.isFinish&&data.jumpUrl=="") {
                //         window.location.href="credit.html";
                //     } else if(data.isFinish&&data.jumpUrl!="") {
                //         window.location.href=data.jumpUrl;
                //     } else {
                //         $.cookie('captcha', null, { expires: 3000, path: '/' }); 
                //         $.cookie('needSms', null, { expires: 3000, path: '/' }); 
                //         $.cookie('verifyType', "3", { expires: 3000, path: '/' });
                //         $.cookie('needSms', data.needSms+'', { expires: 3000, path: '/' });
                //         $.cookie('captcha', data.captcha, { expires: 3000, path: '/' });
                //         window.location.href="credit.html";
                //         // window.location.href="credit-code.html";
                //     }
                // } else {
                //     window.location.href="credit.html";
                // }
            } else {
                // alert(response.message);
                // location.reload();
            }
        }
    });
}

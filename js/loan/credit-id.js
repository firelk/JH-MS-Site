function savebtn(){$.cookie("openId");var t=$("#zsta").attr("src"),i=$("#zstb").attr("src"),e=$("#zstc").attr("src");$("#sign").attr("src");if(t.indexOf("id1.png")>-1||i.indexOf("id2.png")>-1||e.indexOf("id3.png")>-1||t.indexOf("lodding.gif")>-1||i.indexOf("lodding.gif")>-1||e.indexOf("lodding.gif")>-1)alert("请上传身份证图片");else{var n=window._appPath+"file/upload.do",d={appid:appid,photo_A:t,photo_B:i};$.ajax({cache:!0,type:"POST",url:n,timeout:12e4,data:d,async:!1,error:function(t){alert("连接错误,请稍后再试",{time:1e3})},success:function(t){console.log(t),t.code}})}}function querybtn(){null!=openid&&"null"!=openid&&void 0!=openid&&""!=openid||(alert("获取openid失败"),location.reload());var t='{"openId":"'+openid+'"}',i={method:"stxfInterface.authIDcard.check3.query",version:version,appid:appid,timestamp:timestamp,data:t};$.ajax({cache:!0,type:"POST",url:port_url,timeout:12e4,data:i,async:!1,error:function(t){alert("连接错误,请稍后再试",{time:1e3})},success:function(t){(-1==t.code||t.code>=10052&&t.code<=10099)&&(alert(t.message),location.reload()),0==t.code&&(window.location.href="credit-contentHtml.html?fileType=author")}})}$(function(){var t=0;$("#submit_button")[0].addEventListener("touchend",function(){var i=$("#zsta").attr("src"),e=$("#zstb").attr("src"),n=$("#zstc").attr("src");$("#sign").attr("src");i.indexOf("id1.png")>-1||e.indexOf("id2.png")>-1||n.indexOf("id3.png")>-1||i.indexOf("lodding.gif")>-1||e.indexOf("lodding.gif")>-1||n.indexOf("lodding.gif")>-1?alert("请上传身份证图片"):0==t&&(t=1,$(".button_bg").html('<img src="images/lodding.gif" />提交中...'),$("#submit_button").prop("disabled","disabled"),setTimeout("savebtn()",10))}),$(".id_sign").click(function(){new WritingPad})});
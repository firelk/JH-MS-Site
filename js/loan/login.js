window.onload=function(){
    $(".iframe_cotent").attr("src","loan/loan"+window.location.search);
    $(".foot ul li").click(function(){
        $(".foot ul li").removeClass("active");
        $(this).addClass("active");
    });
    $(".foot ul li").eq(0).click(function(){
       $(".iframe_cotent").attr("src","loan/loan"+window.location.search)
    });
    $(".foot ul li").eq(1).click(function(){
        $(".iframe_cotent").attr("src","repay/repay"+window.location.search)
    });
    $(".foot ul li").eq(2).click(function(){
       $(".iframe_cotent").attr("src","loan/PageList"+window.location.search)
    });
}
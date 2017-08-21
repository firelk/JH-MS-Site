window.onload=function(){
    $(".list_page li").each(function(m,n){
        $(".list_page li a").removeClass("on");
        if($(n).find("a").attr("return_a")=="0"){
            $(this).find("a").attr("href","javascript:");
            $(this).addClass("on");
        }
    });
}
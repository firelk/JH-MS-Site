$(function () {
	
	//  
    $('.name').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        location.href = '/credit/attestation.html?v_'+ (new Date().getTime());
    });
    $('.mobile').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        $.confirm('<div  >\
             <div class="pay-input"><input type="text" class="" placeholder="请输入消费信贷支付密码" /></div>\
             <div class="color-red">*支付密码错误还有<span class="num">2</span>次输入机会</div>\
             </div>','手机验证',function(){
                console.log(111)
                $.confirm('<div  >\
                     <div class="pay-input"><input type="text" class="" placeholder="请输入新手机号" /></div>\
                     <div class="yzm-line" >\
                        <div class=" l pay-input"><input type="text" class="" placeholder="请输入验证码" /></div>\
                        <div class="r "><button class="btn">获取验证码</button></div>\
                     </div>\
                     </div>','手机验证',function(){
                        console.log(111)
                        
                     });
             });
    });

    //  
    $('.pay-password').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        $.confirm('<div  >\
                <div class="pay-hint text-left">请输入绑定手机****3333的验证码 </div>\
                     <div class="yzm-line" >\
                        <div class=" l pay-input"><input type="text" class="" placeholder="请输入验证码" /></div>\
                        <div class="r "><button class="btn">获取验证码</button></div>\
                     </div>\
                     <div class="pay-input"><input type="text" class="" placeholder="请输入新的6位数字信用密码" /></div>\
                     </div>','信用密码设置');
    });
});
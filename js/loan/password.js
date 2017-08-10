$(function () {
    
var _formPay = $('#form_paypsw');
                
            _formPay.validate({
                    rules : {
                        'payPassword_rsainput':{
                            'minlength':6,
                            'maxlength':6,
                            required:true,
                            digits : true,
                            numPassword : true,
                            echoNum :true
                        }
                    },
                    
                    messages:{
                        'payPassword_rsainput':{
                            'required' : '<i class="icon icon-attention icon-lg"></i>&nbsp;请填写支付密码',
                            'maxlength' : '<i class="icon icon-attention icon-lg"></i>&nbsp;密码最多为{0}个字符',
                            'minlength' : '<i class="icon icon-attention icon-lg"></i>&nbsp;密码最少为{0}个字符',
                            'digits':'<i class="icon icon-attention icon-lg"></i>&nbsp;密码只能为数字',
                            'numPassword' : '<i class="icon icon-attention icon-lg"></i>&nbsp;连号不可用，相同数字不可用（如：123456，11111）',
                            'echoNum' :'<i class="icon icon-attention icon-lg"></i>&nbsp;连号不可用，相同数字不可用（如：123456，11111）'     
                        }
                    },
                    errorPlacement : function(error, element) {
                        element.closest('div[data-error="i_error"]').append(error);
                    },  
                    submitHandler : function(form){
                        var _form = $(form);
                        // form.submit();

                    }
                });
                
var payPassword = $("#payPassword_container"),
    _this = payPassword.find('i'),  
    k=0,j=0,
    password = '' ,
    _cardwrap = $('#cardwrap');
    //点击隐藏的input密码框,在6个显示的密码框的第一个框显示光标
    payPassword.on('focus',"input[name='payPassword_rsainput']",function(){
    
        var _this = payPassword.find('i');
        if(payPassword.attr('data-busy') === '0'){ 
        //在第一个密码框中添加光标样式
           _this.eq(k).addClass("active");
           _cardwrap.css('visibility','visible');
           payPassword.attr('data-busy','1');
        }
        
    }); 
    //change时去除输入框的高亮，用户再次输入密码时需再次点击
    payPassword.on('change input  propertychange',"input[name='payPassword_rsainput']",function(){
        console.log(123)
        _cardwrap.css('visibility','hidden');
        _this.eq(k).removeClass("active");
        payPassword.attr('data-busy','0');
        // $('body').append($(this).val()+'  e.keyCode<br>')
        var num = $(this).val().split('').pop()||0
// console.log(num)
        //键盘上的数字键按下才可以输入
        if(num<10 ){
            k = this.value.length; //输入框里面的密码长度

            l = _this.length; //6
            
            for(;l--;){
            
            //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                if(l === k){
                    _this.eq(l).addClass("active");
                    _this.eq(l).find('b').css('visibility','hidden');
                    
                }else{
                    // alert(l)
                    _this.eq(l).removeClass("active");
                    _this.eq(l).find('b').css('visibility', (l < k ? 'visible' : 'hidden'));
                    // _this.eq(l).find('b').css({'border':'1px solid #ccc'})
                    
                }               
            
            if(k === 6){
                j = 5;
            }else{
                j = k;
            }
            $('#cardwrap').css('left',j*39+'px');
        
            }
        }else{
        //输入其他字符，直接清空
            var _val = this.value;
            this.value = _val.replace(/\D/g,'');
        }

    }).on('blur',"input[name='payPassword_rsainput']",function(){
        
        _cardwrap.css('visibility','hidden');
        _this.eq(k).removeClass("active");
        payPassword.attr('data-busy','0');
        
    }); 
    //使用keyup事件，绑定键盘上的数字按键和backspace按键
    payPassword.on('keyup ',"input[name='payPassword_rsainput']",function(event){
    
        var  e = (event) ? event : window.event;
        // alert(e.keyCode+'  e.keyCode')
        // $('body').append(JSON.stringify(e.keyCode)+'e.keyCode<br>')
        console.log(e.keyCode,'e.keyCode')
        if(e.keyCode == 13){
            if($('.step2').hasClass('hide')){
                $('.pass-next').click()
            }else{
                $('.pass-submit').click()
            }
             
        }
    //     //键盘上的数字键按下才可以输入
    //     // if(e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)){
    //         k = this.value.length;//输入框里面的密码长度
    //         l = _this.size();//6
            
    //         for(;l--;){
            
    //         //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
    //             if(l === k){
    //                 _this.eq(l).addClass("active");
    //                 _this.eq(l).find('b').css('visibility','hidden');
                    
    //             }else{
    //                 // alert(l)
    //                 _this.eq(l).removeClass("active");
    //                 _this.eq(l).find('b').css('visibility', (l < k ? 'visible' : 'hidden'));
    //                 _this.eq(l).find('b').css({'border':'1px solid #ccc'})
                    
    //             }               
            
    //         if(k === 6){
    //             j = 5;
    //         }else{
    //             j = k;
    //         }
    //         $('#cardwrap').css('left',j*39+'px');
        
    //         }
    //     // }else{
    //     // //输入其他字符，直接清空
    //     //     var _val = this.value;
    //     //     this.value = _val.replace(/\D/g,'');
    //     // }
    });

    // -----------------------------------
    _formPay.submit(function(event) {
        /* Act on the event */
        console.log(112311)
        return false;
    });
    $('.pass-next').click(function(event) {
        /* Act on the event */

        if($('#payPassword_rsainput-error').length == 0 && $('#payPassword_rsainput').val().length==6){

            $('.step1').addClass('hide')
            $('.pass-next').addClass('hide')
            $('.step2').removeClass('hide')
            $('.pass-submit').removeClass('hide')
            var $pwd = $('#payPassword_rsainput')
            $('#payPassword_rsainput').data('pwd1',$pwd.val())
            $pwd.val('')
            var $k = $('.sixDigitPassword-box')
            $k.find('i b').css({
                visibility: 'hidden'
            });

            $pwd.focus();
            $('#cardwrap').css('left',0)
        }else{

        }


        return false;
    });
    
    $('.pass-reset').click(function(event) {

        CommonUtil.redirectUrl('loan/loan_password.html?v_'+ (new Date().getTime()));
        return false
    });
    $('.pass-submit').click(function(event) {
        var $pwd = $('#payPassword_rsainput')
        var p1 = $pwd.val()
        var p2 = $pwd.data('pwd1')
        if(p1===p2){
            //提交

            // 获取会员Id
        $.ajax({
            url: window._appPath +'transpassword/setup.do',
            type: 'post',
            dataType: 'json',
            data: {
                openId: $.cookie('openId'),
                transPassword: p1
            },
        })
        .done(function(data) {
            // var json = JSON.parse(data)
            var json = data
            console.log(json,'password')
            if(data.code == 0 || data.code == 101 ){
                // location.href = 'loan/loan_password_success.html?v_'+ (new Date().getTime())

                CommonUtil.redirectUrl('loan/loan_password_success.html?v_'+ (new Date().getTime()));
            }else{
                alert(data.message);
                window.location.reload();
            }

             
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
            // CommonUtil.redirectUrl('loan/loan_password_success.html?v_'+ (new Date().getTime()));
        }else{
            $('#payPassword_container').append('<span id="payPassword_rsainput-error" class="help-block"><i class="icon icon-attention icon-lg"></i>&nbsp;两次密码输入不一致</span>')
            
            $('.pass-submit').addClass('hide')
            $('.pass-reset').removeClass('hide')
        }
        return false
    });
    setTimeout(function(){
        payPassword.focus()
    },600)
});
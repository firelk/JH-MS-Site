$(function () {
  if (CommonUtil.sessionStorage.get('SET_ADD_CARD') == '1') {
    CommonUtil.sessionStorage.remove('SET_ADD_CARD');
    CommonUtil.reloadPage(true);
    return;
  }
  //卡片选择
  $(".binding-card li").click(function(){
      $this=$(this);
      var ID=$(this).find('.left').find('.number').attr('data-bankcardid');
      var text_nmber=$(this).find('.left').find('.number').text().match(/\d+/ig);
      var img_address=$(this).find(".left").find("img").attr("src")
      CommonUtil.sessionStorage.set('card_no',ID);
      CommonUtil.sessionStorage.set('text_nmber',text_nmber);
      CommonUtil.sessionStorage.set('bank_img',img_address);
      console.log(img_address)
      history.go(-1);
  })



//设为主卡
  $(document).on('click','.set-main',function(){
    $this=$(this);
    var ID=$(this).parent().siblings('.left').find('.number').attr('data-bankcardid');
    $.ajax({
      type: "put",
      url: "services/ayh/setMaincard",
      data: {bankcard_id:ID},
      success: function(json){
        if(json.errorCode=='0'){
          CommonUtil.sessionStorage.set('SET_MAIN_CARD', '1');
          if(id){
            var html='';
            html+='<a href="javascript:;" class="set-main">设为主卡</a>';
            $this.parents('li').siblings().find('.right').empty().append(html);
            $this.parent().empty().append("<em>主卡</em>");
            $.toast('设置主卡成功！',1000,function(){
              history.go(-1);
            });
          }else{
            var html='';
            html+='<a href="javascript:;" class="set-main">设为主卡</a>';
            html+='<a href="javascript:;" class="set-unbind">解除绑定</a>';
            $this.parents('li').siblings().find('.right').empty().append(html);
            $this.parent().empty().append("<em>主卡</em>");
            $.toast('设置主卡成功！');
          }
        }else{
          $.error(json.errorMsg);
        }
      }
    });
  })

//解除绑定

  $(document).on('click','.set-unbind',function(){
    $this=$(this);
    var ID=$(this).parent().siblings('.left').find('.number').attr('data-bankcardid');
    $.confirm('<div class="pay-title">请输入交易密码</div><div class="msxf-container" id="paypassword-container"><input maxlength="6" tabindex="1" id="payPassword_rsainput" name="payPassword_rsainput" class="ui-input i-text trader-password" oncontextmenu="return false" onpaste="return false" oncopy="return false" oncut="return false" autocomplete="off" value="" type="password"> <div class="digit-password" tabindex="0"> <i class="active"><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><span class="guangbiao" style="left:0px;"></span></div></div><p class="forget-link"><a href="pwd/findTrpwd?type=0">忘记交易密码</a></p>',function(){
      var val=$('.trader-password').val();
      if(val!==''){
        var password= sha256_digest(val);
        $.ajax({
          type: 'post',
          url: "services/ayh/deleteBankcard",
          data: {bankcard_id:ID,payment_password:password},
          contentType: "application/json; charset=UTF-8",
          success: function(json){
            if(json.errorCode=='0'){
              $this.parents('li').remove();
            }else{
              $.error(json.errorMsg);
            }
          }
        });
      }else{
        $.error('交易密码不能为空');
      }
    });
    //密码框效果
    $(".i-text").keyup(function()
    {
      var inp_v = $(this).val();
      var inp_l = inp_v.length;
      $(".digit-password").find("i").eq( inp_l ).addClass("active").siblings("i").removeClass("active");
      $(".digit-password").find("i").eq( inp_l ).prevAll("i").find("b").css({"display":"block"});
      $(".digit-password").find("i").eq( inp_l - 1 ).nextAll("i").find("b").css({"display":"none"});

      $(".guangbiao").css({"left":inp_l * 43});//光标位置

      if( inp_l == 0)
      {
        $(".digit-password").find("i").eq( 0 ).addClass("active").siblings("i").removeClass("active");
        $(".digit-password").find("b").css({"display":"none"});
        $(".guangbiao").css({"left":0});
      }
      else if( inp_l == 6)
      {
        $(".digit-password").find("b").css({"display":"block"});
        $(".digit-password").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
        $(".guangbiao").css({"left":5 * 43});
      }
    });
  })

//添加银行卡
  $('.add-bank-btn').click(function(){
    var real_name = '';
    var identity_card_number = '';
    var phone_number='';
    $.postJSON('services/ayh/profile', function (json) {
      CommonUtil.parseHttpResponse(json, function () {
        real_name = json.result.real_name;
        var real_name_h="*"+real_name.substring(real_name.length-1,real_name.length);
        identity_card_number = json.result.identity_card_number;
        var id_number_h="**"+identity_card_number.substring(identity_card_number.length-4,identity_card_number.length);
        phone_number= json.result.phone_number;
        CommonUtil.redirectUrl('loan/addBankCard?real_name='+ real_name + '&real_name_h='+real_name_h+'&id_number_h='+id_number_h+'&identity_card_number=' + identity_card_number+ '&phone_number=' + phone_number);
      }, function (errorMsg) {
        $.error($.empty2def(errorMsg, '获取信息失败'))
      });
    });
  })
})
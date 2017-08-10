$(function(){

  // if(!$.cookie('userflag')){
  //   $.cookie('userflag','1',{path:'/'})
  //   location.href ='loan/index.html'
  // }else{
  //   location.href ='loan/loan_step1.html'
  // }
  
  new Vue({
      el:'.support-bank-box',
      data:{
        isuser:[]
      },
      created:function(){
        // 支持银行列表
      this.$http.post( window._appPath +'/isuser.do',{
        openId:$.cookie('openId')
      },{
          emulateJSON:true
      }).then(function(res){
          console.log(res)
        var data = res.data
        if(data.code==0){
          this.isuser  = data.data.isuser
          // 0----注册成功
          // 1----注册成功,需要填密码
          // 2----注册后审批中 需要查询
          // 3----未注册需要注册
          // 4----注册成功，需要看协议，签合同
          // 5----不是佳慧会员
          // 6----拒绝
          var dateStr = (new Date()).getTime()
          if(data.data.isuser == '0'){
            CommonUtil.redirectUrl('loan/index.html?v_'+dateStr);
          }else if(data.data.isuser == '1'){
            CommonUtil.redirectUrl('loan/loan_password.html?v_'+dateStr);

          }else if(data.data.isuser == '2'){
            CommonUtil.redirectUrl('loan/loan_step2_1.html?v_'+dateStr);
            // CommonUtil.redirectUrl('loan/loan_step4.html');

          }else if(data.data.isuser == '3'){
            CommonUtil.redirectUrl('loan/loan_step1.html?v_'+dateStr);
          }else if(data.data.isuser == '6'){
            CommonUtil.redirectUrl('loan/loan_loading.html?v_'+dateStr);
          }else if(data.data.isuser == '7'){
            CommonUtil.redirectUrl('loan/loan_step2-id.html?v_'+dateStr);
          }else if(data.data.isuser == '4'){
            CommonUtil.redirectUrl('loan/loan_step3.html?v_'+dateStr);
            // CommonUtil.redirectUrl('loan/loan_step6.html');
          } else if(data.data.isuser == '5'){
            $.alert('您不是会员！！')
            // CommonUtil.redirectUrl('loan/loan_step5.html');
          } 
        }else{
          $.alert(data.message)
        }
      }, function(res){
        $.alert('接口出错，稍后再试')
      })
      }
    })
})
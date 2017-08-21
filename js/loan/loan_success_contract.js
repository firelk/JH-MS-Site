$(function () {
//     var next_base= CommonUtil.getUrlParam("result");
//     if(next_base=="612"){
//         CommonUtil.redirectUrl('loan/step1');
//     }else if(next_base=="-1"){
//         CommonUtil.redirectUrl('loan/step1');
//     }
//     //缓存下拉数据
//     $("#user-info-form select").each(function(index,item){
//         var name=$(item).attr("name");
//         var value=sessionStorage.getItem(name);
//         if($(name)!='undefined' && $.isNotEmpty(value)){
//             $(item).val(value);
//             $(item).find("[value='"+value+"']").attr("selected","selected");
//             $(item).trigger("change");
//         }
//     });
//     //下拉框选中
//     $("#user-info-form select").change(function(){
//         var name=$(this).attr("name");
//         var value=$(this).val();
//         sessionStorage.setItem(name,value);
//     });
//     //去空格
//     $("input[name='name']").change(function(){
//         var val=$(this).val();
//         $(this).val($.trim(val));
//     });
//     //协议
//     $('#loan-agreement').click(function () {
//         var text = '';
//         var TEMPID = CommonUtil.sessionStorage.get('APPLICATION_TEMP_ID');
//         CommonUtil.redirectUrl('loan/loanAgreement');
//         // $.getJSON('services/ayh/loan', {temp_application_id: TEMPID}, function (json) {
//         //     debugger;
//         //     CommonUtil.parseHttpResponse(json, function () {
//         //         $.alert(json.result);
//         //     }, function (errorMsg) {
//         //         if(json.errorCode=="40000007"){//操作超时跳转到借款首页
//         //             $.error($.empty2def(errorMsg, '协议获取失败'),function(){
//         //                 CommonUtil.redirectUrl('loan/loan');
//         //             })
//         //         }else{
//         //             $.error($.empty2def(errorMsg, '协议获取失败'));
//         //         }
//         //     });
//         // });
//     });
// //下一步
//     $('.btn-next').on('click', function (e) {
//         console.log('提交')
//         $.showPreloader();
//     //     $.alert2('<div class="load-container load8">\
//     //     <div class="loader"></div>\
//     // </div>审核中请等待...'
//     //         );
//         setTimeout(function(){
//             CommonUtil.redirectUrl('loan/loan_success.html?v_'+ (new Date().getTime()));
            
//         },5000)
//         return;

        
//         var $form = $('#user-info-form');
//         if ($form.validator()) {
//             var data = $form.serializeJSON();
//             var params = {
//                 address: {
//                     province: {code: data.provinceCode, name: data.provinceName},
//                     city: {code: data.cityCode, name: data.cityName},
//                     district: {code: data.districtCode, name: data.districtName},
//                     detail: data.detail
//                 },
//                 contact: {
//                     name: data.name,
//                     relation: data.allRelation,
//                     phone_number: data.phone_number
//                 },
//                 authNum:CommonUtil.getUrlParam("auth_number"),
//                 loanPurpose:data.loanUsage
//             };
//             params.application_temp_id = CommonUtil.sessionStorage.get('APPLICATION_TEMP_ID');
//             $.postJSON('services/ayh/other_info', params, function (json) {
//                 CommonUtil.parseHttpResponse(json, function () {
//                     CommonUtil.redirectUrl('loan/applying/?applyId='+json.result.applyId);
//                 }, function (errorMsg) {
//                     if(json.errorCode=="40000007"){//操作超时跳转到借款首页
//                         $.error($.empty2def(errorMsg, '保存信息失败'),function(){
//                             CommonUtil.redirectUrl('loan/loan');
//                         })
//                     }else{
//                         $.error($.empty2def(errorMsg, '保存信息失败'));
//                     }
                    
//                 });
//             });
//         }
//     });



//     // 
//      // var data = {
//      //        openId: $.cookie('openId')
//      //    }
//     // 四要素鉴权发短信
//     // 获取会员Id
//         $.ajax({
//             url: window._appPath +'contract/html.do',
//             type: 'post',
//             dataType: 'json',
//             data: {openId:$.cookie('openId')},
//         })
//         .done(function(data) {
//             // var json = JSON.parse(data)
//             var json = data
//             console.log(json,'contract/html.do')
//             if(json.code==0){
//                 var obj = jQuery.parseJSON(data.data.htmlContract);
//                 // $(document.getElementById('iframeContract').contentWindow.document.body).html(obj.content)
//                 $('#iframeContract').contents().find('body').html(obj.content)
//             }else{
//                 $.alert(json.message)
//             }
//         })
//         .fail(function() {
//             console.log("error");
//         })
//         .always(function() {
//             console.log("complete");
//         });
        
//         // 按钮
//         $('.btn').click(function(event) {
//             CommonUtil.redirectUrl('loan/loan_password.html?v_'+ (new Date().getTime()));
//         });
     new Vue({
        el:'.main',
        methods:{
            clickFn:function(){
                CommonUtil.redirectUrl('loan/loan_step5.html?v_'+ (new Date().getTime()));
            },
            getFn:function(){
                this.$http.post(window._appPath +'contract/html.do',{
                // this.$http.post(window._appPath +'contract/credit/auth.do',{
                    openId:$.cookie('openId')
                },{
                    emulateJSON:true
                }).then(function(res){
                    var data = res.data;
                    console.log(data,'contract/html.do')
                    if(data.code==0){
                        var obj = jQuery.parseJSON(data.data.htmlContract);
                        // $(document.getElementById('iframeContract').contentWindow.document.body).html(obj.content)
                        $('#iframeContract').contents().find('body').html(obj.content)
                    }else{
                        $.alert(data.message)
                    }
                })
            }
        },
        created:function(){
            this.getFn()
        }
    })

});


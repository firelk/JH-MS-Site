$(function () {
	
	// 列表切换
    $('.box-2').on('click', '.hd', function(event) {
        event.preventDefault();
        /* Act on the event */
        // $(this).parent().siblings('li').toggleClass('active');
        // $(this).addClass('active');
        $(this).parent().toggleClass('active');
    }); 
    var app = new Vue({
          el: '#app',
          data: {
            billAmt: '', // data.data.needPayAmount
            currStmtAmt: '', // data.data.needPayAmount
            shdRepayAmt:'',
            paidAmt:'',
            billhis:[],
            bill:[],
            db_cr_ind:{// 20170524 by link &&mingming
                C:'+',
                D:'-',
                N:''
            },
            overdueInd:{
                B:'全额还款',
                D:'部分还款',
                U:'还款未达最小还款额',
                N:'未还款',
                C:'无需还款',
            }
          },
          methods:{
            billFn:function(id,loan_ind, amount, post_flg, cons_plan_ind){
                // String post_flg 入账标识Y
                // String cons_plan_ind 是否为消费计划Y
                // String loan_ind 是否已分期N
                console.log(id,loan_ind, amount,post_flg,cons_plan_ind);
                if(loan_ind=='N' && post_flg =='Y' && cons_plan_ind=='Y'){// 未分期跳转
                    // location.href = 'loan/instalment-repayment.html?refNo='+ id +'&amount='+ amount;
                    CommonUtil.redirectUrl('loan/instalment-repayment.html?refNo='+ id +'&amount='+ amount);
                }else {//以分期 或 等待  不操作

                    // CommonUtil.redirectUrl('loan/bill-detail.html?refNo='+ id +'&amount='+ amount);
                }
            },
            appliFn:function(){

            },
            repayBtnFn:function(){
                CommonUtil.redirectUrl('loan/loan_repay.html?v_'+ (new Date().getTime()));
            }
          },
          created:function(){
            this.$http.post(window._appPath +'getbills.do',{
                openId:$.cookie('openId')
            },{
                emulateJSON:true
            }).then(function(res){
                console.log(res.data,111)
                var data = res.data
                // console.log(data.data.bill)
                if(data.code==0){
                    // 本期还款
                    // this.billAmt = data.data.billhis.billAmt
                    console.log(Number(data.data.billhis.billAmt) , Number(data.data.bill.paidAmt))
                    this.billAmt = data.data.billhis.billAmt !='' ? (Number(data.data.billhis.billAmt) - Number(data.data.bill.paidAmt)).toFixed(2) : 0;
                    this.billhis = data.data.billhis.stmtDetails;
                    // 全部待还
                    this.shdRepayAmt = data.data.bill.shdRepayAmt !='' ? data.data.bill.shdRepayAmt : 0;
                    this.paidAmt = data.data.bill.paidAmt;
                    this.bill = data.data.bill.stmtDetails;
                }
            },function(){})
          }
        });

    // 全部待还
    // var app = new Vue({
    //       el: '#app2',
    //       data: {
    //         needPayAmount: 0, // data.data.needPayAmount
    //         bills:[]
    //       },
    //       created:function(){
    //         this.$http.post(window._appPath +'billhis.do',{
    //             openId: $.cookie('openId'),
    //             startDate:'201401',
    //             endDate:'201702',
    //             firstRow:0,
    //             lastRow:10
    //         },{
    //             emulateJSON:true
    //         }).then(function(res){
    //             this.needPayAmount = res.data.data.needPayAmount
    //             this.bills = res.data.data.bills
    //             console.log(res.data)
    //         },function(){})
    //       }
    //     });
    // // 当月待还
    //     $.ajax({
    //         url: window._appPath +'bill.do',
    //         type: 'post',
    //         dataType: 'json',
    //         data: {openId:$.cookie('openId')},
    //     })
    //     .done(function(data) {
    //         // var json = JSON.parse(data)
    //         var json = data
    //         console.log(json)
    //         if(data.code == 0){
               
    //             var app = new Vue({
    //               el: '#app',
    //               data: {
    //                 message: data.data.needPayAmount
    //               }
    //             });
    //             var example1 = new Vue({
    //               el: '#example-1',
    //               data: {
    //                 items: data.data.deals
    //               }
    //             })
                 

    //         }

    //     })
    //     .fail(function() {
    //         console.log("error");
    //     })
    //     .always(function() {
    //         console.log("complete");
    //     });
    // 全部待还
        // $.ajax({
        //     url: window._appPath +'billhis.do',
        //     type: 'post',
        //     dataType: 'json',
        //     data: {
        //         openId: $.cookie('openId'),
        //         startDate:'201401',
        //         endDate:'201702',
        //         firstRow:0,
        //         lastRow:10
        //     },
        // })
        // .done(function(data) {
        //     // var json = JSON.parse(data)
        //     var json = data
        //     console.log(json)
        //     if(data.code == 0){

        //     }

        // })
        // .fail(function() {
        //     console.log("error");
        // })
        // .always(function() {
        //     console.log("complete");
        // });
});
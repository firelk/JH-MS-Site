$(function () {

    var dealsData = {};
    var counter = 1;
    var number = 12;
    var pageEnd = true;

    function getData(page, num) {
        $.postJSON('services/ayh/queryCurrentBill', {page: page, per_page: num}, function (json) {
            CommonUtil.parseHttpResponse(json, function () {
                CommonUtil.sessionStorage.set('SET_status_CARD', '1');
                dealsData = json.result;
                var resultHtml = '';
                if (dealsData.length > 0) {
                    for (var i = 0; i < dealsData.length; i++) {
                        resultHtml += '<li class="clearfix"><div class="billDetialNumberLeft"><p class="billDetialNumberMode"><span class="nowrap">'+dealsData[i].type+'</span></p><p class="billDetialNumberDate"><span>'+dealsData[i].date+'</span></p></div><div class="payMoney">¥<span>'+dealsData[i].money+'</span></div></li> ';
                    }
                    $('.my-loan').append(resultHtml);

                } else {
                    if (counter == 1) {
                        $('.bot-fixed').hide();
                        resultHtml += '<div class="not-have-loan">';
                        resultHtml += '<img src="img/nothave.png">';
                        resultHtml += '<p>您还没有借款申请</p>';
                        resultHtml += '</div>';
                        resultHtml += '<a href="loan" class="btn-apply btn">去申请</a>';
                        $('body').append(resultHtml);
                    } else {
                        pageEnd = false;
                        $('.page-tip').show();
                    }
                }
            }, function (errorMsg) {
                $.error($.empty2def(errorMsg, '保存信息失败'))
            });
        });
    }

    getData(counter, number);
    touch.on('.my-loan', 'swipeup', function (ev) {
        if (pageEnd) {
            counter++;
            getData(counter, number);
        }
    });
})


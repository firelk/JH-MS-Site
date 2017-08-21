$(function () {

    var dealsData = {};
    var counter = 1;
    var number = 12;
    var pageEnd = true;

    function getData(page, num) {
        $.getJSON('services/ayh/deals', {page: page, per_page: num}, function (json) {
            CommonUtil.parseHttpResponse(json, function () {
                CommonUtil.sessionStorage.set('SET_status_CARD', '1');
                dealsData = json.result;
                var resultHtml = '';
                if (dealsData.length > 0) {
                    for (var i = 0; i < dealsData.length; i++) {
                        resultHtml += '<li>';
                        resultHtml += '<div class="left" flex="cross:center">';
                        resultHtml += '<div class="left-loan">';
                        resultHtml += '<div class="title">' + dealsData[i].typeName + '</div>';
                        resultHtml += '<p>' + dealsData[i].created.slice(0, 10) + '</p>';
                        resultHtml += '</div>';
                        resultHtml += '</div>';
                        resultHtml += ' <div class="right">';
                        resultHtml += '<p class="p1">¥' + dealsData[i].cash_amount + '</p>';
                        resultHtml += '<p class="p2">' + dealsData[i].result + '</p>';
                        resultHtml += '</div>';
                        resultHtml += '</li>';
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


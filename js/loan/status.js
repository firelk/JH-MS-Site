$(function () {
    document.createElement("blue");
    // 设置倒计时
    var countdown = 60;
    // 倒计时定时器对象
    var timer = null;
    // 状态刷新间隔时间
    var interval = 5000;
    // 刷新状态
    var refresh = function() {
        $.getJSON('services/ayh/getApplyResult', {application_id: ID}, function (json) {
            CommonUtil.parseHttpResponse(json, function () {
                var status = json.result.apply_status;
                if (status == 0) {          // 申请中
                    setTimeout(refresh, interval);
                } else if (status == -1) {  // 失败：审核失败和提现失败
                    if (timer) {
                        clearInterval(timer);
                    }
                    if (json.result.status.length == 2) {
                        // 审核失败
                        $('.status1').removeClass('hide').siblings('.status').addClass('hide');
                        $('[name="tipMsg"]').text(json.result.apply_msg);
                        $('[name="checkFailTime"]').text(json.result.status[1].created);
                    } else {
                        // 提现失败
                        $('.status2').removeClass('hide').siblings('.status').addClass('hide');
                        $('[name="tipMsg"]').text(json.result.apply_msg);
                        $('[name="checkSuccessTime"]').text(json.result.status[1].created);
                        $('[name="withdrawFailTime"]').text(json.result.status[2].created);
                    }
                } else if (status == 1) {   // 提现成功、审批成功
                    if (timer) {
                        clearInterval(timer);
                    }
                    if (json.result.status.length == 2) {
                        $('.status3').removeClass('hide').siblings('.status').addClass('hide');
                        $('[name="tipMsg"]').html(json.result.apply_msg);
                        $('[name="checkSuccessTime"]').text(json.result.status[1].created);
                    } else {
                        $('.status4').removeClass('hide').siblings('.status').addClass('hide');
                        $('[name="tipMsg"]').html(json.result.apply_msg)
                        $('[name="checkSuccessTime"]').text(json.result.status[1].created);
                        $('[name="withdrawSuccessTime"]').text(json.result.status[2].created);
                    }
                }
            }, function (errorMsg) {
                setTimeout(refresh, interval);
            });
        }, {loading: false, error: function() {
            setTimeout(refresh, interval);
        }});
    };

    //判断是否是返回
    if (CommonUtil.sessionStorage.get('SET_status_CARD') == '1') {
        CommonUtil.sessionStorage.remove('SET_status_CARD');
        CommonUtil.redirectUrl('loan/loan');
        return;
    }else{
        // 状态为审批中启动定时器
        timer = setInterval(function() {
            if (countdown == 0) {
                countdown = 60;
            } else {
                countdown--;
            }
            $('.audit-right .time').text(countdown);
        }, 1000);
        setTimeout(refresh, interval);
    }


});

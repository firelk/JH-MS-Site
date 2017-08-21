$(function () {
    document.createElement("blue");
    // 状态刷新间隔时间
    var interval = 5000;
    // 刷新状态
    var refresh = function() {
        $.getJSON('services/ayh/getApplyResult', {applyId: ID}, function (json) {
            debugger;
            CommonUtil.parseHttpResponse(json, function () {
                var status = json.result.apply_status;
                if (status == 0) {          // 申请中
                    setTimeout(refresh, interval);
                } else if (status == -1) {  // 失败：
                    CommonUtil.redirectUrl('loan/applyFail');
                } else if (status == 1) {   // 申请成功
                     CommonUtil.redirectUrl('loan/applySuccess?amount='+json.result.apply_msg);
                }
            }, function (errorMsg) {
                setTimeout(refresh, interval);
            });
        }, {loading: false, error: function() {
            setTimeout(refresh, interval);
        }});
    };

   
    refresh();


});

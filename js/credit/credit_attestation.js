$(function () {
	
	//  
    $('.btn').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        location.href = '/credit/attestation_success.html?v_'+ (new Date().getTime());
    });
    
    //  
    $('.form-controls i').on('click',  function(event) {
        event.preventDefault();
        /* Act on the event */
        $.alert('<div  >\
                <div class="photo-hint text-left">\
                <ol>\
                    <li>请上传清晰彩色，完整的原件扫描件或照片。</li>\
                    <li>身份证各项信息及头像清晰可见，不能出现遮挡或模糊无法识别。</li>\
                    <li>证件需真实拍摄，复印件拍摄图片无法使用。</li>\
                    <li>需上传横屏拍摄图片，满足上传格式要求。</li>\
                    <li>手持身份证照片需免冠，五官可见，完整露出手臂。</li>\
                </ol>\
                </div>\
                     </div>','证件照要求');
    });
});
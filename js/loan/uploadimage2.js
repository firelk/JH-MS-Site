function selectFileImage(fileObj) {
    var file = fileObj.files['0'];
    //图片方向角 added by lzk  
    var Orientation = null;
    var inputId = $(fileObj).attr('id');
    var imgId = $(fileObj).prev().attr('id');
    if(!$(fileObj).val()){
        return ;
    }

    // if ($(fileObj).prev().attr('src') == "/bulid/img/lodding.gif") {
    //     return;
    // }
    if ($(fileObj).prev().css('opacity') == 0) {
        return;
    }
    // $(fileObj).prev().attr('src', "/bulid/img/lodding.gif");
    $(fileObj).prev().css('opacity', "0");

    if (file) {
        console.log("正在上传,请稍后...");
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
        if (!rFilter.test(file.type)) {
            //showMyTips("请选择jpeg、png格式的图片", false);  
            return;
        }
        // var URL = URL || webkitURL;  
        //获取照片方向角属性，用户旋转控制  
        EXIF.getData(file, function() {
            // alert(EXIF.pretty(this));  
            EXIF.getAllTags(this);
            //alert(EXIF.getTag(this, 'Orientation'));   
            Orientation = EXIF.getTag(this, 'Orientation');
            //return;  
        });
        if(window.FileReader) {
            var oReader = new FileReader();
            oReader.onload = function(e) {
                //var blob = URL.createObjectURL(file);  
                //_compress(blob, file, basePath);  
                var image = new Image();
                image.src = e.target.result;
                image.onload = function() {
                    var expectWidth = this.naturalWidth;
                    var expectHeight = this.naturalHeight;

                    if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 1000) {
                        expectWidth = 1000;
                        expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                    } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1000) {
                        expectHeight = 1000;
                        expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                    }
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = expectWidth;
                    canvas.height = expectHeight;
                    ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                    var base64 = null;
                    // alert(navigator.userAgent.match(/Android/i))
                    //修复ios  
                    if (navigator.userAgent.match(/iphone/i)) {
                        // alert('iphone');
                        //alert(expectWidth + ',' + expectHeight);  
                        //如果方向角不为1，都需要进行旋转 added by lzk  
                        if (Orientation != "" && Orientation != 1) {
                            // alert('旋转处理');  
                            switch (Orientation) {
                                case 6: //需要顺时针（向左）90度旋转  
                                    // alert('需要顺时针（向左）90度旋转');  
                                    rotateImg(this, 'left', canvas);
                                    break;
                                case 8: //需要逆时针（向右）90度旋转  
                                    // alert('需要顺时针（向右）90度旋转');  
                                    rotateImg(this, 'right', canvas);
                                    break;
                                case 3: //需要180度旋转  
                                    // alert('需要180度旋转');  
                                    rotateImg(this, '', canvas); //转两次  
                                    // rotateImg(this,'right',canvas);  
                                    break;
                            }
                        }

                        /*var mpImg = new MegaPixImage(image); 
                        mpImg.render(canvas, { 
                            maxWidth: 800, 
                            maxHeight: 1200, 
                            quality: 0.8, 
                            orientation: 8 
                        });*/
                        base64 = canvas.toDataURL("image/jpeg", 0.9);
                        postImgIphone(base64, imgId, inputId);

                    } else if (navigator.userAgent.match(/Android/i)) { // 修复android  
                        // alert(JPEGEncoder)
                        var encoder = new JPEGEncoder();
                        // alert(encoder)
                        base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 90);

                        postImgAndroid(base64, imgId, inputId)
                        // alert(base64)
                    } else {
                        //alert(Orientation);  
                        if (Orientation != "" && Orientation != 1) {
                            //alert('旋转处理');  
                            switch (Orientation) {
                                case 6: //需要顺时针（向左）90度旋转  
                                    // alert('需要顺时针（向左）90度旋转');  
                                    rotateImg(this, 'left', canvas);
                                    break;
                                case 8: //需要逆时针（向右）90度旋转  
                                    // alert('需要顺时针（向右）90度旋转');  
                                    rotateImg(this, 'right', canvas);
                                    break;
                                case 3: //需要180度旋转  
                                    // alert('需要180度旋转');  
                                    rotateImg(this, '', canvas); //转两次  
                                    // setTimeout(function(){
                                    //     alert('')
                                    //     rotateImg(this,'left',canvas);  
                                    // },200)
                                    break;
                            }
                        }

                        base64 = canvas.toDataURL("image/jpeg", 0.9);
                        postImgAndroid(base64, imgId, inputId)
                    }
                    // alert(base64)
                    //uploadImage(base64);  
                    // $("#myImage").attr("src", base64);
                    // $(this)
                    // function uploadImg(file, pic, uri) 
                    // uploadImg('Photo_A', 'zsta', "/file/singleUpload.do",);
                    // var ff = document.getElementById(file);
                    //window.pct = document.getElementById(pct);

                };
            };
            oReader.readAsDataURL(file);
        }
            
    }
}
function photoTypeFn(inputId){
    var photoType =''; //F 正面 R 背面 D 手持
    if (inputId == 'Photo_A') {
        photoType = 'F'
    }
    if (inputId == 'Photo_B') {
        photoType = 'R'
    }
    if (inputId == 'Photo_C') {
        photoType = 'D'
    }
    return photoType;
}
function postImgAndroid(base64, imgId, inputId) {
    var uri = "/msxfInterface/file/singleUpload.do";
    var pic = $('#' + imgId);
    var ipt = $('#' + inputId + '-src');
    var photoType = photoTypeFn(inputId);

    if (!base64) {
        return false;
    }
    $.ajax({
        url: uri,
        type: 'post',
        dataType: 'json',
        timeout: 120000,
        data: {
            'openId': $.cookie('openId'),
            'photoBase64Code': base64,
            'photoType': photoType 
        }
    })
    .done(function() {
        // console.log("success");
        pic.attr('src', base64).css('opacity', 1);// 新加的 20170802
    })
    .fail(function() {
        console.log("error");
        pic.attr('src', pic.data('src')).css('opacity',1);
    })
  
    
    // $.post(uri , {
    //     'openId': $.cookie('openId'),
    //     'photoBase64Code': base64,
    //     'photoType': photoType 
    // }, function(data, textStatus, xhr) {
    //     // alert(data)
    //     clearTimeout(window.setTimeFlag);
    //     // var reqstr = data || '{src:""}';

    //     pic.attr('src', base64).css('opacity',1);// 新加的 20170802 
    // });
}

function postImgIphone(base64, imgId, inputId) {
    var pic = $('#' + imgId);
    var ipt = $('#' + inputId + '-src');

    var photoType = photoTypeFn(inputId);

    var uri = "/msxfInterface/file/singleUpload.do";
    var file = base64;

    var fd = new FormData(); // 创建表单对象
    // 创建请求主体对象:
    try {
        var xhr = new XMLHttpRequest(); // 兼容火狐 chrome
    } catch (e) {
        console.log('开起 ie 兼容');
        var xhr = new ActiveXObject("Microsoft.XMLHTTP"); // 兼容 ie
    }

    fd.append("photoBase64Code", file); // 添加文件到表单
    xhr.upload.addEventListener("progress", function(evt) {
        // pic.attr('src', "/view/images/lodding.gif");
    }, false);
    xhr.open("POST", uri + "?openId=" + $.cookie('openId') +'&photoType='+ photoType  , true);
    xhr.send(fd);
    xhr.onreadystatechange = function(i) {
        clearTimeout(window['setTimeFlag'+ imgId]);
        if (xhr.readyState == 4 && xhr.status == 200) {
            
            var b = xhr.responseText;
            console.log(b)
            // if(b!="") {
            //     b="\"{"+b.split("{")[1];
            // }

            // var reqstr = eval(b) ;
            /*let reqstr = JSON.parse(b);*/
            var req = JSON.parse(b)// JSON.parse(reqstr.replace(/[\\]/g, ''));
            console.log(req);
            if(req.code==0){

                pic.attr('src', base64).css('opacity',1);
                // pic.attr('src', req.src);
                // ipt.value = req.src ;
                ipt.val(req.src);
            }else{
                alert(req.message);
            }
        }
    }
    window.uploadTimeoutFn = function (imgId){
        $.alert('上传失败，请重试!');
        // console.log(imgId)
        var pic = $('#' + imgId);
        // console.log(pic)
        pic.attr('src', pic.data('src') ).css('opacity',1);
        // window.location
    }
    window['setTimeFlag'+ imgId] = setTimeout('window.uploadTimeoutFn("'+ imgId +'")',10000)
}

//对图片旋转处理 added by lzk  
function rotateImg(img, direction, canvas) {
    //alert(img);  
    //最小与最大旋转方向，图片旋转4次后回到原方向    
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);    
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
    var height = img.height;
    var width = img.width;
    //var step = img.getAttribute('step');    
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值    
        step > max_step && (step = min_step);
    } else if (direction == 'left') {
        step--;
        step < min_step && (step = max_step);
    }
    //img.setAttribute('step', step);    
    /*var canvas = document.getElementById('pic_' + pid);   
    if (canvas == null) {   
        img.style.display = 'none';   
        canvas = document.createElement('canvas');   
        canvas.setAttribute('id', 'pic_' + pid);   
        img.parentNode.appendChild(canvas);   
    }  */
    //旋转角度以弧度值为参数    
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
}
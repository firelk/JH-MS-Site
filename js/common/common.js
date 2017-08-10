/**
 * Created by jie.ding on 2015/10/14.
 *
 * 公共方法处理
 *
 */
var x_application_id="VAYHH5";
var secret_key="50599c881f2a81198ee2e7f36b6130135229fcc5458e525d";
var base_url="http://basic5.msxf.lotest/credit_auth/";
var ua = navigator.userAgent || navigator.vendor || window.opera;
// 判断客户端版本
var CLIENT = {
	trident: /(Trident)/i.test(ua), // IE内核
	presto: /(Presto)/i.test(ua), // opera内核
	webKit: /(AppleWebKit)/i.test(ua), // google内核
	gecko: /(Trident)/i.test(ua), // 火狐内核
	ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
	android: /(Android|Linux)/i.test(ua),
	iPhone: /(iPhone|Mac)/i.test(ua),
	iPad: /(iPad)/i.test(ua),
	wechat: /(MicroMessenger)/i.test(ua),
	qq: /(QQ)/i.test(ua),
	pc: !/(Android|iPhone|iPod|iOS|SymbianOS|Windows Phone)/i.test(ua),
	mobile: /mobile|tablet|ip(ad|hone|od)|android/i.test(ua)
};

// 是否支持touch事件
var SUPPORT_TOUCH = ('ontouchstart' in window);
// 是否只支持touch事件
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && CLIENT.mobile;

// animation结束事件
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd animationend';
// transition结束事件
var transitionEnd = 'webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend';
// 键盘码
var KEYCODE = {
    "Backspace": 8,
    "Tab": 9,
    "Enter": 13,
    "Shift": 16,
    "Ctrl": 17,
    "Alt": 18,
    "Pause": 19,
    "CapsLock": 20,
    "Esc": 27,
    "Space": 32,
    "PageUp": 33,
    "PageDown": 34,
    "End": 35,
    "Home": 36,
    "Left": 37,
    "Up": 38,
    "Right": 39,
    "Down": 40,
    "Print": 44,
    "Insert": 45,
    "Delete": 46,
    "Help": 47,
    // 数字：主键盘数字和小键盘数字
    "Number": [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105],
    // 字母
    "Letter": [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90]
};

// 手机号规则前缀
var MOBILE_RULES = {
    // 移动
    mobile: '134|135|136|137|138|139|147|150|151|152|157|158|159|178|182|183|184|187|188',
    // 联通
    unicom: '130|131|132|145|155|156|176|185|186',
    // 电信
    telecom: '133|149|153|173|177|180|181|189',
    // 电信
    virtual: '170|171'
};

// 默认验证规则
var RULES = {

    // 必填项
    required: function(value) {
        return $.isNotEmpty(value);
    },

    // 姓名
    name: function(value) {
        return /^[\u4E00-\u9FA5][\u0391-\uFFE5\.]{0,18}[\u4E00-\u9FA5]$/.test(value);
    },
    //银行卡号
    bankCard: function(value) {
            return /^[\d]{14,19}$/.test(value);
    },
    // 身份证号码
    idCard: function(value) {
        var reg = /(^\d{17}([0-9]|X|x)$)/;
        if (reg.test(value)) {
            // 省份证验证真伪因素
            var FACTOR = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
            // 最后一位生成规则
            var LAST = ["1","0","X","9","8","7","6","5","4","3","2"];

            // 计算前17位身份证号关联因子对应的和
            var sum = 0;
            $.each(FACTOR, function(i, factor) {
                sum += factor * parseInt(value.charAt(i));
            });

            // 求最后一位对应序号
            var mod = sum % LAST.length;
            var last = LAST[mod];
            var _last = value.charAt(FACTOR.length);
            if (_last == 'x') _last = 'X';
            return last == _last;
        }
        return /(^\d{15}$)/.test(value);
    },

    // 手机号码
    mobile: function(value) {
        if (/(^[1][0-9]{10}$)/.test(value)) {
            var regArr = [];
            for (var key in MOBILE_RULES) {
                var mobileRules = MOBILE_RULES[key];
                regArr.push(mobileRules);
            }
            return new RegExp('^' + regArr.join('|')).test(value);
        }
        return false;
    },

    // 验证码
    smsCode: function(value) {
        return /^[\d]{4,8}$/.test(value);
    },
    address: function (value) {
        return /[\u4E00-\u9FA5]+/.test(value) && value.match(/[\u4E00-\u9FA5]/gm).length >= 5 && String(value).length <= 50;
    },
    checked: function (value) {
        return $('#agreement-radio').is(":checked");
    }

};

// Storage仿造对象
var FakeStorage = (function(){
    function FakeStorage() {};
    FakeStorage.prototype = {
        setItem : function (key, value) {
            this[key] = value;
        },
        getItem : function (key) {
            return typeof this[key] == 'undefined' ? null : this[key];
        },
        removeItem : function (key) {
            this[key] = undefined;
        },
        clear : function () {
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this.removeItem(key);
                }
            }
        },
        key : function(index){
            return Object.keys(this)[index];
        }
    };
    return new FakeStorage();
})();

/**
 * 存储对象
 * @param storage
 * @constructor
 */
var STORAGE = function(storage) {
    // 对象
    this.target = window[storage];
    try {
        var testKey = 'testKey' + new Date().getTime();
        this.target.setItem(testKey, '1');
        this.target.removeItem(testKey);
    } catch (error) {
        this.target = FakeStorage;
    }
};
STORAGE.prototype = {
    set: function(key, value) {
        this.target.setItem(key, value);
    },
    get: function(key) {
        return this.target.getItem(key) || '';
    },
    setJSON: function(key, value) {
        this.target.setItem(key, JSON.stringify(value));
    },
    getJSON: function(key) {
        return JSON.parse(this.target.getItem(key) || '{}');
    },
    remove: function(key) {
        this.target.removeItem(key);
    },
    clear: function() {
        this.target.clear();
    },
    key: function(index){
        this.target.key(index);
    }
};

/**
 * 工具类方法
 * @type {{parseHttpResponse: Function, getBankInfo: Function, sendSecurityCode: Function, openCamera: Function}}
 */
var CommonUtil = {

    /**
     * 编码Html字符
     * @param html
     * @returns {*}
     */
    htmlEncode: function(html) {
        return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;
    },

    /**
     * 解码Html字符
     * @param html
     * @returns {string}
     */
    htmlDecode: function(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent;
    },

    /**
     * 获得请求参数
     * @param url       请求路径
     * @param name      参数名
     * @returns {string}
     */
    getQueryString: function(url, name) {
        var search = /\?/.test(url) ? url.split('?')[1] : url;
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        return reg.test(search) ? RegExp.$2 : '';
    },

	/**
	 * 获得绝对路径，兼容IE下JS跳转不支持base标签的bug
	 * @param url
	 * @returns {*}
	 */
	getAP: function(url) {
		var appPath = (window._sitePath || '/');
		return /^[^\/]/.test(url) && !/(:\/\/)/.test(url) ? (/\/$/.test(appPath) ? appPath + url : appPath + '/' + url) : url;
	},

	/**
	 * 重定向页面，兼容IE下JS跳转页面不支持base标签的bug
	 * @param url 相对系统根路径
	 */
	redirectUrl: function(url) {
		location.href = this.getAP(url);
	},

	/**
	 * 替换当前页面，兼容IE下JS跳转页面不支持base标签的bug
	 * @param url 相对系统根路径
	 */
	replaceUrl: function(url) {
		location.replace(this.getAP(url));
	},

    /**
     * 重新加载页面
     */
    reloadPage: function(force) {
        if (force) {
            var href = window.location.href;
            href += (/\?/.test(href) ? '&' : '?') + '_=' + (+new Date());
            window.location.replace(href);
        } else {
            window.location.reload();
        }
    },
    //获取url中的参数
    getUrlParam:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    },
    // 存储对象
    sessionStorage: new STORAGE('sessionStorage'),

    // 存储对象
    localStorage: new STORAGE('localStorage'),

    /**
     * 解析http请求返回结果
     * @param {} response     	http请求结果，JSON对象{errorCode: 0, errorMsg: '', result: {}}
     * @param {} operText    	操作提示文本，若传入此参数，则根据成功标识显示对应提示信息，如：添加[可选]
     * @param {} onSuccess    	请求成功回调函数[可选]
     * @param {} onError    	请求失败回调函数[可选]
     */
    parseHttpResponse: function (response) {
        // 解析参数
        var operText = '', onSuccess = null, onError = null;
        var length = arguments.length;
        if (length > 1) {
            if ($.isFunction(arguments[1])) {
                onSuccess = arguments[1];
                onError = arguments[2];
            } else {
                operText = arguments[1];
                onSuccess = arguments[2];
                onError = arguments[3];
            }
        }

        // 是否显示提示信息
        var isAlert = $.isNotEmpty(operText);

        // 判断返回值是否存在
        if ($.isNotEmpty(response)) {
            // 判断是否成功
            if (response.errorCode == 0) {
                if (isAlert) {
                    $.success(operText + '成功', onSuccess);
                } else if ($.isFunction(onSuccess)) {
                    onSuccess();
                }
            } else {
                var errorMessage = $.empty2def(response.errorMsg);
                if (isAlert) {
                    $.error($.empty2def(errorMessage, operText + '失败'), function () {
                        if ($.isFunction(onError)) {
                            onError(errorMessage);
                        }
                    });
                } else if ($.isFunction(onError)) {
                    onError(errorMessage);
                }
            }
        } else {
            if (isAlert) {
                $.error(operText + '异常', onError);
            } else if ($.isFunction(onError)) {
                onError();
            }
        }
    },

    /**
     * 根据银行卡号信息解析银行卡信息
     * @param bankCard
     * @returns {*}
     */
    getBankInfo : function(bankCard) {
        // 银行卡信息
        var bankInfo = null;
        if ($.isArray(window.BANKCARD)) {
            $.each(window.BANKCARD, function(index, data) {
                if (data && data['start_with']) {
                    var reg = new RegExp('^' + data['start_with']);
                    if (reg.test(bankCard)) {
                        bankInfo = data;
                        return false;
                    }
                }
            });
        }
        return bankInfo;
    },

    /**
     * 省市县联动
     *
     * @param {} options 省市县配置
     *
     *              rootCode: '00000',
     *
     *              pCodeField: 'parentCode',
     * 				valueField: 'code',
     * 				textField: 'name',
     *
     *				prompt: '', // 提示信息
     *
     *              itemSelector: '', // 项选择器
     *
     * 				province: {
     * 					target: '',	// 对象
     * 					value: '',	// 初始值
     * 					onLoadSuccess: function() {} // 加载成功事件
     * 					onLoadError: function() {} // 加载失败事件
     * 					onChange: function(data) {
     * 						// 改变时执行 data: {value: '', text: ''}
     * 					}
     * 				},
     * 				city: {
     * 					target: '',	// 对象
     * 					value: '',	// 初始值
     * 					onLoadSuccess: function() {} // 加载成功事件
     * 					onLoadError: function() {} // 加载失败事件
     * 					onChange: function(data) {
     * 						// 改变时执行 data: {value: '', text: ''}
     * 					}
     * 				},
     * 				county: {
     * 					target: '',	// 对象
     * 					value: '',	// 初始值
     * 					onLoadSuccess: function() {} // 加载成功事件
     * 					onLoadError: function() {} // 加载失败事件
     * 					onChange: function(data) {
     * 						// 改变时执行 data: {value: '', text: ''}
     * 					}
     * 				}
     */
    regionLinkage: function(options) {

        // 默认配置
        var defaultOpts = {
            rootCode: '000000',

            pCodeField: 'parentCode',
            valueField: 'code',
            textField: 'name',

            prompt: '请选择',

            province: {
                target: '',
                value: ''
            },
            city: {
                target: '',
                value: ''
            },
            county: {
                target: '',
                value: ''
            }
        };

        // 获得联动配置信息
        var opts = $.extend(true, {}, defaultOpts, options);

        var pCodeField = opts.pCodeField,
            valueField = opts.valueField,
            textField = opts.textField,

            prompt = opts.prompt,

            itemSelector = opts.itemSelector,

            province = opts.province,
            city = opts.city,
            county = opts.county,

            $province = $(province.target),
            $city = $(city.target),
            $county = $(county.target);
            console.log(1111,$county)


        /**
         * 设置提示信息
         *
         * @param {} option 配置项
         */
        var setPrompt = function(option) {
            // 获得数据
            var $target = $(option.target);

            $target.empty();
            if ($.isNotEmpty(prompt)) {
                $target.append('<option value="" selected>' + prompt + '</option>').trigger('change');
            }
        };

        /**
         * 加载区域信息
         *
         * @param {} option 配置项
         * @param {} pCode	请求参数
         */
        var loadRegion = function(option, pCode) {
            // 获得数据
            var $target = $(option.target),
                _value = option.value,
                onLoadSuccess = option.onLoadSuccess,
                onLoadError = option.onLoadError;

            // 判断编码是否存在
            if ($.isEmpty(pCode) || !window.CITYS) {
                setPrompt(option);
            } else {
                var datas = [];
                $.each(window.CITYS.sort(), function(index, data) {
                    if (data[pCodeField] == pCode) {
                        datas.push(data);
                    }
                });
                var appendHTML = [], isChange = false;
                $.each(datas, function(i, data) {
                    var value = data[valueField], text = data[textField], selected = '';
                    // 判断是否初始化选中
                    if ($.isNotEmpty(value) && _value == value) {
                        selected = 'selected';
                        isChange = true;
                    }

                    // 追加字典项到下拉框中
                    appendHTML.push('<option value="' + value
                        + '" ' + selected + '>' + text
                        + '</option>');
                });
                $target.append(appendHTML.join(''));
                // 是否触发改变事件
                if (isChange) {
                    $target.trigger('change');
                }

                if ($.isFunction(onLoadSuccess)) onLoadSuccess();
            }

        };

        // 依次绑定数据联动
        if ($province.length) {

            // 初始化提示信息
            setPrompt(province);
            setPrompt(city);
            setPrompt(county);
            console.log(province,city,county)

            // 绑定省联动改变事件
            $province.on('change', function () {
                // 设置市级数据
                if ($city.length) {

                    // 初始化提示信息
                    setPrompt(city);
                    setPrompt(county);

                    // 获得省级代码
                    var code = $(this).val();
                    loadRegion(city, code);
                }
                 
                var value = $(this).val();
                console.log(value,'province value')
                var onChange = province.onChange;
                if ($.isFunction(onChange)) {
                    var text = $(this).find('option[value="' + value + '"]').text();
                    onChange.call(this, {
                        value: value,
                         text: text
                    });
                }

                if ($.isEmpty(value)) {
                    $(this).closest(itemSelector).next(itemSelector).hide();
                } else {
                    $(this).closest(itemSelector).next(itemSelector).show().find('SELECT').click();
                }

            }).closest(itemSelector).show();
            console.log($city,'$city111')
            // 设置市级数据
            if ($city.length) {

                // 初始化提示信息
                setPrompt(city);
                setPrompt(county);

                // 绑定省联动改变事件
                $city.on('change', function () {

                    // 设置县级数据
                    if ($county.length) {

                        // 初始化提示信息
                        setPrompt(county);

                        // 获得市级代码
                        var code = $(this).val();
                        loadRegion(county, code);
                    }
                    
                    var value = $(this).val();
                    console.log(value,'city value')
                    var onChange = city.onChange;
                    if ($.isFunction(onChange)) {
                        var text = $(this).find('option[value="' + value + '"]').text();
                        onChange.call(this, {
                            value: value,
                            text: text
                        });
                    }

                    if ($.isEmpty(value)) {
                        $(this).closest(itemSelector).next(itemSelector).hide();
                    } else {
                        $(this).closest(itemSelector).next(itemSelector).show();
                    }

                });
                console.log($county,'$county')
                // 设置县级数据
                if ($county.length) {

                    // 初始化提示信息
                    setPrompt(county);

                    // 绑定省联动改变事件
                    $county.on('change', function () {

                        var onChange = county.onChange;
                        if ($.isFunction(onChange)) {
                            var value = $(this).val();
                            var text = $(this).find('option[value="' + value + '"]').text();
                            onChange.call(this, {
                                value: value,
                                text: text
                            });
                        }

                    });
                    // console.log($(this))
                    // // 获得市级代码
                    // var code = $(this).val();
                    // loadRegion(county, code);
                }
            }

            // 加载省级数据
            loadRegion(province, opts.rootCode);

        }
    }
};

// 重写ajax请求，加入异步请求提示处理
(function (document, window, $) {
    'use strict';

    // 工具类
    $.extend($, {
        /**
         * 是否为空
         * @param obj
         * @returns {boolean}
         */
        isEmpty : function(obj) {
            return obj == null || obj === '';
        },

        /**
         * 是否不为空
         * @param obj
         * @returns {boolean}
         */
        isNotEmpty : function(obj) {
            return !this.isEmpty(obj);
        },

        /**
         * 依次判断参数返回非空参数，若为空则取下一个非空，直到结束为止均为空则返回空字符串
         *
         * @param {} params...
         */
        empty2def : function() {
            var value = '', length = arguments.length;
            for (var i = 0; i < length; i++) {
                if (this.isNotEmpty(arguments[i])) {
                    value = arguments[i];
                    break;
                }
            }
            return value;
        },

        /**
         * 过滤掉HTML信息
         * @param {String} source
         * @return filteredSource
         */
        filterHTML : function(source) {
            source = this.empty2def(source);
            return source instanceof String ? source.replace(/<[^>]*>/g, '') : source;
        },

        /**
         * 编码HTML标签
         *
         * @param {String}
         *            htmlStr
         * @return {String} _encodeHtmlStr
         */
        encodeHTMLTag : function(htmlStr) {
            var _htmlStr = htmlStr;
            if (this.isNotEmpty(htmlStr)) {
                _htmlStr = htmlStr.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/ /g, "&nbsp;").replace(/\'/g, "&#39;").replace(/\"/gm, '&quot;');
            }
            return _htmlStr;
        },

        /**
         * 解码HTML标签，确保字符串被encodeHTMLTag编码处理
         *
         * @param {String}
         *            htmlStr
         * @return {String} _decodeHtmlStr
         */
        decodeHTMLTag : function(htmlStr) {
            var _htmlStr = htmlStr;
            if (this.isNotEmpty(htmlStr)) {
                _htmlStr = htmlStr.replace(/(&lt;)/gm, '<').replace(/(&gt;)/gm, '>').replace(/(&nbsp;)/g, ' ').replace(/(&#39;)/g, "'").replace(/(&quot;)/gm, '"').replace(/(&amp;)/gm, '&');
            }
            return _htmlStr;
        },

        /**
         * 显示加载提示框
         */
        showPreloader : function() {
            var $overlay = $('.preloader-modal.modal-overlay');
            if ($overlay.length == 0) {
                $overlay = $('<div/>').addClass('preloader-modal modal-overlay')
                .html($('<div/>').addClass('preloader')).appendTo($('body'));
            }
            $overlay.addClass('modal-overlay-visible');
        },

        /**
         * 隐藏加载提示框
         */
        hidePreloader : function() {
            $('.preloader-modal.modal-overlay-visible').removeClass('modal-overlay-visible');
        },

        /**
         * 提示信息
         * @param msg   显示信息
         * @param delay 持续时间，默认2000，单位：毫秒
		 * @param callback 显示关闭后执行
         */
        toast : function(msg, delay, callback) {
			var _delay = isNaN(delay) || delay < 0 ? 2000 : delay;
			var _callback = $.isFunction(delay) ? delay : ($.isFunction(callback) ? callback : function() {});
            var $toast = $('<div/>').addClass('toast').html('<label>' + msg + '</label>').appendTo($('body'));
            $toast.addClass('toast-in');
            setTimeout(function() {
                $toast.remove();
				_callback();
			}, _delay);
            return $toast;
        },

		/**
		 * 提示信息
		 * @param icon	显示图标
		 * @param msg	显示信息
		 * @param delay 持续时间，默认2000，单位：毫秒
		 * @param callback 显示关闭后执行
		 */
		iconModal : function(icon, msg, delay, callback) {
			var _delay = isNaN(delay) || delay < 0 ? 2000 : delay;
			var _callback = $.isFunction(delay) ? delay : ($.isFunction(callback) ? callback : function() {});
			var $overlay = $('<div/>').addClass('modal-overlay').appendTo($('body'));
			var $modal = $('<div/>').addClass('modal').appendTo($overlay.addClass('modal-overlay-visible'));
			var $wrapper = $('<div/>').addClass('modal-wrapper').appendTo($modal);
			var $inner = $('<div/>').addClass('modal-inner').appendTo($wrapper);
			$inner.append('<div class="modal-icon"><img src="' + icon + '"/></div>');
			$inner.append('<div class="modal-text">' + msg + '</div>');
			setTimeout(function() {
				$overlay.remove();
				_callback();
			}, _delay);
            return $overlay;
		},

		/**
		 * 提示信息
		 * @param msg	显示信息
		 * @param delay 持续时间，默认2000，单位：毫秒
		 * @param callback 显示关闭后执行
		 */
		hint : function(msg, delay, callback) {
			return this.iconModal('img/icon/modal-hint.png', msg, delay, callback);
		},

		/**
		 * 提示信息
		 * @param msg	显示信息
		 * @param delay 持续时间，默认2000，单位：毫秒
		 * @param callback 显示关闭后执行
		 */
		success : function(msg, delay, callback) {
			return this.iconModal('img/icon/modal-success.png', msg, delay, callback);
		},

		/**
		 * 提示信息
		 * @param msg	显示信息
		 * @param delay 持续时间，默认2000，单位：毫秒
		 * @param callback 显示关闭后执行
		 */
		warn : function(msg, delay, callback) {
			return this.iconModal('img/icon/modal-warn.png', msg, delay, callback);
		},

		/**
		 * 提示信息
		 * @param msg	显示信息
		 * @param delay 持续时间，默认2000，单位：毫秒
		 * @param callback 显示关闭后执行
		 */
		error : function(msg, delay, callback) {
			return this.iconModal('img/icon/modal-error.png', msg, delay, callback);
		},

        /**
         * 提示框
         * @param msg       信息
         * @param title     标题[可选]
         * @param callback  确认回调函数
         */
        alert : function(msg, title, callback) {
            var $overlay = $('<div/>').addClass('modal-overlay').appendTo($('body'));
            var $modal = $('<div/>').addClass('modal').appendTo($overlay.addClass('modal-overlay-visible'));
            var $wrapper = $('<div/>').addClass('modal-wrapper').appendTo($modal);
            var $inner = $('<div/>').addClass('modal-inner').appendTo($wrapper);
            if ($.isFunction(title)) {
                callback = title;
            } else if ($.isNotEmpty(title)) {
                $inner.append('<div class="modal-title">' + title + '</div>');
            }
            $inner.append('<div class="modal-text">' + msg + '</div>');

            // 设置按钮
            var $buttons = $('<div/>').addClass('modal-buttons').appendTo($inner);
            $('<span class="modal-button">确定</span>').on('click', function() {
                if ($.isFunction(callback)) {
                    callback();
                }
                $overlay.remove();
            }).appendTo($buttons);
            return $overlay;
        },
        alert2 : function(msg, title, callback) {
            var $overlay = $('<div/>').addClass('modal-overlay').appendTo($('body'));
            var $modal = $('<div/>').addClass('modal').appendTo($overlay.addClass('modal-overlay-visible'));
			var $wrapper = $('<div/>').addClass('modal-wrapper').appendTo($modal);
            var $inner = $('<div/>').addClass('modal-inner').appendTo($wrapper);
            if ($.isFunction(title)) {
                callback = title;
            } else if ($.isNotEmpty(title)) {
                $inner.append('<div class="modal-title">' + title + '</div>');
            }
            $inner.append('<div class="modal-text">' + msg + '</div>');

            // 设置按钮
            // var $buttons = $('<div/>').addClass('modal-buttons').appendTo($inner);
            // $('<span class="modal-button">确定</span>').on('click', function() {
            //     if ($.isFunction(callback)) {
            //         callback();
            //     }
            //     $overlay.remove();
            // }).appendTo($buttons);
            return $overlay;
        },

		/**
		 * 确认提示框
		 * @param msg       信息
		 * @param title     标题[可选]
		 * @param callback1 确认回调函数
		 * @param callback2 取消回调函数
		 */
		confirm : function(msg, title, callback1, callback2) {
			var $overlay = $('<div/>').addClass('modal-overlay').appendTo($('body'));
			var $modal = $('<div/>').addClass('modal').appendTo($overlay.addClass('modal-overlay-visible'));
			var $wrapper = $('<div/>').addClass('modal-wrapper').appendTo($modal);
			var $inner = $('<div/>').addClass('modal-inner').appendTo($wrapper);
			var yes = callback1, no = callback2;
			if ($.isFunction(title)) {
				yes = title;
				no = callback1;
			} else if ($.isNotEmpty(title)) {
				$inner.append('<div class="modal-title">' + title + '</div>');
			}
			$inner.append('<div class="modal-text">' + msg + '</div>');

			// 设置按钮
			var $buttons = $('<div/>').addClass('modal-buttons group').appendTo($inner);
			$('<span class="modal-button">取消</span>').on('click', function() {
				if ($.isFunction(no)) {
					no();
				}
				$overlay.remove();
			}).appendTo($buttons);
			$('<span class="modal-button">确定</span>').on('click', function() {
				if ($.isFunction(yes)) {
					yes();
				}
				$overlay.remove();
			}).appendTo($buttons);
            return $overlay;
		}

    });

    /**
     * 拓展属性方法
     */
    $.extend($.fn, {

        /**
         * 定义添加enter快键事件 注意：请在对象添加keyup事件前执行此方法，否则之前的keyup事件将无效
         *
         * @param {}
         *            handler 事件处理函数
         */
        addEnterListener : function(handler) {
            var _this = this;
            var $this = $(_this);
            // 事件方法
            var fn = function(e) {
                // 判断是否为textarea
                if ($(this).is('textarea'))
                    return;
                var keyCode = parseInt(e.keyCode || e.which, 10);
                // 判断是否为Enter键
                if (keyCode == KEYCODE.Enter && $.isFunction(handler)) {
                    handler.call(this, e);
                }
                return false;
            };
            // 解绑对象对应keyup事件
            $this.off({keyup: fn}).on({keyup: fn});
            return this;
        },

        /**
         * 序列化数据为JSON对象，依赖$.fn.serializeArray
         */
        serializeJSON : function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o.hasOwnProperty(this.name)) {
                    if (!$.isArray(o[this.name])) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push($.empty2def(this.value));
                } else {
                    o[this.name] = $.empty2def(this.value);
                }
            });
            return o;
        },

        /**
         * 日期时间格式化
         *
         * @param {Date} val     信息数据
         *
         * @param {String} fmt   格式
         */
         dateFormatFn:function(val,fmt){
            if(Number(val)==NaN||val.toString().length<9){
                return val
            }
            var _this = new Date(val);
            // console.log(_this,_this.getFullYear())
            fmt = fmt || 'yyyy-MM-dd'
            var o = {
                "M+": _this.getMonth() + 1, //月份 
                "d+": _this.getDate(), //日 
                "h+": _this.getHours(), //小时 
                "m+": _this.getMinutes(), //分 
                "s+": _this.getSeconds(), //秒 
                "q+": Math.floor((_this.getMonth() + 3) / 3), //季度 
                "S": _this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)){
                fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o){
                if (new RegExp("(" + k + ")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },
        /**
         * 表单数据初始化赋值
         *
         * @param {Object} data 	信息数据
         *
         * @param {String} attrName	属性名称，默认name
         */
        formData : function(data, attrName) {
            // 获取赋值属性明
            attrName = $.empty2def(attrName, 'name');
            return this.each(function() {
                if ($.isPlainObject(data)) {
                    var $this = $(this);
                    for (var field in data) {

                        // 获得字段
                        var $field = $this.find('[' + attrName + '="' + field + '"]');
                        $field.setValue($.empty2def(data[field]));

                    }
                }
            });
        },

        /**
         * jQuery对象赋值，若非表单输入项则设置文本
         *
         * @param {} value 值，checkbox或select multiple项值用','隔开
         */
        setValue : function(value) {
            value = $.empty2def(value);
            return this.each(function() {
                var $this = $(this);
                if ($this.is('[type="radio"]')) {
                    $this.filter('[value="' + value + '"]').prop('checked', true);
                } else if ($this.is('[type="checkbox"]')) {
                    var vals = value.split(',');
                    $.each(vals, function(i, val) {
                        $this.filter('[value="' + val + '"]').prop('checked', true);
                    });
                } else if ($this.is('select')) {
                    // 判断是否为多选下拉框
                    if ($this.prop('multiple')) {
                        var vals = value.split(',');
                        $.each(vals, function(i, val) {
                            $this.find('option[value="' + val + '"]').prop('selected', true);
                        });
                    } else {
                        $this.find('option[value="' + value + '"]').prop('selected', true).siblings('option').prop('selected', false);
                    }
                } else if ($this.is('input,textarea')) {
                    $this.val(value);
                } else {
                    $this.setText(value);
                }
            });
        },

        /**
         * jQuery对象设置文本
         *
         * @param {} text 待设置文本
         */
        setText : function(text) {
            text = $.filterHTML($.empty2def(text));
            return this.each(function () {
                var $this = $(this);
                var dictionary = $this.attr('data-dictionary');
                if ($.isNotEmpty(dictionary)) {
                    $this.text(Dictionary.text(dictionary, text));
                } else {
                    $this.text(text);
                }
            });
        },

        /**
         * 验证对象
         * @param rules			验证规则
         * @param isAlert		是否显示提示信息，默认true
         * @returns {boolean}	是否成功
         */
        validator : function(rules, isAlert) {
            var isPass = true;

            rules = $.empty2def(rules, {});

            // 验证规则合并
            $.extend(rules, RULES);

            // 依次验证
            $(this).find('[data-rule]:not(:disabled):not(.disabled)').removeAttr('data-rule-error').each(function() {

                var isContinue = true;

                var $this = $(this);

				// 获取属性值
				var value = $this.val();
				if ($this.is('[type=checkbox]')) {
					value = $this.is(':checked') ? value : '';
				}

                // 获得验证规则
                var _rules = $this.attr('data-rule').split(' ');
                $.each(_rules, function(index, rule) {
                    if (rules.hasOwnProperty(rule)) {
                        // 验证未通过
                        if (!rules[rule](value)) {
                            isPass = false;
                            $this.attr('data-rule-error', true);
                            if (isAlert !== false) {
                                var placeholder = $this.attr('placeholder');
                                var msg = $.empty2def($this.attr('data-rule-' + rule), $this.attr('data-rule-msg'), placeholder);
                                $.warn(rule === 'required' ? $.empty2def($this.attr('data-rule-required'), placeholder, msg) : msg);
                            }
                            isContinue = false;
                            return false;
                        }
                    }
                });

                return isContinue;
            });

            return isPass;
        },

        /**
         * 设置对象不可用
         *
         * @param {} disableText	对象不可用状态时的文本
         */
        disable : function(disableText) {
            return this.each(function() {
                var $this = $(this);
                if ($.isEmpty(disableText)) {
                    // 设置对象不可用状态
                    $this.prop('disabled', true).addClass('disabled');
                } else {
                    // 获得对象文本
                    var defaultText = $.empty2def($this.data('defaultText'), $this.val(), $this.html());
                    // 设置对象不可用状态
                    $this.data('defaultText', defaultText).setValue(disableText).prop('disabled', true).addClass('disabled');
                }
            });
        },

        /**
         * 设置对象可用
         */
        enable : function() {
            return this.each(function() {
                var $this = $(this);
                // 获得对象默认文本
                var defaultText = $this.data('defaultText');
                if ($.isNotEmpty(defaultText)) {
                    // 恢复对象可用状态
                    $this.setValue(defaultText).data('defaultText', '');
                }
                // 恢复对象可用状态
                $this.prop('disabled', false).removeClass('disabled');
            });
        },

        /**
         * 按钮倒计时
         * @param {} second
         */
        countDown : function(second) {
            var time = $.empty2def(second, 60);
            return this.each(function() {
                var $btn = $(this);
                var _time = time;
                $btn.disable(_time + ' 秒');
                var setTime = function () {
                    if (_time > 0) {
                        $btn.disable(_time + ' 秒');
                        setTimeout(setTime, 1000);
                    } else {
                        $btn.enable();
                    }
                    _time--;
                };

                setTime();
            });
        }
    });

	/**
	 * 实现prevAll方法
	 * @param selector
	 * @returns {*|jQuery|HTMLElement}
	 */
	if (!$.isFunction($.fn.prevAll)) {
		$.fn.prevAll = function(selector) {
			var $this = $(this), $els = $();
			var $el = $this.prev();
			while( $el.length ) {
				if(typeof selector === 'undefined' || $el.is(selector)) $els = $els.add($el);
				$el = $el.prev();
			}
			return $els
		};
	}

	/**
	 * 实现nextAll方法
	 * @param selector
	 * @returns {*|jQuery|HTMLElement}
	 */
	if (!$.isFunction($().nextAll)) {
		$.fn.nextAll = function (selector) {
			var $this = $(this), $els = $();
			var $el = $this.next();
			while ($el.length) {
				if (typeof selector === 'undefined' || $el.is(selector)) $els = $els.add($el);
				$el = $el.next();
			}
			return $els
		};
	}

    // ajax请求发送期间禁用对象缓存
    var disableCache = [];
    // 默认ajax Load配置项
    var defaultAjxjLoad = true;
    // 全局设置ajax请求蒙板配置
    $.ajaxLoad = defaultAjxjLoad;

    // ajax请求对应各状态处理事件
    $(document).on('ajaxSend', function (event, xhr, ajaxOptions) { // 发送前
        // 是否定义了禁用对象
        var disable = ajaxOptions.disable;
        if (disable && $(disable).length) {
            disableCache.push($(disable).disable());
        }
        // 判断是否为异步请求
        if (ajaxOptions.async == null || ajaxOptions.async) {
            $.ajaxLoad = $.empty2def(ajaxOptions.loading, defaultAjxjLoad);
            // 是否显示蒙板
            if ($.ajaxLoad) {
                $.showPreloader();
            }
        }
    }).on('ajaxStop', function () { // 停止
        // 判断是否关闭加载蒙板
        $.hidePreloader();
        // 重置ajax请求全局设置
        $.ajaxLoad = defaultAjxjLoad;
        // 依次恢复禁用状态
        while (disableCache.length) {
            var $disable = disableCache.shift();
            // 恢复禁用状态
            $disable.enable();
        }
    });

    // 重写ajax方法
    var _ajax = $.ajax;
    /**
     * 重写ajax底层方法
     * @param {} url        请求地址[可选]
     * @param {} settings    请求设置
     */
    $.ajax = function () {
        // 获得请求设置
        var _settings = {
			// 设置超时时间
			timeout: 0,
            // 设置请求编码类型为UTF-8
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            // 是否缓存数据
            cache: false,
            // 默认异步请求
            async: true,
            // 请求发送期间禁用对象：如.ms-btn-submit，默认.ms-btn-submit
            disable: '.button:not(:disabled):not(.disabled)',
            // 自定义请求加载蒙板配置
            loading: defaultAjxjLoad
        };

        // 继承默认配置
        if (typeof arguments[0] === 'string') {
            $.extend(_settings, {url: $.empty2def(arguments[0])}, $.empty2def(arguments[1], {}));
        } else {
            $.extend(_settings, $.empty2def(arguments[0], {}));
        }

         if (_settings.type.toUpperCase() != 'GET' && /json/.test(_settings.contentType)) {
             // 请求参数转换成json字符串
             var data = _settings.data;
             if (data && $.isPlainObject(data)) {
                 _settings.data = JSON.stringify(data);
             }
         }

        // 此处可以进行ajax请求公共控制
        var _success = _settings.success;
        // 重写请求成功回调函数
        _settings.success = function(data, status, xhr) {
            try {
                if ($.isNotEmpty(data)) {
                    var json = data;
                    if (typeof json == 'string') {
                        // 转换json对象
                        json = JSON.parse(json);
                    }
                    var errorCode = json.errorCode;
                    switch (errorCode) {
                        case  '40011007': // 未登录
                            CommonUtil.redirectUrl('auth/login');
                            return;
                        case '40083015': // 有正在申请的申请单
                            var id = data.errorMsg || '';
                            CommonUtil.redirectUrl('loan/applying?id=' + id);
                            return;
                    }
                }
                if ($.isFunction(_success)) {
                    _success(data, status, xhr);
                }
            } catch (e) {
                if ($.isFunction(_success)) {
                    _success(data, status, xhr);
                }
            }
        };

        // 重写请求异常回调函数
        var _error = _settings.error;
        _settings.error = function (xhr, errorType, error) {
            if ($.isFunction(_error)) {
                _error(xhr, errorType, error);
            } else {
                $.error('对不起，系统异常，请稍候再试！');
            }
        }

        // 调用ajax方法发送请求
        return _ajax(_settings);
    };

    /**
     * 获得ajax配置
     * @param url       请求路径
     * @param data      请求参数[可选]
     * @param success   成功回调函数
     * @param settings  请求配置
     */
    var getAjaxSettings = function(url, data, success, settings) {
        // 获取参数，并重新设置ajax请求url
        var _url = CommonUtil.getAP(url),
            _data = {},
            _success = null,
            _settings = {
                loading: true
            };

        // 判断第二个参数是否为方法
        if ($.isFunction(data)) {
            _success = data;
            $.extend(true, _settings, $.empty2def(success, {}));
        } else {

            _data = $.empty2def(data, {});
            _success = success;
            $.extend(true, _settings, $.empty2def(settings, {}));
        }

        // 返回配置信息
        return $.extend({
            url: _url,
            data: _data,
            dataType: 'json',
            success: _success
        }, _settings);
    };

    /**
     * 发送GET请求获得JSON数据
     * @param url       请求路径
     * @param data      请求参数[可选]
     * @param success   成功回调函数
     * @param settings  请求配置
     */
    $.getJSON = function(url, data, success, settings) {
        // 发起GET请求
        return $.ajax($.extend(getAjaxSettings(url, data, success, settings), {
            type: 'GET'
        }));
    };

    /**
     * 发送POST请求获得JSON数据
     * @param url       请求路径
     * @param data      请求参数[可选]
     * @param success   成功回调函数
     * @param settings  请求配置
     */
    $.postJSON = function(url, data, success, settings) {
        // 发起GET请求
        return $.ajax($.extend(getAjaxSettings(url, data, success, settings), {
            type: 'POST',
            contentType: "application/json; charset=UTF-8"
        }));
    };

    /**
     * 发送POST请求获得JSON数据
     * @param url       请求路径
     * @param data      请求参数[可选]
     * @param success   成功回调函数
     * @param settings  请求配置
     */
    $.postForm = function(url, data, success, settings) {
        // 发起GET请求
        return $.ajax($.extend(getAjaxSettings(url, data, success, settings), {
            type: 'POST'
        }));
    };

    // 系统初始化默认处理
    $(document).ready(function() {
        $.hidePreloader();
        // 监听前端JS错误
        // window.onerror = function(e) {
        //     $.postJSON('common/logger/error', {message: '>>>>>> JavaScript异常：' + JSON.stringify(e)}, null, {disable: null,loading: false});
        // };

        window.onpopstate = function(event) {
            $.hidePreloader();
        };

        $(document).on('submit', 'form', function(e) {
            e.preventDefault();
            return false;
        });

        // 手机端touch active样式
        $(document).on({
            'touchstart': function(e) {
				$(this).addClass('active');
            },
            'touchend touchcancel': function(e) {
				$(this).removeClass('active');
            }
        }, 'button,.button,.item-link');

        // 只接受数字
        $(document).on({
            'keypress': function(e) {
                var keyCode = e.keyCode || e.which;
                return $.inArray(keyCode, [KEYCODE.Backspace, KEYCODE.Delete, KEYCODE.Tab, KEYCODE.Enter,
                        KEYCODE.CapsLock, KEYCODE.Esc, KEYCODE.Up, KEYCODE.Down, KEYCODE.Left, KEYCODE.Right]) != -1 || /^[\d]*$/.test(String.fromCharCode(keyCode));
            },
            'input': function(e) {
                var $this = $(this);
                var value = $this.val(),
                    _value = value.replace(/[^\d]/g, '');
                if (value !== _value) $this.val(_value);
            },
            'keyup': function(e) {
                var $this = $(this);
                var value = $this.val(),
                    _value = value.replace(/[^\d]/g, '');
                if (value !== _value) $this.val(_value);
            }
        }, '[acceptNumeric]');

        // 下拉选择框样式重写辅助器
        $(document).on('propertychange change blur', '.select-assistor+select,.select-assistor+input', function(e) {
            var $this = $(this);
            var value = $this.val();
            var $assistor = $this.prev('.select-assistor').val(value);
            if ($.isNotEmpty(value)) {
                if ($this.is('select')) {
                    $assistor.val($.trim($this.find('option[value="' + value + '"]').text()));
                }
            }
        }).on('focus', '.select-assistor', function(e) {
            $(this).next().focus();
        }).on('touchstart click', '.popup .nav .back', function(e) {
			e.preventDefault();
			$(this).closest('.modal-in').removeClass('modal-in');
		});

        // 默认加载省市区联动
        $('.region-box').each(function() {
            var $this = $(this);
            CommonUtil.regionLinkage({
                itemSelector: '.region-item',
                province: {
                    target: $this.find('SELECT[data-region=provinceCode]'),
                    value: $this.find('SELECT[data-region=provinceCode]').data('value'),
                    onChange: function(data) {
                        $(this).next('INPUT[data-region=provinceName]').val(data.text);
                    }
                },
                city: {
                    target: $this.find('SELECT[data-region=cityCode]'),
                    value: $this.find('SELECT[data-region=cityCode]').data('value'),
                    onChange: function(data) {
                        $(this).next('INPUT[data-region=cityName]').val(data.text);
                    }
                },
                county: {
                    target: $this.find('SELECT[data-region=countyCode]'),
                    value: $this.find('SELECT[data-region=countyCode]').data('value'),
                    onChange: function(data) {
                        $(this).next('INPUT[data-region=countyName]').val(data.text);
                    }
                }
            });
        });

		// 页面布局
		(function() {
			var $intro = $('.fixed-bottom');
			if ($intro.length > 0) {
				var $prev = $intro.prev();

				// 举例顶部高度
				var topHeight = $prev.position().top + $prev.height() + $intro.height();

				// 判断是否重新设置介绍文本位置
				if (topHeight > $(window).height()) {
					$intro.css({
						position: 'relative'
					});
				}

				// 自适应
				$(window).on('resize', function() {
					// 判断是否重新设置介绍文本位置
					if (topHeight > $(window).height()) {
						$intro.css({
							position: 'relative'
						});
					} else {
						$intro.css({
							position: 'fixed'
						});
					}
				});
			}
		})();
    });
})(document, window, window.jQuery || window.Zepto);
Dictionary.load(function () {});

var urlback= CommonUtil.getUrlParam("redirect_url");
console.log(urlback);

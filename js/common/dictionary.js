/**
 * 数据字典对象
 * @author 丁杰
 */
var Dictionary = {

	// 字典缓存
	cache: {
		// 贷款用途
		loanUsage: {
            'PL18': '购物',
            'PL01': '家用电器',
            'PL02': '数码产品',
            'PL03': '国内教育',
            'PL04': '出境留学',
            'PL05': '装修',
            'PL06': '婚庆',
            'PL07': '旅游',
            'PL08': '租赁',
            'PL14': '医疗',
            'PL15': '美容',
            'PL16': '家具',
            'PL17': '生活用品'
		},

        // 婚姻状况
        familyMaritalStatus: {
            '10': '未婚',
            '20': '已婚',
            '90': '其他'
        },

        // 住房状况
        familyHouseType: {
            '1': '自置无按揭',
            '2': '自置有按揭',
            '3': '亲属楼宇',
            '4': '集体宿舍',
            '5': '租房',
            '7': '其他 '
        },

        // 关系（家人）全部
        familyRelation: {//家人
            'RF01': '配偶',
            'RF02': '父亲',
            'RF03': '母亲',
            'RF04': '兄弟',
            'RF05': '姐妹',
            'RF06': '子女'
        },
        // 关系（家人）未婚
        familyRelation10: {//家人
            'RF02': '父亲',
            'RF03': '母亲',
            'RF04': '兄弟',
            'RF05': '姐妹',
            'RF06': '子女'
        },
        // 关系（家人）已婚
        familyRelation20: {//家人
            'RF01': '配偶'
        },

        // 关系（非家人）
        societyRelation: {//非家人
            'R002': '同学',
            'R003': '同事',
            'R004': '朋友',
            'R005': '其他'
        },

        // 所有关系
        allRelation: {
            'RF01': '配偶',
            'RF02': '父亲',
            'RF03': '母亲',
            'RF04': '兄弟',
            'RF05': '姐妹',
            'RF06': '子女',
            'R002': '同学',
            'R003': '同事',
            'R004': '朋友',
            'R005': '其他'
        },

        // 社会身份
        socialStatus: {
            'SI01': '学生',
            'SI02': '在职人员',
            'SI04': '企业负责人',
            'SI03': '自由职业',
            'SI05': '无业',
            'SI06': '退休 '
        },

        // 教育程度
        education: {
            "LE08": "博士及以上",
            "LE07": "硕士",
            "LE06": "大学本科",
            "LE05": "大学专科/专科学校",
            "LE09": "高中/中专/技校",
            "LE10": "初中",
            "LE11": "初中以下"
        }
	},

	/**
	 * 根据数据字典编码获得对应字典项信息
	 *
	 * @param {}
	 *            code 字典编码
	 * @param {}
	 *            onSuccess 获取成功回调函数
	 * @param {}
	 *            onFault 获取失败回调函数
	 * @param {}
	 *            onComplete 获取完成回调函数
	 */
	get: function(code, onSuccess, onFault, onComplete) {
		var _this = this;
		// 判断字典编码是否存在
		if ($.isEmpty(code)) {
			if ($.isFunction(onFault)) {
				onFault();
			}
			return null;
		}
		// 判断是否缓存字典信息
		if (_this.cache.hasOwnProperty(code)) {
			var data = $.empty2def(_this.cache[code], {});
			if ($.isFunction(onSuccess)) {
				onSuccess(data);
			}
			if ($.isFunction(onComplete)) {
				onComplete();
			}
			return data;
		}
	},

	/**
	 * 获得字典对应字典项文本
	 * @param {} code	字典编码
	 * @param {} value	字典项编码
	 */
	text: function(code, value) {
		var _this = this;
		// 字典项文本
		var libarayText = '';
		// 判断字典编码是否存在
		if ($.isEmpty(code) || $.isEmpty(value)) return libarayText;
		// 过滤字典项中的HTML标签
		value = $.filterHTML(value);
		// 判断是否缓存字典信息
		if (_this.cache.hasOwnProperty(code) && _this.cache[code].hasOwnProperty(value)) {
			libarayText = $.empty2def(_this.cache[code][value]);
		}
		return libarayText;
	},

	/**
	 * 加载字典到下拉框对象中，加载包含data-dictionary属性的项
	 * @param {} $dictionary	待加载字典对象[可选]
	 * 				data-dictionary/data-dictionary-key/data-dictionary-default 默认配置，分别表示字典编码、项值对应键、初始化默认项值
	 * @param {} complete		全部加载完成执行
	 */
	load: function() {
		var _this = this;

		// 解析参数
		var $dictionary = $('[data-dictionary]'), complete = null;
		if (arguments.length > 0) {
			if (arguments[0].jquery) {
				$dictionary = arguments[0];
				complete = arguments[1];
			} else {
				complete = arguments[0];
			}
		}

		// 判断需加载字典个数
		var surplusLoads = $dictionary.length;
		// 判断是否已经全部加载
		if (surplusLoads == 0 && $.isFunction(complete)) {
			complete();
			return;
		}

		/**
		 * 加载字典项
		 * @param {} domEl DOM节点
		 */
		var loadOptions = function(domEl) {
			// 获得jQuery对象
			var $this = $(domEl);
			// 获得字典编码
			var code = $.empty2def($this.attr('data-dictionary'), $this.attr('name'));
			// 项值对应键，编码：0，文本：1，默认使用0
			var key = $this.attr("data-dictionary-key");
			// 获得初始默认值
			var defaultValue = $this.attr("data-dictionary-default");

			/**
			 * 获得字典项成功回调函数
			 * @param {Array} datas 字典项信息
			 */
			var onSuccess = function(data) {
				for (var id in data) {
					var text = $.empty2def(data[id]);
					// 创建字典项
					var $option = $('<option/>').val(id).html(text);
					// 判断是否使用文本做为值
					if (key == '1') {
						$option.val(text);
					}
					// 追加字典项到下拉框中
					$this.append($option);
				}
				// 判断是否默认选中项
				if ($.isNotEmpty(defaultValue)) {
					$this.children('option[value="' + defaultValue + '"]')
						.prop('selected', true).siblings('option').prop(
						'selected', false);
				}
				$this.trigger('change');
			};

			/**
			 * 加载完成执行
			 */
			var onComplete = function() {
				surplusLoads--;
				// 判断是否已经全部加载
				if (surplusLoads == 0 && $.isFunction(complete)) {
					complete();
				}
			};

			// 获得字典数据，并设置到下拉框中
			_this.get(code, onSuccess, null, onComplete);
		};

		// 加载所有字典项
		$dictionary.each(function(){
			loadOptions(this);
		});
	}
};
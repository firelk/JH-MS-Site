/**
 * Created by jie.ding on 2016/2/2.
 */
$(function() {

	/**
	 * 设置transition
	 * @param transition
	 * @returns {*|Array|Object|string}
	 */
	$.fn.setTransition = function(transition) {
		return this.each(function() {
			$(this).css({
				'-webkit-transition': transition,
				'-moz-transition': transition,
				'-ms-transition': transition,
				'-o-transition': transition,
				'transition': transition,
			});
		});
	};

	/**
	 * 创建滑动条
	 *
	 * @param {} options
	 *              value: 100,     // 初始化值
	 *              min: 100,       // 最小值
	 *              max: 10000,     // 最大值
	 *              step: 100       // 滑动一次间隔
	 *              onChange: function(value) {}    // 发生变化时触发
	 */
	$.fn.tickSlider = function(_options) {
		// 默认参数
		var _default = {
			value: 1000,
			min: 1000,
			max: 10000,
			step: 100,
			stride: 1000,
			onChange: function(value) {}
		};

		// 获得参数信息
		var options = $.extend({}, _default, _options || {});

		return this.each(function() {
			var $this = $(this);

			// 创建刻度滑动条
			var $slider = $('<div/>').addClass('tick-slider');
			var $mark = $('<span/>').addClass('mark').prependTo($('<label/>').html('<span>元</span>').appendTo($('<div/>').addClass('slider-label').appendTo($slider)));
			var $box = $('<div/>').addClass('slider-box').appendTo($slider);
			var $ticks = $('<div/>').addClass('slider-tick-box').appendTo($box);
			// 获得对应配置参数
			var min = parseInt(options.min, 10), max = parseInt(options.max, 10), step = parseInt(options.step, 10), stride = parseInt(options.stride, 10);
			// 循环创建刻度
			for (var i = min; i <= max; i+=step) {
				var $tick = $('<div/>').addClass('tick').appendTo($ticks);
				if (i % stride == 0) {
					$tick.addClass('stride');
					$tick.html('<label>' + i + '</label>');
				}
			}
			$('<div/>').addClass('slider-tick-line').appendTo($slider);

			$slider.appendTo($this);

			// 获得刻度宽度
			var tickWidth = $ticks.find('.tick').first().width();

			/**
			 * 获得有效值
			 * @param value
			 */
			var getEffectiveValue = function(value) {
				return Math.max(min, Math.min(max, value));
			};

			/**
			 * 获得Left
			 * @param value
			 * @returns {number}
			 */
			var getLeft4value = function(value) {
				return -1 * parseInt(Math.abs(getEffectiveValue(value) - min) / step * tickWidth);
			};

			// 获得最小值
			var maxLeft = 0, minLeft = getLeft4value(max);

			/**
			 * 获得有效Left
			 * @param left
			 */
			var getEffectiveLeft = function(left) {
				return Math.max(Math.min(left, maxLeft), minLeft);
			};

			/**
			 * 获得Value
			 * @param value
			 * @returns {number}
			 */
			var getValue4Left = function(left) {
				return min + parseInt(Math.abs(step * getEffectiveLeft(left) / tickWidth));
			};

			/**
			 * 获得当前值
			 * @returns {Number}
			 */
			var getValue = function() {
				return parseInt($mark.text(), 10);
			};

			/**
			 * 设置Left
			 * @param left
			 */
			var setLeft = function(left) {
				$ticks.css({
					'margin-left': getEffectiveLeft(left)
				});
			};

			/**
			 * 设置当前值
			 * @param value	值
			 */
			var setValue = function(value) {
				// 判断值
				value = getEffectiveValue(value);
				// 判断是否发生变化
				if (value != getValue()) {
					// 设置值
					$mark.text(value);
					// 触发onChange回调
					if ($.isFunction(options.onChange)) {
						options.onChange(value);
					}
				}
				setLeft(getLeft4value(value));
				$ticks.data('sliding', '');
			};

			// 初始化值
			setValue(options.value);

			// slider对象
			var slider = {
				// 最大、最小位置
				min: minLeft,
				max: maxLeft,
				// 递增
				increase: true,
				// 滑动前初始位置
				_startLeft: 0,
				// 开始坐标
				startCoord: null,
				// 滑动距离
				slideDistance: 0,
				// 开始时间
				startTime: 0,
				// 滑动时间
				slideTime: 0,
				// 当前是否允许滑动
				slidable : false,
				/**
				 * 获得当前位置坐标
				 * @param e
				 * @returns {{x: number, y: number}}
				 */
				getCoord : function(e) {
					var coord = {x: 0, y: 0};
					try {
						e.touches ? coord = {
							x: e.touches[0].pageX,
							y: e.touches[0].pageY
						} : (e.originalEvent && e.originalEvent.touches ? coord = {
							x: e.originalEvent.touches[0].pageX,
							y: e.originalEvent.touches[0].pageY
						} : coord = {
							x: e.pageX,
							y: e.pageY
						});
						var offset = $this.offset() || {left: 0, top: 0};
						coord.x = coord.x - offset.left;
						coord.y = coord.y - offset.top;
					} catch (e) {
						coord = {x: 0, y: 0};
					}
					return coord;
				},

				/**
				 * 开始滑动
				 * @param e
				 */
				onStart : function(e) {
					var _this = this;
					if (!_this.slidable && $ticks.data('sliding') !== 'sliding') {
						_this.slidable = true;
						_this._startLeft = getLeft4value(getValue());
						_this.startCoord = _this.getCoord(e);
						_this.increase = _this.startCoord.x >= $box.width() / 2;
						_this.startTime = +new Date();
						_this.slideDistance = 0;
						_this.slideTime = 0;
					}
				},

				/**
				 * 移动滑动
				 * @param e
				 */
				onMove : function(e) {
					var _this = this;
					if (_this.slidable) {
						var coord = _this.getCoord(e);
						// 计算滑动距离
						_this.slideDistance = _this.startCoord.x - coord.x;
						setLeft(_this._startLeft - _this.slideDistance);
					}
				},

				/**
				 * 结束滑动
				 */
				onEnd : function(e) {
					var _this = this;
					if (_this.slidable) {
						_this.slidable = false;
						_this.slideTime = (+new Date()) - _this.startTime;
						// 判断是否滑动
						if (Math.abs(_this.slideDistance) > tickWidth || _this.slideTime > 200) {
							// 计算步骤
							var steps = Math.ceil((_this.slideDistance + _this.slideDistance * 200 / _this.slideTime) / tickWidth);
							var value = getValue() + steps * step;
							var left = getLeft4value(getValue() + steps * step);
							if (left != getEffectiveLeft(_this._startLeft - _this.slideDistance)) {
								$ticks.data('sliding', 'sliding').setTransition('margin 400ms cubic-bezier(0.15,0.5,0.4,1)');
								setLeft(left);
								$ticks.on(transitionEnd, function() {
									$(this).data('sliding', '').setTransition('none').off(transitionEnd);
									setValue(getValue4Left(left));
								});
							} else {
								$ticks.data('sliding', '').setTransition('none').off(transitionEnd);
								setValue(getValue4Left(left));
							}
						} else {
							$ticks.data('sliding', '').setTransition('none').off(transitionEnd);
							_this.increase ? setValue(getValue() + step) : setValue(getValue() - step);
						}
					}
				}
			};

            // 是否只支持触摸事件
            if (SUPPORT_ONLY_TOUCH) {
                $box.off().on('touchstart', function(e) {
                    slider.onStart(e);
                }).on('select', function(e) {
                    e.preventDefault();
                }).on('scroll', function(e) {
                    e.preventDefault();
                }).on('mousedown mousemove', 'img', function(e) {
                    e.preventDefault();
                }).on('touchmove', function(e) {
                    e.preventDefault();
                    slider.onMove(e);
                }).on('touchend touchcancel', function(e) {
                    slider.onEnd(e);
                });
            } else {
                $box.off().on('mousedown', function(e) {
                    slider.onStart(e);
                }).on('select', function(e) {
                    e.preventDefault();
                }).on('scroll', function(e) {
                    e.preventDefault();
                }).on('mousedown mousemove', 'img', function(e) {
                    e.preventDefault();
                }).on('mousemove', function(e) {
                    e.preventDefault();
                    slider.onMove(e);
                }).on('mouseup mouseleave', function(e) {
                    slider.onEnd(e);
                });
            }
		});
	};

	


});
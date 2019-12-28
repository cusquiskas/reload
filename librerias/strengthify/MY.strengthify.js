
(function($) {
	
	if(!window.loadedjs) window.loadedjs = {};
	window.loadedjs.strengthify = true;
	
    $.fn.strengthify = function(paramOptions) {
        "use strict";

        var defaults = {
            titles: [
                'Weakest',
                'Weak',
                'So-so',
                'Good',
                'Perfect'
            ],
            tilesOptions:{
              tooltip: true,
              element: false
            },
            drawTitles: false,
            drawMessage: false,
            drawBars: true,
            $addAfter: null,
            nonce: null
			/*
			validations: {
				length:     {min: 8, max: 10},
				charpos:    [{pos: 0, type: 'LET'}], // type: (LET, NUMB, MAY, MIN, SPEC)
				chartype:   {num: 3, types: ['NUMB', 'MAY', 'MIN', 'SPEC']},
				match: 3 // 0: (username=password), n=[+1]: coincidences(username, passord) < n
			}
			*/
        };

        return this.each(function() {
            var options = $.extend(defaults, paramOptions);
			options.max_score = Object.keys(options.validations).length;
			
            if (!options.drawTitles
                && !options.drawMessage
                && !options.drawBars)
                console.warn("expect at least one of 'drawTitles', 'drawMessage', or 'drawBars' to be true");

            function getWrapperFor(id) {
                return $('div[data-strengthifyFor="' + id + '"]');
            };

            function drawStrengthify() {
                var password = $(this).val(),
                    elemId = $(this).attr('id'),
                    // hide strengthify if no input is provided
                    opacity = (password === '') ? 0 : 1,
                    // calculate result
                    result = validatePassword(password, options.user, options.validations),
                    // setup some vars for later
                    css = '',
                    bsLevel = '',
                    message = '',
                    // cache jQuery selections
                    $wrapper = getWrapperFor(elemId),
                    $container = $wrapper.find('.strengthify-container'),
                    $message = $wrapper.find('[data-strengthifyMessage]');
				
				$(options.button).attr("disabled", result.score != options.max_score);

                $wrapper.children()
                    .css('opacity', opacity)
                    .css('-ms-filter',
                    '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + opacity * 100 + ')"'
                    );

                if (options.onResult) {
                    options.onResult(result);
                }

                // style strengthify bar
                // possible scores: 0-4
                switch (result.score) {
                    case 0:
                    case 1:
                        css = 'password-bad';
                        bsLevel = 'danger';
                        message = result.feedback ? result.feedback.suggestions.join('<br/>') : "";
                        break;
                    case 2:
                        bsLevel = 'warning';
                        message = result.feedback ? result.feedback.suggestions.join('<br/>') : "";
                        css = 'password-medium';
                        break;
                    case 3:
                        css = 'password-good';
                        bsLevel = 'info';
                        message = result.feedback ? result.feedback.suggestions.join('<br/>') : "";
                        break;
                    case 4:
                        css = 'password-good';
                        bsLevel = 'success';
                        message = result.feedback ? result.feedback.suggestions.join('<br/>') : "";
                        break;
                }

                if ($message) {
                    $message.removeAttr('class');
                    $message.addClass('bg-' + bsLevel);

                    // reset state for empty string password
                    if (password === '') {
                        message = '';
                    }
                    $message.html(message);
                }
                if ($container) {
                    $container
                        .attr('class', css + ' strengthify-container')
                        // possible scores: 0-4
                        .css(
                        'width',
                        // if score is '0' it will be changed to '1' to
                        // not hide strengthify if the password is extremely weak
                        ((result.score === 0 ? 1 : result.score) * (100 / options.max_score)) + '%'
                        );

                    // reset state for empty string password
                    if (password === '') {
                        $container.css('width', 0);
                    }
                }

                if (options.drawTitles) {
                    // set a title for the wrapper
                    if(options.tilesOptions.tooltip){
                        $wrapper.attr(
                            'title',
                            options.titles[result.score]
                        ).tooltip({
                            placement: 'bottom',
                            trigger: 'manual',
                        }).tooltip(
                            'fixTitle'
                        ).tooltip(
                            'show'
                        );

                        if (opacity === 0) {
                            $wrapper.tooltip(
                                'hide'
                            );
                        }
                    }

                    if(options.tilesOptions.element){
                        $wrapper.find(".strengthify-tiles").text(options.titles[result.score]);
                    }
                }
            };
			
			function validatePassword(passw, user, config) {
				var score = 0;
				var message= [];
				
				if(config.charpos !== undefined && config.charpos !== null) {
					var msg = checkCharPos(passw, config.charpos);
					if(msg && msg.length) {
						Array.prototype.push.apply(message, msg)
					} else {
						score++;
					}
				}
				if(config.chargroup !== undefined && config.chargroup !== null) {
					var msg = checkCharGroup(passw, config.chargroup);
					if(msg && msg.length) {
						Array.prototype.push.apply(message, msg)
					} else {
						score++;
					}
				}
				if(config.chartype !== undefined && config.chartype !== null) {
					var msg = checkCharType(passw, config.chartype);
					if(msg && msg.length) {
						Array.prototype.push.apply(message, msg)
					} else {
						score++;
					}
				}
				if(config.length !== undefined && config.length !== null) {
					var msg = checkLength(passw, config.length);
					if(msg && msg.length) {
						Array.prototype.push.apply(message, msg)
					} else {
						score++;
					}
				}
				if(config.match !== undefined && config.match !== null) {
					var msg = checkMatch(passw, user, config.match);
					if(msg && msg.length) {
						Array.prototype.push.apply(message, msg)
					} else {
						score++;
					}
				}
				
				return {
					score: score,
					feedback: {
						suggestions: message
					}
				};
			};

			function checkCharPos(passw, config) {
				
				var msg = [];
				for(var i = 0; i < config.length; i++) {
					switch(config[i].type) {
						case 'LET':
							if(!passw.charAt(config[i].pos).match(/[a-z]/i)) msg.push('El carácter en la posición <strong>"' + (config[i].pos + 1) + '"</strong> debe ser una <strong>letra</strong>.');
							break;
						case 'NUMB':
							var c = passw.charAt(config[i].pos);
							if(!c || isNaN(c)) msg.push('El carácter en la posición <strong>"' + (config[i].pos + 1) + '"</strong> debe ser un <strong>número</strong>.');
							break;
						case 'MAY':
							if(passw.charAt(config[i].pos) != passw.charAt(config[i].pos).toUpperCase()) msg.push('El carácter en la posición <strong>"' + (config[i].pos + 1) + '"</strong> debe ser una <strong>mayúscula</strong>.');
							break;
						case 'MIN':
							if(passw.charAt(config[i].pos) != passw.charAt(config[i].pos).toLowerCase()) msg.push('El carácter en la posición <strong>"' + (config[i].pos + 1) + '"</strong> debe ser una <strong>minúscula</strong>.');
							break;
						case 'SPEC':
							var c = passw.charAt(config[i].pos);
							if(!c || c.match(/^[a-z0-9]+$/i)) msg.push('El carácter en la posición <strong>"' + (config[i].pos + 1) + '"</strong> debe ser un <strong>símbolo</strong>.');
							break;
					}
				}
				
				return msg;
			};

			function checkCharGroup(passw, config) {
				
				var count = 0;
				var msg = '';
				for(var i = 0; i < config.types.length; i++) {
					var valid = false;
					for(var j = 0; j < passw.length; j++) {
						switch(config.types[i]) {
							case 'LET':
								if(passw.charAt(j).match(/[a-z]/i)) valid = true;
								break;
							case 'NUMB':
								var c = passw.charAt(j);
								if(c && !isNaN(c)) valid = true;
								break;
							case 'MAY':
								if(passw.charAt(j) != passw.charAt(j).toLowerCase()) valid = true;
								break;
							case 'MIN':
								if(passw.charAt(j) != passw.charAt(j).toUpperCase()) valid = true;
								break;
							case 'SPEC':
								var c = passw.charAt(j);
								if(c && !c.match(/^[a-z0-9]+$/i)) valid = true;
								break;
						}
						if(valid) {
							count++;
							break;
						}
					}
					switch(config.types[i]) {
						case 'LET':
							msg += ', una letra';
							break;
						case 'NUMB':
							msg += ', un número';
							break;
						case 'MAY':
							msg += ', una mayúscula';
							break;
						case 'MIN':
							msg += ', una minúscula';
							break;
						case 'SPEC':
							msg += ', un símbolo';
					}
				}
				
				return config.num > count ? ['La contraseña debe contener al menos <strong>"' + config.num + '"</strong> tipos de carácteres:<strong>' + msg.substr(1) + '</strong>.'] : [];
			};
			
			function checkCharType(passw, config) {
				
				var msg = '';
				var valid = true;
				for(var i = 0; i < passw.length; i++) {
					valid = false;
					for(var j = 0; j < config.length; j++) {
						switch(config[j]) {
							case 'LET':
								if(passw.charAt(i).match(/[a-z]/i)) valid = true;
								break;
							case 'NUMB':
								if(!isNaN(passw.charAt(i))) valid = true;
								break;
							case 'MAY':
								if(passw.charAt(i) != passw.charAt(i).toLowerCase()) valid = true;
								break;
							case 'MIN':
								if(passw.charAt(i) != passw.charAt(i).toUpperCase()) valid = true;
								break;
							case 'SPEC':
								if(passw.charAt(i).match(/^[a-z0-9]+$/i)) valid = true;
								break;
						}
					}
					if(!valid) break;
				}
				for(var i = 0; i < config.length; i++) {
					switch(config[i]) {
						case 'LET':
							msg += ', letras';
							break;
						case 'NUMB':
							msg += ', números';
							break;
						case 'MAY':
							msg += ', mayúsculas';
							break;
						case 'MIN':
							msg += ', minúsculas';
							break;
						case 'SPEC':
							msg += ', símbolos';
					}
				}
				
				return valid ? [] : ['La contraseña solo admite:<strong>' + msg.substr(1) + '</strong>.'];
			}

			function checkLength(passw, config) {
				
				return (!config.min || passw.length >= config.min) && (!config.max || passw.length <= config.max) ?
					[] :
					['La longitud de la contraseña debe tener un mínimo de <strong>[' + (config.min ? config.min : ' - ') + ']</strong> y un máximo de <strong>[' + (config.max ? config.max : ' - ') + ']</strong> carácteres.'];
			};

			function checkMatch(passw, user, config) {
				
				if(config == 0) {
					return passw == user ? ['La contraseña no puede contener el número de empleado: <strong>"' + passw + '"</strong>.'] : []
				} else if(config > 0) {
					var i;
					var match = false;
					for(i = 0; i <= (passw.length - config); i++) {
						if(user.search(escapeSpecialChars(passw.substr(i, config))) != -1) {
							match = true;
							break;
						}
					}
					
					return match ? ['La contraseña no puede contener el número de empleado: <strong>"' + passw.substr(i, config) + '"</strong>.'] : [];
				} else {
					return [];
				}
			};
			function escapeSpecialChars(string) {
				return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
			};

            function init() {
                var $elem = $(this),
                    elemId = $elem.attr('id');
                var drawSelf = drawStrengthify.bind(this);

                var $addAfter = options.$addAfter;
                if (!$addAfter) {
                    $addAfter = $elem;
                }

				// add elements
				$('[data-strengthifyFor=' + $elem.attr('id') + ']').remove();
				if($addAfter.parent().hasClass('input-group')) {
					$addAfter.parent().after('<div class="strengthify-wrapper" data-strengthifyFor="' + $elem.attr('id') + '"></div>');
				} else {
					$addAfter.after('<div class="strengthify-wrapper" data-strengthifyFor="' + $elem.attr('id') + '"></div>');
				}

                if (options.drawBars) {
                    getWrapperFor(elemId)
                        .append('<div class="strengthify-bg" />')
                        .append('<div class="strengthify-container" />');
					for(var i = 1; i <= options.max_score; i++) {
                        getWrapperFor(elemId)
							.append('<div class="strengthify-separator" style="left: ' + (i * 100 / options.max_score) + '%" />');
					}
                }

                if (options.drawMessage) {
                    getWrapperFor(elemId).append('<div data-strengthifyMessage></div>');
                }

                if (options.drawTitles && options.tilesOptions) {
                    getWrapperFor(elemId).append('<div class="strengthify-tiles"></div>');
                }

				$elem.parent().off('.strengthify');
                $elem.parent().on('scroll.strengthify', drawSelf);

				$elem.unbind('.strengthify');
                $elem.bind('keyup.strengthify input.strengthify change.strengthify', drawSelf);
            };

            init.call(this);

            //return me;
        });
	};
	
	$.fn.disposeStrengthify = function(paramOptions) {
		var $elem = $(this);
		
		$('[data-strengthifyFor=' + $elem.attr('id') + ']').remove();
		$elem.parent().off('.strengthify');
		$elem.unbind('.strengthify');
	};

} (jQuery));

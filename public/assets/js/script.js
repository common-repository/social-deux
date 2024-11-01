;(function ( $, window, document, undefined ) {

	/* Defaults
	================================================== */
	var pluginName = 'ultimate_social_deux',
	defaults = {
		className: 'sharrre',
		share: {
			facebook: false,
			twitter: false,
			googlePlus: false,
			pinterest: false,
			linkedin: false,
			stumbleupon: false,
			delicious: false,
			buffer: false,
			reddit: false,
			vkontakte: false,
			comments: false
		},
		shareTotal: 0,
		template: '',
		title: '',
		url: document.location.href,
		text: document.title,
		urlCurl: us_script.sharrre_url,
		count: {},
		total: 0,
		shorterTotal: true,
		enableHover: true,
		enableCounter: true,
		enableTracking: us_script.enabletracking,
		hover: function(){},
		hide: function(){},
		click: function(){},
		render: function(){},
		buttons: {
			googlePlus : {
				url: '',
				urlCount: false,
				size: 'medium',
				lang: 'en-US',
				annotation: ''
			},
			facebook: {
				url: '',
				urlCount: false,
				action: 'like',
				layout: 'button_count',
				width: '',
				send: 'false',
				faces: 'false',
				colorscheme: '',
				font: '',
				lang: 'en_US'
			},
			twitter: {
				url: '',
				urlCount: false,
				count: 'horizontal',
				hashtags: '',
				via: '',
				related: '',
				lang: 'en'
			},
			delicious: {
				url: '',
				urlCount: false,
				size: 'medium'
			},
			stumbleupon: {
				url: '',
				urlCount: false,
				layout: '1'
			},
			reddit: {
				url: '',
				urlCount: false
			},
			vkontakte: {
				url: '',
				urlCount: false,
				media: '',
				description: ''
			},
			linkedin: {
				url: '',
				urlCount: false,
				counter: ''
			},
			pinterest: {
				url: '',
				media: '',
				description: '',
				urlCount: false,
				layout: 'horizontal'
			},
			buffer: {
				url		 : '',
				media	   : '',
				description : '',
				layout	  : 'horizontal',
				urlCount: false
			},
			comments: {
				urlCount: false
			},
			love: {
				urlCount: false
			},
			pocket: {
				url: '',
				description: ''
			},
			tumblr: {
				url: '',
				description: ''
			},
			printfriendly: {
				url: '',
				description: ''
			},
			flipboard: {
				url: '',
				description: ''
			},
		}
	},
	/* Json URL to get count number
	================================================== */
	urlJson = {
		googlePlus: "",
		reddit: "",
		stumbleupon: "",
		pinterest: "",
		facebook: "https://graph.facebook.com/fql?q=SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url=%27{url}%27&callback=?",
		twitter: "https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
		delicious: "http://feeds.delicious.com/v2/json/urlinfo/data?url={url}&callback=?",
		linkedin: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
		vkontakte: "",
		buffer: "https://api.bufferapp.com/1/links/shares.json?url={url}&callback=?",
		comments: "",
		love: ""
	},

	/* Popup for each social network
	================================================== */
	popup = {
		googlePlus: function(opt){
			PopupCenter("https://plus.google.com/share?hl="+opt.buttons.googlePlus.lang+"&url="+encodeURIComponent((opt.buttons.googlePlus.url !== '' ? opt.buttons.googlePlus.url : opt.url)), 'googlePlus', us_script.googleplus_width, us_script.googleplus_height );
		},
		facebook: function(opt){
			PopupCenter("http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent((opt.buttons.facebook.url !== '' ? opt.buttons.facebook.url : opt.url))+"&t="+opt.text+"", 'facebook', us_script.facebook_width, us_script.facebook_height );
		},
		twitter: function(opt){
			get_short_url(opt.url, function( short_url ) {
				PopupCenter("https://twitter.com/intent/tweet?text="+encodeURIComponent(opt.text)+"&url="+encodeURIComponent(short_url)+(opt.buttons.twitter.via !== '' ? '&via='+opt.buttons.twitter.via : ''), 'twitter', us_script.twitter_width, us_script.twitter_height );
			});
		},
		delicious: function(opt){
			PopupCenter('http://www.delicious.com/save?v=5&noui&jump=close&url='+encodeURIComponent((opt.buttons.delicious.url !== '' ? opt.buttons.delicious.url : opt.url))+'&title='+opt.text, 'delicious', us_script.delicious_width, us_script.delicious_height );
		},
		stumbleupon: function(opt){
			PopupCenter('http://www.stumbleupon.com/badge/?url='+encodeURIComponent((opt.buttons.stumbleupon.url !== '' ? opt.buttons.stumbleupon.url : opt.url)), 'stumble', us_script.stumble_width, us_script.stumble_height );
		},
		linkedin: function(opt){
			PopupCenter('https://www.linkedin.com/cws/share?url='+encodeURIComponent((opt.buttons.linkedin.url !== '' ? opt.buttons.linkedin.url : opt.url))+'&token=&isFramed=true', 'linkedin', us_script.linkedin_width, us_script.linkedin_height );
		},
		pinterest: function(opt){
			PopupCenter(us_script.home_url + '?pinterestshare=1&url='+encodeURIComponent((opt.buttons.pinterest.url !== '' ? opt.buttons.pinterest.url : opt.url))+'&desc='+encodeURIComponent(opt.text), 'pinterest', us_script.pinterest_width, us_script.pinterest_height );
		},
		buffer: function(opt){
			get_short_url(opt.url, function( short_url ) {
				PopupCenter('http://bufferapp.com/add?url='+encodeURIComponent(short_url)+'&text='+encodeURIComponent(opt.text)+'&via='+us_script.tweet_via+'&picture='+encodeURIComponent(opt.buttons.buffer.media)+'&count='+opt.buttons.buffer.layout+'&source=button', 'buffer', us_script.buffer_width, us_script.buffer_height );
			});
		},
		reddit: function(opt){
			PopupCenter('http://reddit.com/submit?url='+encodeURIComponent((opt.buttons.reddit.url !== '' ? opt.buttons.reddit.url : opt.url))+'&title='+encodeURIComponent(opt.text), 'reddit', us_script.reddit_width, us_script.reddit_height );
		},
		vkontakte: function(opt){
			PopupCenter('http://vkontakte.ru/share.php?url='+encodeURIComponent((opt.buttons.vkontakte.url !== '' ? opt.buttons.vkontakte.url : opt.url))+'&title='+encodeURIComponent(opt.buttons.vkontakte.description)+'&image='+encodeURIComponent(opt.buttons.vkontakte.media), 'vkontakte', us_script.vkontakte_width, us_script.vkontakte_height );
		},
		printfriendly: function(opt){
			PopupCenter('http://www.printfriendly.com/print/?url='+encodeURIComponent((opt.buttons.printfriendly.url !== '' ? opt.buttons.printfriendly.url : opt.url)), 'printfriendly', us_script.printfriendly_width, us_script.printfriendly_height );
		},
		pocket: function(opt){
			PopupCenter('https://getpocket.com/edit.php?url='+encodeURIComponent((opt.buttons.pocket.url !== '' ? opt.buttons.pocket.url : opt.url)), 'pocket', us_script.pocket_width, us_script.pocket_height );
		},
		tumblr: function(opt){
			PopupCenter('http://tumblr.com/share?s=&v=3&u='+encodeURIComponent((opt.buttons.tumblr.url !== '' ? opt.buttons.tumblr.url : opt.url))+'&t='+encodeURIComponent(opt.text), 'tumblr', us_script.tumblr_width, us_script.tumblr_height );
		},
		flipboard: function(opt){
			PopupCenter('https://share.flipboard.com/bookmarklet/popout?url='+encodeURIComponent((opt.buttons.flipboard.url !== '' ? opt.buttons.flipboard.url : opt.url))+'&title='+encodeURIComponent(opt.text), 'flipboard', us_script.flipboard_width, us_script.flipboard_height );
		}
	};

	/* Plugin constructor
	================================================== */
	function Plugin( element, options ) {
		this.element = element;

		this.options = $.extend( true, {}, defaults, options);
		this.options.share = options.share; //simple solution to allow order of buttons

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	};

	/* Potition popups center
	================================================== */
	function PopupCenter(url, title, w, h) {
	// Fixes dual-screen position						 Most browsers	  Firefox
		var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

		width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 2) - (h / 2)) + dualScreenTop;
		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

		// Puts focus on the newWindow
		if (window.focus) {
		newWindow.focus();
		}
	}

	function get_short_url(longUrl, callback) {
		if (us_script.bitly === 'true') {
			$.ajax({
				url : us_script.ajaxurl,
					dataType : "json",
					type : "POST",
					data : {
					url : longUrl,
					action : 'us_bitly'
				},
				async: false,
				success : function(response) {
					if(response.status_txt === "OK"){
						callback( response.data.url );
					} else {
						callback( longUrl );
					}
				},
				error : function(xhr, error, message) {
					callback( longUrl );
				}
			});
		} else {
			callback( longUrl );
		}
	}

	/* Initialization method
	================================================== */
	Plugin.prototype.init = function () {
	var self = this;
	if(this.options.urlCurl !== ''){
		urlJson.googlePlus = this.options.urlCurl + '?url={url}&type=googlePlus&action=us_counts';
		urlJson.stumbleupon = this.options.urlCurl + '?url={url}&type=stumbleupon&action=us_counts';
		urlJson.reddit = this.options.urlCurl + '?url={url}&type=reddit&action=us_counts';
		urlJson.pinterest = this.options.urlCurl + '?url={url}&type=pinterest&action=us_counts';
		urlJson.vkontakte = this.options.urlCurl + '?url={url}&type=vkontakte&action=us_counts';
		urlJson.comments = this.options.urlCurl + '?url={url}&type=comments&action=us_counts';
		urlJson.love = this.options.urlCurl + '?url={url}&type=love&action=us_counts';

		//console.log(urlJson.reddit);
		}
		$(this.element).addClass(this.options.className); //add class

		//HTML5 Custom data
		if(typeof $(this.element).data('title') !== 'undefined'){
			this.options.title = $(this.element).attr('data-title');
		}
		if(typeof $(this.element).data('url') !== 'undefined'){
			this.options.url = $(this.element).data('url');
		}
		if(typeof $(this.element).data('text') !== 'undefined'){
			this.options.text = $(this.element).data('text');
		}
		if(typeof $(this.element).data('media') !== 'undefined'){
			this.options.media = $(this.element).attr('data-media');
		}
		if(typeof $(this.element).data('description') !== 'undefined'){
			this.options.description = $(this.element).attr('data-description');
		}

		//how many social website have been selected
		$.each(this.options.share, function(name, val) {
			if(val === true){
				self.options.shareTotal ++;
			}
		});

		if(self.options.enableCounter === true){  //if for some reason you don't need counter
			//get count of social share that have been selected
			$.each(this.options.share, function(name, val) {
				if(val === true){
				//self.getSocialJson(name);
				try {
					self.getSocialJson(name);
					} catch(e){
					}
				}
			});
		} else if(self.options.template !== ''){  //for personalized button (with template)
			this.options.render(this, this.options);
		} else{ // if you want to use official button like example 3 or 5
			this.loadButtons();
		}

		//click event
		$(this.element).click(function(){
			self.options.click(self, self.options);
			return false;
		});
	};

	/* getSocialJson methode
	================================================== */
	Plugin.prototype.getSocialJson = function (name) {
		var self = this,
		count = 0,
		url = urlJson[name].replace('{url}', encodeURIComponent(this.options.url));
		if(this.options.buttons[name].urlCount === true && this.options.buttons[name].url !== ''){
			url = urlJson[name].replace('{url}', this.options.buttons[name].url);
		}
		//console.log(urlJson[name]);
		//console.log('name : ' + name + ' - url : '+url); //debug
		if(url != '' && self.options.urlCurl !== ''){  //urlCurl = '' if you don't want to used PHP script but used social button
			$.getJSON(url, function(json){
				if(typeof json.count !== "undefined" || typeof json.shares !== "undefined"){  //GooglePlus, Stumbleupon, Twitter, Pinterest and Reddit
					if (json.count) {
						var temp = json.count + '';
					} else if( json.shares ) {
						var temp = json.shares + '';
					} else {
						var temp = 0 + '';
					}
					temp = temp.replace('\u00c2\u00a0', '');  //remove google plus special chars
					count += parseInt(temp, 10);
				} else if(typeof json[0] !== "undefined"){  //Delicious
					count += parseInt(json[0].total_posts, 10);
				} else if(json.data && json.data.length > 0 && typeof json.data[0].total_count !== "undefined"){ //Facebook total count
					count += parseInt(json.data[0].total_count, 10);
				} else if(typeof json[0] !== "undefined"){
				}
				self.options.count[name] = count;
				self.options.total += count;
				self.renderer();
				self.rendererPerso();
				//console.log(json); //debug
			})
			.error(function() {
				self.options.count[name] = 0;
				self.rendererPerso();
			});
		} else{
			self.renderer();
			self.options.count[name] = 0;
			self.rendererPerso();
		}
	};

	/* Methode for open popup
	================================================== */
	Plugin.prototype.openPopup = function (site) {
		popup[site](this.options);  //open
		if(this.options.enableTracking === true){ //tracking!
		var tracking = {
			googlePlus: {site: 'Google', action: '+1'},
			facebook: {site: 'facebook', action: 'like'},
			twitter: {site: 'twitter', action: 'tweet'},
			digg: {site: 'digg', action: 'add'},
			delicious: {site: 'delicious', action: 'add'},
			stumbleupon: {site: 'stumbleupon', action: 'add'},
			linkedin: {site: 'linkedin', action: 'share'},
			pinterest: {site: 'pinterest', action: 'pin'}
		};
		_gaq.push(['_trackSocial', tracking[site].site, tracking[site].action]);
		}
	};

	/* launch render methode
	================================================== */
	Plugin.prototype.rendererPerso = function () {
		//check if this is the last social website to launch render
		var shareCount = 0;
		for (e in this.options.count) { shareCount++; }
		if(shareCount === this.options.shareTotal){
			this.options.render(this, this.options);
		}
	};

	/* render methode
	================================================== */
	Plugin.prototype.renderer = function () {
		var total = this.options.total,
		template = this.options.template;
		if(this.options.shorterTotal === true){  //format number like 1.2k or 5M
			total = this.shorterTotal(total);
		}

		if(template !== ''){  //if there is a template
			template = template.replace('{total}', total);
			$(this.element).html(template);
		}
	};

	/* format total numbers like 1.2k or 5M
	================================================== */
	Plugin.prototype.shorterTotal = function (num) {
		if (num >= 1e6){
			num = (num / 1e6).toFixed(2) + "M"
		} else if (num >= 1e3){
			num = (num / 1e3).toFixed(1) + "k"
		}
		return num;
	};

	/* Methode for add +1 to a counter
	================================================== */
	Plugin.prototype.simulateClick = function () {
		var html = $(this.element).html();
		$(this.element).html(html.replace(this.options.total, this.options.total+1));
	};

	/* Methode for add +1 to a counter
	================================================== */
	Plugin.prototype.update = function (url, text) {
		if(url !== ''){
			this.options.url = url;
		}
		if(text !== ''){
			this.options.text = text;
		}
	};

	/* A really lightweight plugin wrapper around the constructor, preventing against multiple instantiations
	================================================== */
	$.fn[pluginName] = function ( options ) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			return this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			});
		}
	};
})(jQuery, window, document);

 (function () {

	function us_mail_send() {

		var your_name = jQuery('.us_mail_your_name').val(),
			url = jQuery('.us_mail_url').val(),
			your_email = jQuery('.us_mail_your_email').val(),
			recipient_email = jQuery('.us_mail_recipient_email').val(),
			message = jQuery('.us_mail_message').val(),
			captcha = jQuery('.us_mail_captcha').val();

		jQuery.ajax({
			type: 'POST',
			url: us_script.ajaxurl,
			data: {
				action: 'us_send_mail',
				url: url,
				your_name: your_name,
				your_email: your_email,
				recipient_email: recipient_email,
				message: message,
				captcha: captcha
			},

			success: function(response){

				var responseElement = jQuery('.us_mail_response');
				var us_mail_form = jQuery('.us_mail_form_holder');

				responseElement
					.hide()
					.removeClass('alert alert-danger alert-info alert-success');

				if (response === "ok") {
					responseElement
						.fadeIn().addClass('alert alert-success').html(us_script.success);

					us_mail_form
						.html('');

					setTimeout(function() {
						jQuery('.us_modal');
							jQuery.magnificPopup.instance.close();
					}, 2000);
				} else {
					responseElement
						.fadeIn()
						.html(response)
						.addClass('alert alert-danger');
				}
			},
			error: function(MLHttpRequest, textStatus, errorThrown){
				console.log(errorThrown);
			}

		});

	}

	jQuery(document).ready(function() {

		jQuery('.us_mail_send').on('click', function(){
			jQuery('.us_mail_response').addClass('alert alert-info').html(us_script.trying);
			us_mail_send();
		});

		jQuery('.us_mail a').magnificPopup({
			type:'inline',
			midClick: true,
			removalDelay: 300,
			mainClass: 'us_mail_fade us_wrapper'
		});

		jQuery('.us_total').each(function() {
			var template = '<div class="us_box"><div class="us_count">{total}</div><div class="us_share">' + us_script.total_shares_text + '</div></div>';

			jQuery(this).ultimate_social_deux({
				share: {
					facebook: jQuery(this).data("facebook"),
					twitter: jQuery(this).data("twitter"),
					googlePlus: jQuery(this).data("googleplus"),
					pinterest: jQuery(this).data("pinterest"),
					linkedin: jQuery(this).data("linkedin"),
					stumbleupon: jQuery(this).data("stumble"),
					delicious: jQuery(this).data("delicious"),
					buffer: jQuery(this).data("buffer"),
					reddit: jQuery(this).data("reddit"),
					vkontakte: jQuery(this).data("vkontakte"),
					comments: jQuery(this).data("comments"),
					love: jQuery(this).data("love")
				},
				template: template,
				urlCurl: us_script.sharrre_url
			});
		});
		jQuery('.us_twitter').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-twitter"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					twitter: share
				},
				buttons: {
					twitter: {
						via: us_script.tweet_via
					}
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('twitter');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_facebook').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-facebook"></i></div><div class="us_count">{total}</div></a>';
			if ( jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			if (jQuery(this).hasClass('us_native') ) {
				var selector = jQuery( ".us_box", this);
				var template = '<div class="us_share"><i class="us-icon-facebook"></i></div><div class="us_count">{total}</div>';
				jQuery(this).mouseover(function() {
				  	us_native.load(this);
				});
			}

			selector.ultimate_social_deux({
				share: {
					facebook: share
				},
				template: template,
				click: function(api, options){
					api.openPopup('facebook');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_googleplus').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-gplus"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			if (jQuery(this).hasClass('us_native') ) {
				var selector = jQuery( ".us_box", this);
				var template = '<div class="us_share"><i class="us-icon-google"></i></div><div class="us_count">{total}</div>';
				jQuery(this).mouseover(function() {
				  	us_native.load(this);
				});
			}
			selector.ultimate_social_deux({
				share: {
					googlePlus: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('googlePlus');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_pinterest').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-pinterest"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					pinterest: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('pinterest');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_linkedin').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-linkedin"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					linkedin: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('linkedin');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_stumble').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-stumbleupon"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					stumbleupon: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('stumbleupon');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_delicious').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-delicious"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					delicious: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('delicious');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_buffer').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-buffer"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					buffer: share
				},
				buttons: {
					buffer: {
						url: jQuery(this).attr("data-url"),
						media: jQuery(this).attr("data-media"),
						description: jQuery(this).attr("data-text")
					}
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('buffer');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_reddit').each(function() {
			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-reddit"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			selector.ultimate_social_deux({
				share: {
					reddit: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('reddit');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_vkontakte').each(function() {

			var selector = jQuery(this);
			var share = true;
			var template = '<a class="us_box" href="#"><div class="us_share"><i class="us-icon-vkontakte"></i></div><div class="us_count">{total}</div></a>';
			if (jQuery(this).hasClass('us_transient') || jQuery(this).hasClass('us_no_count')) {
				var share = false;
				var template = '';
			}
			if (jQuery(this).hasClass('us_native') ) {
				var selector = jQuery( ".us_box", this);
				var template = '<div class="us_share"><i class="us-icon-vkontakte"></i></div><div class="us_count">{total}</div>';
				jQuery(this).mouseover(function() {
					us_native.load(this);
				});
			}
			selector.ultimate_social_deux({
				share: {
					vkontakte: share
				},
				enableHover: false,
				template: template,
				urlCurl: us_script.sharrre_url,
				click: function(api, options){
					api.openPopup('vkontakte');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_pocket').each(function() {
			jQuery(this).ultimate_social_deux({
				share: {
					pocket: true
				},
				click: function(api, options){
					api.openPopup('pocket');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_tumblr').each(function() {
			jQuery(this).ultimate_social_deux({
				share: {
					tumblr: true
				},
				click: function(api, options){
					api.openPopup('tumblr');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_print').each(function() {
			jQuery(this).ultimate_social_deux({
				share: {
					printfriendly: true
				},
				click: function(api, options){
					api.openPopup('printfriendly');
					api.simulateClick();
					return false;
				}
			});
		});
		jQuery('.us_flipboard').each(function() {
			jQuery(this).ultimate_social_deux({
				share: {
					flipboard: true
				},
				click: function(api, options){
					api.openPopup('flipboard');
					api.simulateClick();
					return false;
				}
			});
		});

		var clicked = false;
		jQuery('.us_love .us_box').on('click', function() {
			var url = jQuery(this).data('url');
			var user_id = jQuery(this).data('user_id');
			var count = jQuery(this).data('count');
			var data = {
				action: 'us_love',
				url: url,
				user_id: user_id,
				nonce: us_script.nonce
			};

			// don't allow the user to love the item more than once
			if(jQuery(this).hasClass('loved')) {
				alert(us_script.already_loved_message);
				return false;
			}

			if( jQuery.cookie('us_love_count_' + url)) {
				alert(us_script.already_loved_message);
				return false;
			}

			if( ! clicked ) {
				clicked = true;
				jQuery.ajax({
					type: "POST",
					data: data,
					url: us_script.ajaxurl,
					context: this,
					success: function( response ) {
						if( response === 'ok' ) {
							jQuery(this).addClass('loved');
							jQuery(this).find('.us_count').text(count + 1);
							if(us_script.logged_in == 'false') {
								jQuery.cookie('us_love_count_' + url, 'yes', { expires: 365 });
							}
						} else {
							alert(us_script.error_message);
						}
						clicked = false;
					}
				}).fail(function (data) {
					//console.log(data);
				});
			}
			return false;
		});

	});

}(jQuery));

/*! Magnific Popup - v0.9.9 - 2013-12-27
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2013 Dmitry Semenov; */
(function(e){var t,n,i,o,r,a,s,l="Close",c="BeforeClose",d="AfterClose",u="BeforeAppend",p="MarkupParse",f="Open",m="Change",g="mfp",h="."+g,v="mfp-ready",C="mfp-removing",y="mfp-prevent-close",w=function(){},b=!!window.jQuery,I=e(window),x=function(e,n){t.ev.on(g+e+h,n)},k=function(t,n,i,o){var r=document.createElement("div");return r.className="mfp-"+t,i&&(r.innerHTML=i),o?n&&n.appendChild(r):(r=e(r),n&&r.appendTo(n)),r},T=function(n,i){t.ev.triggerHandler(g+n,i),t.st.callbacks&&(n=n.charAt(0).toLowerCase()+n.slice(1),t.st.callbacks[n]&&t.st.callbacks[n].apply(t,e.isArray(i)?i:[i]))},E=function(n){return n===s&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),s=n),t.currTemplate.closeBtn},_=function(){e.magnificPopup.instance||(t=new w,t.init(),e.magnificPopup.instance=t)},S=function(){var e=document.createElement("p").style,t=["ms","O","Moz","Webkit"];if(void 0!==e.transition)return!0;for(;t.length;)if(t.pop()+"Transition"in e)return!0;return!1};w.prototype={constructor:w,init:function(){var n=navigator.appVersion;t.isIE7=-1!==n.indexOf("MSIE 7."),t.isIE8=-1!==n.indexOf("MSIE 8."),t.isLowIE=t.isIE7||t.isIE8,t.isAndroid=/android/gi.test(n),t.isIOS=/iphone|ipad|ipod/gi.test(n),t.supportsTransition=S(),t.probablyMobile=t.isAndroid||t.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),o=e(document),t.popupsCache={}},open:function(n){i||(i=e(document.body));var r;if(n.isObj===!1){t.items=n.items.toArray(),t.index=0;var s,l=n.items;for(r=0;l.length>r;r++)if(s=l[r],s.parsed&&(s=s.el[0]),s===n.el[0]){t.index=r;break}}else t.items=e.isArray(n.items)?n.items:[n.items],t.index=n.index||0;if(t.isOpen)return t.updateItemHTML(),void 0;t.types=[],a="",t.ev=n.mainEl&&n.mainEl.length?n.mainEl.eq(0):o,n.key?(t.popupsCache[n.key]||(t.popupsCache[n.key]={}),t.currTemplate=t.popupsCache[n.key]):t.currTemplate={},t.st=e.extend(!0,{},e.magnificPopup.defaults,n),t.fixedContentPos="auto"===t.st.fixedContentPos?!t.probablyMobile:t.st.fixedContentPos,t.st.modal&&(t.st.closeOnContentClick=!1,t.st.closeOnBgClick=!1,t.st.showCloseBtn=!1,t.st.enableEscapeKey=!1),t.bgOverlay||(t.bgOverlay=k("bg").on("click"+h,function(){t.close()}),t.wrap=k("wrap").attr("tabindex",-1).on("click"+h,function(e){t._checkIfClose(e.target)&&t.close()}),t.container=k("container",t.wrap)),t.contentContainer=k("content"),t.st.preloader&&(t.preloader=k("preloader",t.container,t.st.tLoading));var c=e.magnificPopup.modules;for(r=0;c.length>r;r++){var d=c[r];d=d.charAt(0).toUpperCase()+d.slice(1),t["init"+d].call(t)}T("BeforeOpen"),t.st.showCloseBtn&&(t.st.closeBtnInside?(x(p,function(e,t,n,i){n.close_replaceWith=E(i.type)}),a+=" mfp-close-btn-in"):t.wrap.append(E())),t.st.alignTop&&(a+=" mfp-align-top"),t.fixedContentPos?t.wrap.css({overflow:t.st.overflowY,overflowX:"hidden",overflowY:t.st.overflowY}):t.wrap.css({top:I.scrollTop(),position:"absolute"}),(t.st.fixedBgPos===!1||"auto"===t.st.fixedBgPos&&!t.fixedContentPos)&&t.bgOverlay.css({height:o.height(),position:"absolute"}),t.st.enableEscapeKey&&o.on("keyup"+h,function(e){27===e.keyCode&&t.close()}),I.on("resize"+h,function(){t.updateSize()}),t.st.closeOnContentClick||(a+=" mfp-auto-cursor"),a&&t.wrap.addClass(a);var u=t.wH=I.height(),m={};if(t.fixedContentPos&&t._hasScrollBar(u)){var g=t._getScrollbarSize();g&&(m.marginRight=g)}t.fixedContentPos&&(t.isIE7?e("body, html").css("overflow","hidden"):m.overflow="hidden");var C=t.st.mainClass;return t.isIE7&&(C+=" mfp-ie7"),C&&t._addClassToMFP(C),t.updateItemHTML(),T("BuildControls"),e("html").css(m),t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo||i),t._lastFocusedEl=document.activeElement,setTimeout(function(){t.content?(t._addClassToMFP(v),t._setFocus()):t.bgOverlay.addClass(v),o.on("focusin"+h,t._onFocusIn)},16),t.isOpen=!0,t.updateSize(u),T(f),n},close:function(){t.isOpen&&(T(c),t.isOpen=!1,t.st.removalDelay&&!t.isLowIE&&t.supportsTransition?(t._addClassToMFP(C),setTimeout(function(){t._close()},t.st.removalDelay)):t._close())},_close:function(){T(l);var n=C+" "+v+" ";if(t.bgOverlay.detach(),t.wrap.detach(),t.container.empty(),t.st.mainClass&&(n+=t.st.mainClass+" "),t._removeClassFromMFP(n),t.fixedContentPos){var i={marginRight:""};t.isIE7?e("body, html").css("overflow",""):i.overflow="",e("html").css(i)}o.off("keyup"+h+" focusin"+h),t.ev.off(h),t.wrap.attr("class","mfp-wrap").removeAttr("style"),t.bgOverlay.attr("class","mfp-bg"),t.container.attr("class","mfp-container"),!t.st.showCloseBtn||t.st.closeBtnInside&&t.currTemplate[t.currItem.type]!==!0||t.currTemplate.closeBtn&&t.currTemplate.closeBtn.detach(),t._lastFocusedEl&&e(t._lastFocusedEl).focus(),t.currItem=null,t.content=null,t.currTemplate=null,t.prevHeight=0,T(d)},updateSize:function(e){if(t.isIOS){var n=document.documentElement.clientWidth/window.innerWidth,i=window.innerHeight*n;t.wrap.css("height",i),t.wH=i}else t.wH=e||I.height();t.fixedContentPos||t.wrap.css("height",t.wH),T("Resize")},updateItemHTML:function(){var n=t.items[t.index];t.contentContainer.detach(),t.content&&t.content.detach(),n.parsed||(n=t.parseEl(t.index));var i=n.type;if(T("BeforeChange",[t.currItem?t.currItem.type:"",i]),t.currItem=n,!t.currTemplate[i]){var o=t.st[i]?t.st[i].markup:!1;T("FirstMarkupParse",o),t.currTemplate[i]=o?e(o):!0}r&&r!==n.type&&t.container.removeClass("mfp-"+r+"-holder");var a=t["get"+i.charAt(0).toUpperCase()+i.slice(1)](n,t.currTemplate[i]);t.appendContent(a,i),n.preloaded=!0,T(m,n),r=n.type,t.container.prepend(t.contentContainer),T("AfterChange")},appendContent:function(e,n){t.content=e,e?t.st.showCloseBtn&&t.st.closeBtnInside&&t.currTemplate[n]===!0?t.content.find(".mfp-close").length||t.content.append(E()):t.content=e:t.content="",T(u),t.container.addClass("mfp-"+n+"-holder"),t.contentContainer.append(t.content)},parseEl:function(n){var i,o=t.items[n];if(o.tagName?o={el:e(o)}:(i=o.type,o={data:o,src:o.src}),o.el){for(var r=t.types,a=0;r.length>a;a++)if(o.el.hasClass("mfp-"+r[a])){i=r[a];break}o.src=o.el.attr("data-mfp-src"),o.src||(o.src=o.el.attr("href"))}return o.type=i||t.st.type||"inline",o.index=n,o.parsed=!0,t.items[n]=o,T("ElementParse",o),t.items[n]},addGroup:function(e,n){var i=function(i){i.mfpEl=this,t._openClick(i,e,n)};n||(n={});var o="click.magnificPopup";n.mainEl=e,n.items?(n.isObj=!0,e.off(o).on(o,i)):(n.isObj=!1,n.delegate?e.off(o).on(o,n.delegate,i):(n.items=e,e.off(o).on(o,i)))},_openClick:function(n,i,o){var r=void 0!==o.midClick?o.midClick:e.magnificPopup.defaults.midClick;if(r||2!==n.which&&!n.ctrlKey&&!n.metaKey){var a=void 0!==o.disableOn?o.disableOn:e.magnificPopup.defaults.disableOn;if(a)if(e.isFunction(a)){if(!a.call(t))return!0}else if(a>I.width())return!0;n.type&&(n.preventDefault(),t.isOpen&&n.stopPropagation()),o.el=e(n.mfpEl),o.delegate&&(o.items=i.find(o.delegate)),t.open(o)}},updateStatus:function(e,i){if(t.preloader){n!==e&&t.container.removeClass("mfp-s-"+n),i||"loading"!==e||(i=t.st.tLoading);var o={status:e,text:i};T("UpdateStatus",o),e=o.status,i=o.text,t.preloader.html(i),t.preloader.find("a").on("click",function(e){e.stopImmediatePropagation()}),t.container.addClass("mfp-s-"+e),n=e}},_checkIfClose:function(n){if(!e(n).hasClass(y)){var i=t.st.closeOnContentClick,o=t.st.closeOnBgClick;if(i&&o)return!0;if(!t.content||e(n).hasClass("mfp-close")||t.preloader&&n===t.preloader[0])return!0;if(n===t.content[0]||e.contains(t.content[0],n)){if(i)return!0}else if(o&&e.contains(document,n))return!0;return!1}},_addClassToMFP:function(e){t.bgOverlay.addClass(e),t.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),t.wrap.removeClass(e)},_hasScrollBar:function(e){return(t.isIE7?o.height():document.body.scrollHeight)>(e||I.height())},_setFocus:function(){(t.st.focus?t.content.find(t.st.focus).eq(0):t.wrap).focus()},_onFocusIn:function(n){return n.target===t.wrap[0]||e.contains(t.wrap[0],n.target)?void 0:(t._setFocus(),!1)},_parseMarkup:function(t,n,i){var o;i.data&&(n=e.extend(i.data,n)),T(p,[t,n,i]),e.each(n,function(e,n){if(void 0===n||n===!1)return!0;if(o=e.split("_"),o.length>1){var i=t.find(h+"-"+o[0]);if(i.length>0){var r=o[1];"replaceWith"===r?i[0]!==n[0]&&i.replaceWith(n):"img"===r?i.is("img")?i.attr("src",n):i.replaceWith('<img src="'+n+'" class="'+i.attr("class")+'" />'):i.attr(o[1],n)}}else t.find(h+"-"+e).html(n)})},_getScrollbarSize:function(){if(void 0===t.scrollbarSize){var e=document.createElement("div");e.id="mfp-sbm",e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),t.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return t.scrollbarSize}},e.magnificPopup={instance:null,proto:w.prototype,modules:[],open:function(t,n){return _(),t=t?e.extend(!0,{},t):{},t.isObj=!0,t.index=n||0,this.instance.open(t)},close:function(){return e.magnificPopup.instance&&e.magnificPopup.instance.close()},registerModule:function(t,n){n.options&&(e.magnificPopup.defaults[t]=n.options),e.extend(this.proto,n.proto),this.modules.push(t)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},e.fn.magnificPopup=function(n){_();var i=e(this);if("string"==typeof n)if("open"===n){var o,r=b?i.data("magnificPopup"):i[0].magnificPopup,a=parseInt(arguments[1],10)||0;r.items?o=r.items[a]:(o=i,r.delegate&&(o=o.find(r.delegate)),o=o.eq(a)),t._openClick({mfpEl:o},i,r)}else t.isOpen&&t[n].apply(t,Array.prototype.slice.call(arguments,1));else n=e.extend(!0,{},n),b?i.data("magnificPopup",n):i[0].magnificPopup=n,t.addGroup(i,n);return i};var P,O,z,M="inline",B=function(){z&&(O.after(z.addClass(P)).detach(),z=null)};e.magnificPopup.registerModule(M,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){t.types.push(M),x(l+"."+M,function(){B()})},getInline:function(n,i){if(B(),n.src){var o=t.st.inline,r=e(n.src);if(r.length){var a=r[0].parentNode;a&&a.tagName&&(O||(P=o.hiddenClass,O=k(P),P="mfp-"+P),z=r.after(O).detach().removeClass(P)),t.updateStatus("ready")}else t.updateStatus("error",o.tNotFound),r=e("<div>");return n.inlineElement=r,r}return t.updateStatus("ready"),t._parseMarkup(i,{},n),i}}});var F,H="ajax",L=function(){F&&i.removeClass(F)},A=function(){L(),t.req&&t.req.abort()};e.magnificPopup.registerModule(H,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){t.types.push(H),F=t.st.ajax.cursor,x(l+"."+H,A),x("BeforeChange."+H,A)},getAjax:function(n){F&&i.addClass(F),t.updateStatus("loading");var o=e.extend({url:n.src,success:function(i,o,r){var a={data:i,xhr:r};T("ParseAjax",a),t.appendContent(e(a.data),H),n.finished=!0,L(),t._setFocus(),setTimeout(function(){t.wrap.addClass(v)},16),t.updateStatus("ready"),T("AjaxContentAdded")},error:function(){L(),n.finished=n.loadError=!0,t.updateStatus("error",t.st.ajax.tError.replace("%url%",n.src))}},t.st.ajax.settings);return t.req=e.ajax(o),""}}});var j,N=function(n){if(n.data&&void 0!==n.data.title)return n.data.title;var i=t.st.image.titleSrc;if(i){if(e.isFunction(i))return i.call(t,n);if(n.el)return n.el.attr(i)||""}return""};e.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var e=t.st.image,n=".image";t.types.push("image"),x(f+n,function(){"image"===t.currItem.type&&e.cursor&&i.addClass(e.cursor)}),x(l+n,function(){e.cursor&&i.removeClass(e.cursor),I.off("resize"+h)}),x("Resize"+n,t.resizeImage),t.isLowIE&&x("AfterChange",t.resizeImage)},resizeImage:function(){var e=t.currItem;if(e&&e.img&&t.st.image.verticalFit){var n=0;t.isLowIE&&(n=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",t.wH-n)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,j&&clearInterval(j),e.isCheckingImgSize=!1,T("ImageHasSize",e),e.imgHidden&&(t.content&&t.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(e){var n=0,i=e.img[0],o=function(r){j&&clearInterval(j),j=setInterval(function(){return i.naturalWidth>0?(t._onImageHasSize(e),void 0):(n>200&&clearInterval(j),n++,3===n?o(10):40===n?o(50):100===n&&o(500),void 0)},r)};o(1)},getImage:function(n,i){var o=0,r=function(){n&&(n.img[0].complete?(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("ready")),n.hasSize=!0,n.loaded=!0,T("ImageLoadComplete")):(o++,200>o?setTimeout(r,100):a()))},a=function(){n&&(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("error",s.tError.replace("%url%",n.src))),n.hasSize=!0,n.loaded=!0,n.loadError=!0)},s=t.st.image,l=i.find(".mfp-img");if(l.length){var c=document.createElement("img");c.className="mfp-img",n.img=e(c).on("load.mfploader",r).on("error.mfploader",a),c.src=n.src,l.is("img")&&(n.img=n.img.clone()),c=n.img[0],c.naturalWidth>0?n.hasSize=!0:c.width||(n.hasSize=!1)}return t._parseMarkup(i,{title:N(n),img_replaceWith:n.img},n),t.resizeImage(),n.hasSize?(j&&clearInterval(j),n.loadError?(i.addClass("mfp-loading"),t.updateStatus("error",s.tError.replace("%url%",n.src))):(i.removeClass("mfp-loading"),t.updateStatus("ready")),i):(t.updateStatus("loading"),n.loading=!0,n.hasSize||(n.imgHidden=!0,i.addClass("mfp-loading"),t.findImageSize(n)),i)}}});var W,R=function(){return void 0===W&&(W=void 0!==document.createElement("p").style.MozTransform),W};e.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(e){return e.is("img")?e:e.find("img")}},proto:{initZoom:function(){var e,n=t.st.zoom,i=".zoom";if(n.enabled&&t.supportsTransition){var o,r,a=n.duration,s=function(e){var t=e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),i="all "+n.duration/1e3+"s "+n.easing,o={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},r="transition";return o["-webkit-"+r]=o["-moz-"+r]=o["-o-"+r]=o[r]=i,t.css(o),t},d=function(){t.content.css("visibility","visible")};x("BuildControls"+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.content.css("visibility","hidden"),e=t._getItemToZoom(),!e)return d(),void 0;r=s(e),r.css(t._getOffset()),t.wrap.append(r),o=setTimeout(function(){r.css(t._getOffset(!0)),o=setTimeout(function(){d(),setTimeout(function(){r.remove(),e=r=null,T("ZoomAnimationEnded")},16)},a)},16)}}),x(c+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.st.removalDelay=a,!e){if(e=t._getItemToZoom(),!e)return;r=s(e)}r.css(t._getOffset(!0)),t.wrap.append(r),t.content.css("visibility","hidden"),setTimeout(function(){r.css(t._getOffset())},16)}}),x(l+i,function(){t._allowZoom()&&(d(),r&&r.remove(),e=null)})}},_allowZoom:function(){return"image"===t.currItem.type},_getItemToZoom:function(){return t.currItem.hasSize?t.currItem.img:!1},_getOffset:function(n){var i;i=n?t.currItem.img:t.st.zoom.opener(t.currItem.el||t.currItem);var o=i.offset(),r=parseInt(i.css("padding-top"),10),a=parseInt(i.css("padding-bottom"),10);o.top-=e(window).scrollTop()-r;var s={width:i.width(),height:(b?i.innerHeight():i[0].offsetHeight)-a-r};return R()?s["-moz-transform"]=s.transform="translate("+o.left+"px,"+o.top+"px)":(s.left=o.left,s.top=o.top),s}}});var Z="iframe",q="//about:blank",D=function(e){if(t.currTemplate[Z]){var n=t.currTemplate[Z].find("iframe");n.length&&(e||(n[0].src=q),t.isIE8&&n.css("display",e?"block":"none"))}};e.magnificPopup.registerModule(Z,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){t.types.push(Z),x("BeforeChange",function(e,t,n){t!==n&&(t===Z?D():n===Z&&D(!0))}),x(l+"."+Z,function(){D()})},getIframe:function(n,i){var o=n.src,r=t.st.iframe;e.each(r.patterns,function(){return o.indexOf(this.index)>-1?(this.id&&(o="string"==typeof this.id?o.substr(o.lastIndexOf(this.id)+this.id.length,o.length):this.id.call(this,o)),o=this.src.replace("%id%",o),!1):void 0});var a={};return r.srcAction&&(a[r.srcAction]=o),t._parseMarkup(i,a,n),t.updateStatus("ready"),i}}});var K=function(e){var n=t.items.length;return e>n-1?e-n:0>e?n+e:e},Y=function(e,t,n){return e.replace(/%curr%/gi,t+1).replace(/%total%/gi,n)};e.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var n=t.st.gallery,i=".mfp-gallery",r=Boolean(e.fn.mfpFastClick);return t.direction=!0,n&&n.enabled?(a+=" mfp-gallery",x(f+i,function(){n.navigateByImgClick&&t.wrap.on("click"+i,".mfp-img",function(){return t.items.length>1?(t.next(),!1):void 0}),o.on("keydown"+i,function(e){37===e.keyCode?t.prev():39===e.keyCode&&t.next()})}),x("UpdateStatus"+i,function(e,n){n.text&&(n.text=Y(n.text,t.currItem.index,t.items.length))}),x(p+i,function(e,i,o,r){var a=t.items.length;o.counter=a>1?Y(n.tCounter,r.index,a):""}),x("BuildControls"+i,function(){if(t.items.length>1&&n.arrows&&!t.arrowLeft){var i=n.arrowMarkup,o=t.arrowLeft=e(i.replace(/%title%/gi,n.tPrev).replace(/%dir%/gi,"left")).addClass(y),a=t.arrowRight=e(i.replace(/%title%/gi,n.tNext).replace(/%dir%/gi,"right")).addClass(y),s=r?"mfpFastClick":"click";o[s](function(){t.prev()}),a[s](function(){t.next()}),t.isIE7&&(k("b",o[0],!1,!0),k("a",o[0],!1,!0),k("b",a[0],!1,!0),k("a",a[0],!1,!0)),t.container.append(o.add(a))}}),x(m+i,function(){t._preloadTimeout&&clearTimeout(t._preloadTimeout),t._preloadTimeout=setTimeout(function(){t.preloadNearbyImages(),t._preloadTimeout=null},16)}),x(l+i,function(){o.off(i),t.wrap.off("click"+i),t.arrowLeft&&r&&t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(),t.arrowRight=t.arrowLeft=null}),void 0):!1},next:function(){t.direction=!0,t.index=K(t.index+1),t.updateItemHTML()},prev:function(){t.direction=!1,t.index=K(t.index-1),t.updateItemHTML()},goTo:function(e){t.direction=e>=t.index,t.index=e,t.updateItemHTML()},preloadNearbyImages:function(){var e,n=t.st.gallery.preload,i=Math.min(n[0],t.items.length),o=Math.min(n[1],t.items.length);for(e=1;(t.direction?o:i)>=e;e++)t._preloadItem(t.index+e);for(e=1;(t.direction?i:o)>=e;e++)t._preloadItem(t.index-e)},_preloadItem:function(n){if(n=K(n),!t.items[n].preloaded){var i=t.items[n];i.parsed||(i=t.parseEl(n)),T("LazyLoad",i),"image"===i.type&&(i.img=e('<img class="mfp-img" />').on("load.mfploader",function(){i.hasSize=!0}).on("error.mfploader",function(){i.hasSize=!0,i.loadError=!0,T("LazyLoadError",i)}).attr("src",i.src)),i.preloaded=!0}}}});var U="retina";e.magnificPopup.registerModule(U,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,function(e){return"@2x"+e})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var e=t.st.retina,n=e.ratio;n=isNaN(n)?n():n,n>1&&(x("ImageHasSize."+U,function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/n,width:"100%"})}),x("ElementParse."+U,function(t,i){i.src=e.replaceSrc(i,n)}))}}}}),function(){var t=1e3,n="ontouchstart"in window,i=function(){I.off("touchmove"+r+" touchend"+r)},o="mfpFastClick",r="."+o;e.fn.mfpFastClick=function(o){return e(this).each(function(){var a,s=e(this);if(n){var l,c,d,u,p,f;s.on("touchstart"+r,function(e){u=!1,f=1,p=e.originalEvent?e.originalEvent.touches[0]:e.touches[0],c=p.clientX,d=p.clientY,I.on("touchmove"+r,function(e){p=e.originalEvent?e.originalEvent.touches:e.touches,f=p.length,p=p[0],(Math.abs(p.clientX-c)>10||Math.abs(p.clientY-d)>10)&&(u=!0,i())}).on("touchend"+r,function(e){i(),u||f>1||(a=!0,e.preventDefault(),clearTimeout(l),l=setTimeout(function(){a=!1},t),o())})})}s.on("click"+r,function(){a||o()})})},e.fn.destroyMfpFastClick=function(){e(this).off("touchstart"+r+" click"+r),n&&I.off("touchmove"+r+" touchend"+r)}}(),_()})(window.jQuery||window.Zepto);

(function(c,e,k,t){function l(){var b=c(this),a;if(a=b.is(":visible")){a=b[0].getBoundingClientRect();var d=y1=-b.data(g).threshold,e=m-y1,f=n-d;a=(a.top>=y1&&a.top<=e||a.bottom>=y1&&a.bottom<=e)&&(a.left>=d&&a.left<=f||a.right>=d&&a.right<=f)}a&&b.trigger(h)}function p(){m=e.innerHeight||k.documentElement.clientHeight;n=e.innerWidth||k.documentElement.clientWidth;q()}function q(){c(r).each(l)}function s(){var b=c(this),a=b.data(g);b.off(a.trigger);var d=b.contents().filter(function(){return 8===
this.nodeType}).get(0),d=c(d&&d.data);b.replaceWith(d);c.isFunction(a.load)&&a.load.call(d,d)}var g="jquery-lazyload-any",h="appear",f=g+"-"+h,r=":"+f;c.expr[":"][f]=function(b){return!!c(b).data(f)};var m,n;c.fn.lazyload=function(b){var a={threshold:0,trigger:h};c.extend(a,b);b=a.trigger.split(" ");this.data(f,-1!=c.inArray(h,b));this.data(g,a);this.on(a.trigger,s);this.each(l)};c(k).ready(function(){c(e).on("resize",p);c(e).on("scroll",q);p()})})(jQuery,window,document);


window.us_native = (function(window, document, undefined)
{
	'use strict';

	var uid	   = 0,
		instances = [ ],
		networks  = { },
		widgets   = { },
		rstate	= /^($|loaded|complete)/,
		euc	   = window.encodeURIComponent;

	var usnative = {

		settings: { },

		trim: function(str)
		{
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
		},

		hasClass: function(el, cn)
		{
			return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
		},

		addClass: function(el, cn)
		{
			if (!usnative.hasClass(el, cn)) {
				el.className = (el.className === '') ? cn : el.className + ' ' + cn;
			}
		},

		removeClass: function(el, cn)
		{
			el.className = usnative.trim(' ' + el.className + ' '.replace(' ' + cn + ' ', ' '));
		},

		extendObject: function(to, from, overwrite)
		{
			for (var prop in from) {
				var hasProp = to[prop] !== undefined;
				if (hasProp && typeof from[prop] === 'object') {
					usnative.extendObject(to[prop], from[prop], overwrite);
				} else if (overwrite || !hasProp) {
					to[prop] = from[prop];
				}
			}
		},

		getElements: function(context, cn)
		{
			var i   = 0,
				el  = [ ],
				gcn = !!context.getElementsByClassName,
				all = gcn ? context.getElementsByClassName(cn) : context.getElementsByTagName('*');
			for (; i < all.length; i++) {
				if (gcn || usnative.hasClass(all[i], cn)) {
					el.push(all[i]);
				}
			}
			return el;
		},

		getDataAttributes: function(el, noprefix, nostr)
		{
			var i	= 0,
				str  = '',
				obj  = { },
				attr = el.attributes;
			for (; i < attr.length; i++) {
				var key = attr[i].name,
					val = attr[i].value;
				if (val.length && key.indexOf('data-') === 0) {
					if (noprefix) {
						key = key.substring(5);
					}
					if (nostr) {
						obj[key] = val;
					} else {
						str += euc(key) + '=' + euc(val) + '&';
					}
				}
			}
			return nostr ? obj : str;
		},

		copyDataAttributes: function(from, to, noprefix, nohyphen)
		{
			var attr = usnative.getDataAttributes(from, noprefix, true);
			for (var i in attr) {
				to.setAttribute(nohyphen ? i.replace(/-/g, '_') : i, attr[i]);
			}
		},

		createIframe: function(src, instance)
		{
			var iframe = document.createElement('iframe');
			iframe.style.cssText = 'overflow: hidden; border: none;';
			usnative.extendObject(iframe, { src: src, allowtransparency: 'true', frameborder: '0', scrolling: 'no' }, true);
			if (instance) {
				iframe.onload = iframe.onreadystatechange = function ()
				{
					if (rstate.test(iframe.readyState || '')) {
						iframe.onload = iframe.onreadystatechange = null;
						usnative.activateInstance(instance);
					}
				};
			}
			return iframe;
		},

		networkReady: function(name)
		{
			return networks[name] ? networks[name].loaded : undefined;
		},

		appendNetwork: function(network)
		{

			if (!network || network.appended) {
				return;
			}
			if (typeof network.append === 'function' && network.append(network) === false) {
				network.appended = network.loaded = true;
				usnative.activateAll(network);
				return;
			}

			if (network.script) {
				network.el = document.createElement('script');
				usnative.extendObject(network.el, network.script, true);
				network.el.async = true;
				network.el.onload = network.el.onreadystatechange = function()
				{
					if (rstate.test(network.el.readyState || '')) {
						network.el.onload = network.el.onreadystatechange = null;
						network.loaded = true;
						if (typeof network.onload === 'function' && network.onload(network) === false) {
							return;
						}
						usnative.activateAll(network);
					}
				};
				document.body.appendChild(network.el);
			}
			network.appended = true;
		},

		removeNetwork: function(network)
		{
			if (!usnative.networkReady(network.name)) {
				return false;
			}
			if (network.el.parentNode) {
				network.el.parentNode.removeChild(network.el);
			}
			return !(network.appended = network.loaded = false);
		},

		reloadNetwork: function(name)
		{
			var network = networks[name];
			if (network && usnative.removeNetwork(network)) {
				usnative.appendNetwork(network);
			}
		},

		createInstance: function(el, widget)
		{
			var proceed  = true,
				instance = {
					el	  : el,
					uid	 : uid++,
					widget  : widget
				};
			instances.push(instance);
			if (widget.process !== undefined) {
				proceed = (typeof widget.process === 'function') ? widget.process(instance) : false;
			}
			if (proceed) {
				usnative.processInstance(instance);
			}
			instance.el.setAttribute('data-usnative', instance.uid);
			instance.el.className = 'usnative ' + widget.name + ' usnative-instance';
			return instance;
		},

		processInstance: function(instance)
		{
			var el = instance.el;
			instance.el = document.createElement('div');
			instance.el.className = el.className;
			usnative.copyDataAttributes(el, instance.el);
			// stop over-zealous scripts from activating all instances
			if (el.nodeName.toLowerCase() === 'a' && !el.getAttribute('data-default-href')) {
				instance.el.setAttribute('data-default-href', el.getAttribute('href'));
			}
			var parent = el.parentNode;
			parent.insertBefore(instance.el, el);
			parent.removeChild(el);
		},

		activateInstance: function(instance)
		{
			if (instance && !instance.loaded) {
				instance.loaded = true;
				if (typeof instance.widget.activate === 'function') {
					instance.widget.activate(instance);
				}
				usnative.addClass(instance.el, 'usnative-loaded');
				return instance.onload ? instance.onload(instance.el) : null;
			}
		},

		activateAll: function(network)
		{
			if (typeof network === 'string') {
				network = networks[network];
			}
			for (var i = 0; i < instances.length; i++) {
				var instance = instances[i];
				if (instance.init && instance.widget.network === network) {
					usnative.activateInstance(instance);
				}
			}
		},

		load: function(context, el, w, onload, process)
		{
			context = (context && typeof context === 'object' && context.nodeType === 1) ? context : document;

			if (!el || typeof el !== 'object') {
				usnative.load(context, usnative.getElements(context, 'usnative'), w, onload, process);
				return;
			}

			var i;

			if (/Array/.test(Object.prototype.toString.call(el))) {
				for (i = 0; i < el.length; i++) {
					usnative.load(context, el[i], w, onload, process);
				}
				return;
			}

			if (el.nodeType !== 1) {
				return;
			}

			if (!w || !widgets[w]) {
				w = null;
				var classes = el.className.split(' ');
				for (i = 0; i < classes.length; i++) {
					if (widgets[classes[i]]) {
						w = classes[i];
						break;
					}
				}
				if (!w) {
					return;
				}
			}

			var instance,
				widget = widgets[w],
				sid	= parseInt(el.getAttribute('data-usnative'), 10);
			if (!isNaN(sid)) {
				for (i = 0; i < instances.length; i++) {
					if (instances[i].uid === sid) {
						instance = instances[i];
						break;
					}
				}
			} else {
				instance = usnative.createInstance(el, widget);
			}

			if (process || !instance) {
				return;
			}

			if (!instance.init) {
				instance.init = true;
				instance.onload = (typeof onload === 'function') ? onload : null;
				widget.init(instance);
			}

			if (!widget.network.appended) {
				usnative.appendNetwork(widget.network);
			} else {
				if (usnative.networkReady(widget.network.name)) {
					usnative.activateInstance(instance);
				}
			}
		},

		activate: function(el, w, onload)
		{
			window.us_native.load(null, el, w, onload);
		},

		process: function(context, el, w)
		{
			window.us_native.load(context, el, w, null, true);
		},

		network: function(n, params)
		{
			networks[n] = {
				name	 : n,
				el	   : null,
				appended : false,
				loaded   : false,
				widgets  : { }
			};
			if (params) {
				usnative.extendObject(networks[n], params);
			}
		},

		widget: function(n, w, params)
		{
			params.name = n + '-' + w;
			if (!networks[n] || widgets[params.name]) {
				return;
			}
			params.network = networks[n];
			networks[n].widgets[w] = widgets[params.name] = params;
		},

		setup: function(params)
		{
			usnative.extendObject(usnative.settings, params, true);
		}

	};

	return usnative;

})(window, window.document);

(function() {
	var s = window._usnative;
	if (/Array/.test(Object.prototype.toString.call(s))) {
		for (var i = 0, len = s.length; i < len; i++) {
			if (typeof s[i] === 'function') {
				s[i]();
			}
		}
	}
})();

(function(window, document, us_native, undefined)
{

	us_native.setup({
		googleplus: {
			lang: 'en-GB'
		}
	});

	us_native.network('googleplus', {
		script: {
			src: '//apis.google.com/js/plusone.js'
		},
		append: function(network)
		{
			if (window.gapi) {
				return false;
			}
			window.___gcfg = {
				lang: us_native.settings.googleplus.lang,
				parsetags: 'explicit'
			};
		}
	});

	var googleplusInit = function(instance)
	{
		var el = document.createElement('div');
		el.className = 'g-' + instance.widget.gtype;
		us_native.copyDataAttributes(instance.el, el);
		instance.el.appendChild(el);
		instance.gplusEl = el;
	};

	var googleplusEvent = function(instance, callback) {
		return (typeof callback !== 'function') ? null : function(data) {
			callback(instance.el, data);
		};
	};

	var googleplusActivate = function(instance)
	{
		var type = instance.widget.gtype;
		if (window.gapi && window.gapi[type]) {
			var settings = us_native.settings.googleplus,
				params   = us_native.getDataAttributes(instance.el, true, true),
				events   = ['onstartinteraction', 'onendinteraction', 'callback'];
			for (var i = 0; i < events.length; i++) {
				params[events[i]] = googleplusEvent(instance, settings[events[i]]);
			}
			window.gapi[type].render(instance.gplusEl, params);
		}
	};

	us_native.widget('googleplus', 'one',   { init: googleplusInit, activate: googleplusActivate, gtype: 'plusone' });
	us_native.widget('googleplus', 'share', { init: googleplusInit, activate: googleplusActivate, gtype: 'plus' });
	us_native.widget('googleplus', 'badge', { init: googleplusInit, activate: googleplusActivate, gtype: 'plus' });

})(window, window.document, window.us_native);

(function(window, document, us_native, undefined)
{

	us_native.setup({
		facebook: {
			lang: 'en_US',
			appId: us_script.facebook_appid
		}
	});

	us_native.network('facebook', {
		script: {
			src : '//connect.facebook.net/{{language}}/all.js',
			id  : 'facebook-jssdk'
		},
		append: function(network)
		{
			var fb	   = document.createElement('div'),
				settings = us_native.settings.facebook,
				events   = {
					onlike: 'edge.create',
					onunlike: 'edge.remove',
					onsend: 'message.send' ,
					oncomment: 'comment.create',
					onuncomment: 'comment.remove'
				};
			fb.id = 'fb-root';
			document.body.appendChild(fb);
			network.script.src = network.script.src.replace('{{language}}', settings.lang);
			window.fbAsyncInit = function() {
				window.FB.init({
					  appId: settings.appId,
					  xfbml: true
				});
				for (var e in events) {
					if (typeof settings[e] === 'function') {
						window.FB.Event.subscribe(events[e], settings[e]);
					}
				}
			};
		}
	});

	us_native.widget('facebook', 'like', {
		init: function(instance)
		{
			var el = document.createElement('div');
			el.className = 'fb-like';
			us_native.copyDataAttributes(instance.el, el);
			instance.el.appendChild(el);
			if (window.FB && window.FB.XFBML) {
				window.FB.XFBML.parse(instance.el);
			}
		}
	});

})(window, window.document, window.us_native);

(function(window, document, us_native, undefined)
{

	us_native.network('linkedin', {
		script: {
			src: '//platform.linkedin.com/in.js'
		}
	});

	var linkedinInit = function(instance)
	{
		var el = document.createElement('script');
		el.type = 'IN/' + instance.widget.intype;
		us_native.copyDataAttributes(instance.el, el);
		instance.el.appendChild(el);
		if (typeof window.IN === 'object' && typeof window.IN.parse === 'function') {
			window.IN.parse(instance.el);
			us_native.activateInstance(instance);
		}
	};

	us_native.widget('linkedin', 'share',	 { init: linkedinInit, intype: 'Share' });
	us_native.widget('linkedin', 'recommend', { init: linkedinInit, intype: 'RecommendProduct' });

})(window, window.document, window.us_native);

(function(window, document, us_native, undefined)
{

	var VKCallbacks = [];

	us_native.setup({
		vkontakte: {
			apiId: us_script.vkontakte_appid,
			group: {
			  id: 0,
			  mode: 0,
			  width: 48,
			  height: 20
			},
			like: {
			  type: 'mini',
			  pageUrl: null
			}
		}
	});

	us_native.network('vkontakte', {
		script: {
			src : '//vk.com/js/api/openapi.js?105',
			id  : 'vk-jsapi'
		},
		onload: function(network) {
		   var settings = us_native.settings.vkontakte;
		   VK.init({apiId: settings.apiId, onlyWidgets: true});
		   for (var i = 0, i$l = VKCallbacks.length; i < i$l; VKCallbacks[i].call(this), i++);
		}
	});

	var extendConfWithAttributes = function(el, attributes, original) {
		var result = {}, key;
		for (var k = 0, k$l = attributes.length; k < k$l; key = attributes[k], result[key] = el.getAttribute('data-' + key) || original[key], k++);
		return result;
	}

	us_native.widget('vkontakte', 'like', {
		init: function(instance)
		{
			if (typeof window.VK !== 'object') VKCallbacks.push(function(){
				var el	   = document.createElement('div'),
					settings = us_native.settings.vkontakte;
				el.className = 'vk-like';
				el.id = 'vkontakte-like-' + (new Date()).getTime() + Math.random().toString().replace('.', '-');
				us_native.copyDataAttributes(instance.el, el);
				like = extendConfWithAttributes(instance.el, ['pageUrl', 'type'], settings.like);
				instance.el.appendChild(el);
				VK.Widgets.Like(el.id, like);
			});
		}
	});

})(window, window.document, window.us_native);

!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function r(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function t(n,o){var i=u.raw?n:r(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(r,c,f){if(void 0!==c&&!e.isFunction(c)){if(f=e.extend({},u.defaults,f),"number"==typeof f.expires){var a=f.expires,d=f.expires=new Date;d.setTime(+d+864e5*a)}return document.cookie=[n(r),"=",i(c),f.expires?"; expires="+f.expires.toUTCString():"",f.path?"; path="+f.path:"",f.domain?"; domain="+f.domain:"",f.secure?"; secure":""].join("")}for(var p=r?void 0:{},s=document.cookie?document.cookie.split("; "):[],m=0,x=s.length;x>m;m++){var v=s[m].split("="),k=o(v.shift()),l=v.join("=");if(r&&r===k){p=t(l,c);break}r||void 0===(l=t(l))||(p[k]=l)}return p};u.defaults={},e.removeCookie=function(n,o){return void 0===e.cookie(n)?!1:(e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n))}});
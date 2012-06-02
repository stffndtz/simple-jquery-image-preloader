(function($){
	preLoader = {

		$win: $(window),
		$el: $('body').find('*'),
		preloader: $('<div id="loadarea"></div>').appendTo($('body')),
		loader: $('<div id="loader"></div>').appendTo($('body')).css({width: '100%', height: '100%'}),
		items: new Array(),
		doneStatus: 0,
		doneNow: 0,
		ie: navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/),
		ieLoadFixTime: 2000,
		ieTimeout: '',
		finishEvent: $.Event('preloadFinished'),
	
		init: function() {
			if (this.ie === "MSIE 6.0,6.0") return false;
			
			this.loader.css("display","block");
			this.getImages();
			
			//help IE drown if it is trying to die :)
			this.ieTimeout = setTimeout("preLoader.ieLoadFix()", preLoader.ieLoadFixTime);
		
		},
		
		ieLoadFix: function() {
			if (this.ie !== ('undefined' && undefined) && this.ie !== null && this.ie[0].match("MSIE")) {
				while ((100 / this.doneStatus) * this.doneNow < 100) {
					this.imgCallback();
				}
			}
			else
			{
				this.doneLoad();
			}
		},
		
		imgCallback: function() {
			var _this = preLoader;
			
			if(++_this.doneNow === _this.doneStatus) _this.doneLoad();
		},
		
		getImages: function() {
			
			var _this = this;
			
			_this.$el.each(function() {
				var $t = $(this),
				$img = $t.css("background-image"),
				$src = $t.attr("src"),
				url = (($img||$src) ? (($img !== "none" && !$img.match(/gradient/)) ? $img.replace("url(\"", "").replace("url(", "").replace("\")", "").replace(")", "") : (((typeof($src) !== ("undefined" && undefined)) && this.nodeName.toLowerCase() === "img") ? $src : false)) : false);
				
				if(url) _this.items.push(url);
				
			});
			
			_this.doneStatus = _this.items.length;
			_this.createPreloading();
		},
		
		createPreloading: function() {
			var i;		
			for (i = 0; i < this.items.length; i++) {
				$('<img />', { 'src': this.items[i] }).unbind("load").bind("load",this.imgCallback).appendTo(this.preloader);
			}
		},
		
		doneLoad: function() {
			
			var _this = this;
			
			clearTimeout(_this.ieTimeout);
			_this.preloader.remove();
			
			_this.loader.fadeOut(800,function(){
				$(this).remove();
				_this.$win.trigger(_this.finishEvent);
			});				
		}
	
	}

	return preLoader.init();
	
})(jQuery);
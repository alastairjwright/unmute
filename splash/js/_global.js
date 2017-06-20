(function($) {

	var ds = {

		init: function() {
			ds.els = {

			};

			ds.listen();

			$blocks = $('.show-white-block');

			var time = 250;

			$blocks.each(function() {

				var $this = $(this);
				setTimeout( function(){
					$this.removeClass('show-white-block');
				}, time)

				time += 250;
			});
		},

		listen: function () {

		},
	};

	$.Unmute = function(method) {
		if (ds[method]){
			return ds[method].apply(this,Array.prototype.slice.call(arguments,1));
		}
		else if (typeof method === 'object' || ! method){
			return ds.init.apply(this,arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.Unmute');
		}
	};

	$(document).ready(function(){
		$.Unmute();
	});
})(jQuery);

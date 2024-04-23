(function($){

	/**
	 * jQuery Plugin: ajaxFireOnEvent
	 *
	 * Initiates an AJAX request on a specific event for the selected element.
	 *
	 * @param {Object} data - Data to be sent in the AJAX request.
	 * @param {Object} callbacks - Callback functions for different stages of the AJAX request.
	 * @param {Object} options - Additional options for configuring the AJAX request.
	 *
	 * Options:
	 * - route: URL to send the AJAX request.
	 * - cache: If set to true, allows caching of the AJAX response.
	 * - loadHtmlTo: jQuery element where the HTML response will be loaded.
	 * - logEvents: If true, logs AJAX events to the console.
	 *
	 * Callbacks:
	 * - onWait: Callback function to be executed before the AJAX request is sent.
	 * - onDone: Callback function to be executed on successful completion of the AJAX request.
	 * - onError: Callback function to be executed if there is an error in the AJAX request.
	 *
	 * @returns {Object} - The jQuery object for chaining.
	 */
	$.fn.ajaxFireOnEvent = function(data,options)
	{
		let element = $(this);
		let defaults = {
			route:element.attr("data-ajax-route"),
			cache:false,
			loadHtmlTo:null,
			logEvents:false,
			onWait: function () {},
			onDone: function (res) {},
			onError: function () {},
			csrfToken:null
		}

		const settings = $.extend({},defaults,options);

		if(data != null)
		{
			data['csrf_token'] = settings.csrfToken
		}
		else
		{
			data = {};
			data['csrf_token'] = settings.csrfToken
		}

		if(settings.csrfToken != null)
		{
			data['csrf_token'] = settings.csrfToken
		}
		else {
			settings.csrfToken = data['csrf_token'];
		}
		//Attach event
		$.ajax({
			url:settings.route,
			data:data,
			type:"post",
			headers:{
				'X-CSRF-Token':settings.csrfToken
			},
			cache: settings.cache,
			beforeSend:function () {
				settings.onWait();
				if(settings.logEvents)
				{
					console.log("AjaxHelper | ajaxFire (POST): request fired. Waiting for response...");
				}
			},
			success:function(res){
				if(settings.logEvents)
				{
					console.log("AjaxHelper | ajaxFire (POST): Request succeeded. Got the result under the trunk in the 'res'");
				}

				settings.onDone(res);
				if(settings.loadHtmlTo != null)
				{
					let container = settings.loadHtmlTo;
					container.html(res);
				}
			},
			error:function () {
				settings.onError();
				console.log("AjaxHelper | ajaxFire (POST): got error response from the server for route:"+settings.route+". Please refer to corresponding XHR request in your console.");
			}
		});

		return this;
	}


	/**
	 * jQuery Plugin: ajaxFire
	 *
	 * Initiates an AJAX request on form submission and provides customization options and callbacks.
	 *
	 * @param {Object} callbacks - Callback functions for different stages of the AJAX request.
	 * @param {Object} options - Additional options for configuring the AJAX request.
	 *
	 * Options:
	 * - isEncoded: If true, uses FormData for serialized form data; otherwise, uses serialize().
	 * - route: URL to send the AJAX request.
	 * - cache: If set to true, allows caching of the AJAX response.
	 * - loadHtmlTo: jQuery element where the HTML response will be loaded.
	 * - logEvents: If true, logs AJAX events to the console.
	 *
	 * Callbacks:
	 * - onWait: Callback function to be executed before the AJAX request is sent.
	 * - onDone: Callback function to be executed on successful completion of the AJAX request.
	 * - onError: Callback function to be executed if there is an error in the AJAX request.
	 *
	 * @returns {Object} - The jQuery object for chaining.
	 */

	$.fn.ajaxFire = function (options) {
		let fdata;
		let form = $(this);
		let defaults = {
			isEncoded:true,
			route:form.attr("data-ajax-route"),
			cache:false,
			loadHtmlTo:null,
			freezeControls:true,
			logEvents:false,
			parseJson:false,
			onWait: function () {},
			onDone: function (res) {},
			onError: function () {},
			csrfToken:null
		}

		var settings = $.extend({},defaults,options);

		if(form.is("form"))
		{
			form.submit(function (e) {
				var ajaxProp = {
					processData:null,
					contentType:null
				}
				e.preventDefault();
				if(settings.isEncoded)
				{
					fdata = new FormData(this);
					fdata.append('csrf_token',settings.csrfToken);
					ajaxProp.contentType = false;
					ajaxProp.processData = false;
				}
				else {
					fdata = $(this).serialize();
					fdata += '&csrf_token='+settings.csrfToken;
					ajaxProp.contentType = true;
					ajaxProp.processData = true;
				}


				$.ajax({
					url:settings.route,
					data:fdata,
					type:"post",
					cache: settings.cache,
					headers:{
						'X-CSRF-Token':settings.csrfToken
					},
					processData:ajaxProp.processData,
					contentType:ajaxProp.contentType,
					beforeSend:function () {
						if(settings.freezeControls)
						{
							$("button").attr("disabled", "disabled");
							$("button").addClass("disabled");
						}

						settings.onWait();
						if(settings.logEvents)
						{
							console.log("AjaxHelper | ajaxFire (POST): request fired. Waiting for response...");
						}
					},
					success:function(res) {
						if (settings.freezeControls) {
							$("button").removeAttr("disabled", "disabled");
							$("button").removeClass("disabled");
						}

						if (settings.logEvents) {
							console.log("AjaxHelper | ajaxFire (POST): Request succeeded. Got the result under the trunk in the 'res'");
						}

						if (settings.parseJson)
						{
							let jsonRes = JSON.parse(res);
							settings.onDone(jsonRes);
							if(settings.loadHtmlTo != null)
							{
								let container = settings.loadHtmlTo;
								container.html(jsonRes);
							}
						}
						else {
							settings.onDone(res);
							if(settings.loadHtmlTo != null)
							{
								let container = settings.loadHtmlTo;
								container.html(res);
							}
						}
					},
					error:function () {
						if(settings.freezeControls)
						{
							$("button").removeAttr("disabled", "disabled");
							$("button").removeClass("disabled");
						}
						settings.onError();
						console.log("AjaxHelper | ajaxFire (POST): got error response from the server for route:"+settings.route+". Please refer to corresponding XHR request in your console.");

					}
				});
			});
		}
		else {
			console.log("AjaxHelper | ajaxFire (POST): that's not a form!");
		}
		return this;
	}
})(jQuery);

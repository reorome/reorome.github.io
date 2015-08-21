//コンストラクタ
(function() {
	if (window.rbmIsActive)
		return;
	window.rbmIsActive = true;
	window.statementIsSent = false;
	window.rbmMode95 = true;
	console.log( "call rbmGenerateAndPostBookmarklet" );
	rbmGenerateAndPostBookmarklet(window.rbmAuth, window.rbmEndpoint, window.rbmEmail, window.rbmName, window.rbmReturnUrl, window.rbmReturnText, window.contextActivitiesId);
})();
//
	function rbmGenerateAndPostBookmarklet(auth, endpoint, email, name, rbmReturnUrl, rbmReturnText, contextActivitiesId) {
		window.rbmRunning = true;
		var inputs = {};
		inputs.auth = auth;
		inputs.endpoint = endpoint;
		inputs.email = email;
		inputs.name = name;
        inputs.rbmReturnUrl = (rbmReturnUrl === undefined) ? endpoint : rbmReturnUrl;
        inputs.rbmReturnText = (rbmReturnText === undefined) ? "Go To The Learning Record Store" : rbmReturnText;

      //2013-11-25 コンテキストにotherとしてassetのURLを追加するための変数
        inputs.contextActivitisId = contextActivitiesId;
        console.log( "call rbmCreateOverlay" );
		rbmCreateOverlay(inputs);
	}

	function rbmSendStatement(inputs) {
		var statement = {}, extraHeaders = {}, extensionPrefix = "http://tincanapi.com/extensions/";
		if (window.rbmMode95)
		{
			console.log("１：ステートメント生成");

			statement.version = "1.0.0";

			statement.actor = {};
			statement.actor.mbox = 'mailto:' + inputs.email;
			statement.actor.name = inputs.name;
			statement.verb = {};
			statement.verb.id = "http://activitystrea.ms/schema/1.0/save";
			statement.verb.display = {};
			statement.verb.display['en-US'] = "saved";
			statement.object = {};
			statement.object.id = document.URL;
			statement.object.objectType = 'Activity';
			statement.object.definition = {};
			statement.object.definition.name = {};
			statement.object.definition.name['en-US'] = document.title;
			/*
			statement.object.id = document.URL.replace(/.*?:\/\//g, '');
			if (statement.object.id.match(/^www\./)) {
				statement.object.id = statement.object.id.substring(4);
			}
			*/

			statement.object.definition = {};
			statement.object.definition.name = {};
			statement.object.definition.name['en-US'] = document.title;
			statement.context = {};
			//2013-11-25 コンテキストにotherとしてassetのURLを追加する試み
			statement.context.contextActivities = {};
			statement.context.contextActivities.category = {};
			statement.context.contextActivities.category['id'] = inputs.contextActivitisId;

			statement.context.extensions = {};
			statement.context.extensions[extensionPrefix + 'browser-info'] = {};
			statement.context.extensions[extensionPrefix + 'browser-info']['code_name'] = navigator.appCodeName;
			statement.context.extensions[extensionPrefix + 'browser-info']['name'] = navigator.appName;
			statement.context.extensions[extensionPrefix + 'browser-info']['version'] = navigator.appVersion;
			statement.context.extensions[extensionPrefix + 'browser-info']['platform'] = navigator.platform;
			statement.context.extensions[extensionPrefix + 'browser-info']['user-agent-header'] = navigator.userAgent;
			statement.context.extensions[extensionPrefix + 'browser-info']['cookies-enabled'] = navigator.cookieEnabled;
	
			extraHeaders["X-Experience-API-Version"] = "1.0.0";
		}
		else
		{
			console.log("２：ステートメント生成");
			statement.actor = {};
			statement.actor.mbox = [];
			statement.actor.mbox.push('mailto:' + inputs.email);
			statement.actor.name = [];
			statement.actor.name.push(inputs.name);
			statement.verb = "saved";
			statement.object = {};
			statement.object.id = document.URL;
			statement.object.objectType = 'Activity';
			statement.object.definition = {};
			statement.object.definition.name = {};
			statement.object.definition.name['en-US'] = document.title;
			statement.context = {};
			//2013-11-25 コンテキストにotherとしてassetのURLを追加する試み
			statement.context.contextActivities = {};
			statement.context.contextActivities.category = {};
			statement.context.contextActivities.category['id'] = inputs.contextActivitisId;

			statement.context.extensions = {};
			statement.context.extensions[extensionPrefix + 'browser-info'] = {};
			statement.context.extensions[extensionPrefix + 'browser-info']['code_name'] = navigator.appCodeName;
			statement.context.extensions[extensionPrefix + 'browser-info']['name'] = navigator.appName;
			statement.context.extensions[extensionPrefix + 'browser-info']['version'] = navigator.appVersion;
			statement.context.extensions[extensionPrefix + 'browser-info']['platform'] = navigator.platform;
			statement.context.extensions[extensionPrefix + 'browser-info']['user-agent-header'] = navigator.userAgent;
			statement.context.extensions[extensionPrefix + 'browser-info']['cookies-enabled'] = navigator.cookieEnabled;
			
			extraHeaders["X-Experience-API-Version"] = "1.0.0";
		}
        console.log( "rbmXHR_request with statements" );
		rbmXHR_request(null, inputs.endpoint, 'POST', rbmToJSONString(statement), inputs.auth, rbmSuccess, false, extraHeaders);
	}

	function rbmCreateOverlay(inputs) {
		var overlay = document.createElement('div'),
			opacity = 0.00,
			cssStyling,
			textStyle;
		textStyle = "-webkit-text-size-adjust: none; " + "font-family: Helvetica, Arial, sans-serif; font-weight: bold; " + "line-height: 1.0; letter-spacing: normal; font-variant: normal; font-style: normal;";
		overlay.setAttribute('id', 'rbmoverlay');
		cssStyling = "position: fixed; z-index: 2147483647; left: 0; top: 0; width: 100%; height: 100%; " +" text-align: center; " + "padding: 256px 0 0 0; margin: 0; background-color: #000; color: white" + textStyle;
		overlay.setAttribute('style', cssStyling + "opacity: 0.00;");

		var rbmSpan = document.createElement('span');
		rbmSpan.setAttribute('id', 'rbmSpan');
		rbmSpan.setAttribute('style', textStyle + 'color: #ccc;' + 'font-size: 28px;');

		// 2014/12/16 hisasue  テキスト試験的に削除
		rbmSpan.appendChild(document.createTextNode(''));
		overlay.appendChild(rbmSpan);
		
		fragment = document.createDocumentFragment();
		
		rbmSpan = document.createElement('br');
		fragment.appendChild(rbmSpan);
		rbmSpan = document.createElement('br');
		fragment.appendChild(rbmSpan);
		rbmSpan = document.createElement('br');
		fragment.appendChild(rbmSpan);


// hisasue

	// テキスト　登録しますか？
	var el_i = document.createElement("img");
	el_i.setAttribute("src", "http://111.64.89.241/icons/registrationText2.png");
	fragment.appendChild(el_i);

	rbmSpan = document.createElement('br');
        fragment.appendChild(rbmSpan);
	rbmSpan = document.createElement('br');
        fragment.appendChild(rbmSpan);

	// knowledgeGroupId=100 登録ボタン
	el_i = document.createElement("img");
	el_i.setAttribute("src", "http://111.64.89.241/icons/registrationButton.png");
	el_i.setAttribute("style", "cursor: hand; cursor:pointer;");
	el_i.setAttribute('onclick', 'sendStatement(1219);');

	fragment.appendChild(el_i);

	overlay.appendChild(fragment);

		var form = document.createElement('form');
		form.action = 'http://google.com';
		form.method = 'post';
		form.submit();


		overlay.appendChild(fragment);
		
		rbmSpan = document.createElement('div');
		rbmSpan.setAttribute('id', 'rbmCloseButton');
		rbmSpan.setAttribute('style', 'margin: 3em auto; width: 16em; border-width:2px; border-color:#7e7c7c; border-style:solid; padding:30px; cursor:pointer; font-size: 14px: padding: 30px 15px 30px 15px; opacity: 1; color: #bbb; background-color: #222; background-image: -webkit-linear-gradient(#333, #111); border-radius: 3px; height:1.2em;');
		rbmSpan.setAttribute('onclick', 'rbmClose();');
		rbmSpan.appendChild(document.createTextNode("Close"));
		overlay.appendChild(rbmSpan);
	
		document.body.appendChild(overlay);
		setTimeout(function() { rbmAnimateOverlay(opacity, inputs); }, 75);
	}

	function sendStatement(categoryId){
		var inputs = {};
		inputs.auth = window.rbmAuth;
		inputs.endpoint = window.rbmEndpoint;
		inputs.email = window.rbmEmail;
		inputs.name = window.rbmName;
        inputs.rbmReturnUrl = (window.rbmReturnUrl === undefined) ? window.rbmEndpoint : window.rbmReturnUrl;
        inputs.rbmReturnText = (window.rbmReturnText === undefined) ? "Go To The Learning Record Store" : window.rbmReturnText;

		inputs.contextActivitisId = window.contextActivitiesId + categoryId;
		if(!window.statementIsSent){
			window.statementIsSent = true;
			rbmSendStatement(inputs);
		}
	}

	function rbmAnimateOverlay(opacity, inputs) {
		var overlay = document.getElementById('rbmoverlay');
		if (!overlay) return;

		opacity += 0.05;
		overlay.style.opacity = opacity;
		if (opacity < 0.95)
			setTimeout(function() { rbmAnimateOverlay(opacity, inputs); }, 75);
		//else
		//	setTimeout(function() { rbmSendStatement(inputs); }, 75);
	}

	/**
	 * Due to certain websites changing the browsers inherit JSON Converters,
	 * this copy of the recursive implementation is provided to circumvent
	 * any such modifications
	*/
	function rbmToJSONString (vContent) {
	  if (vContent instanceof Object) {
		var sOutput = "";
		if (vContent.constructor === Array) {
		  for (var nId = 0; nId < vContent.length; sOutput += this.rbmToJSONString(vContent[nId]) + ",", nId++);
		  console.log( "1:[" + sOutput.substr(0, sOutput.length - 1) + "]");
		  return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
		}
		if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
		for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.rbmToJSONString(vContent[sProp]) + ","; }
		 console.log( "2:{" + sOutput.substr(0, sOutput.length - 1) + "}");
		return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
	  }
	  return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
	}

	function rbmXHR_request(lrs, url, method, data, auth, callback, ignore404, extraHeaders) {
		"use strict";
		var xhr,
			finished = false,
			xDomainRequest = false,
			ieXDomain = false,
			ieModeRequest,
			title,
			ticks = ['/','-','\\','|'],
			urlparts = url.toLowerCase().match(/^(.+):\/\/([^:\/]*):?(\d+)?(\/.*)?$/),
			location = window.location,
			urlPort,
			result,
			extended,
			prop,
			until;

		// add extended LMS-specified values to the URL
		if (lrs !== null && lrs.extended !== undefined) {
			extended = new Array();
			for (prop in lrs.extended) {
				extended.push(prop + "=" + encodeURIComponent(lrs.extended[prop]));
			}
			if (extended.length > 0) {
				url += (url.indexOf("?") > -1 ? "&" : "?") + extended.join("&");
			}
		}

		//Consolidate headers
		var headers = {};
		headers["Content-Type"] = "application/json";
		headers["Authorization"] = auth;
		if(extraHeaders !== null){
			for(var headerName in extraHeaders){
				headers[headerName] = extraHeaders[headerName];
			}
		}

		//See if this really is a cross domain
		xDomainRequest = (location.protocol.toLowerCase() !== urlparts[1] || location.hostname.toLowerCase() !== urlparts[2]);
		if (!xDomainRequest) {
			urlPort = (urlparts[3] === null ? ( urlparts[1] === 'http' ? '80' : '443') : urlparts[3]);
			xDomainRequest = (urlPort === location.port);
		}

		//If it's not cross domain or we're not using IE, use the usual XmlHttpRequest
		if (!xDomainRequest || typeof(XDomainRequest) === 'undefined') {
			xhr = new XMLHttpRequest();
			xhr.open(method, url, callback != null);
			for(var headerName in headers){
				xhr.setRequestHeader(headerName, headers[headerName]);
			}
		}
		//Otherwise, use IE's XDomainRequest object
		else {
			ieXDomain = true;
			ieModeRequest = TCDriver_GetIEModeRequest(method, url, headers, data);
			xhr = new XDomainRequest();
			xhr.open(ieModeRequest.method, ieModeRequest.url);
		}

		//Setup request callback
		function requestComplete() {
			if(!finished){
				// may be in sync or async mode, using XMLHttpRequest or IE XDomainRequest, onreadystatechange or
				// onload or both might fire depending upon browser, just covering all bases with event hooks and
				// using 'finished' flag to avoid triggering events multiple times
				finished = true;
				var notFoundOk = (ignore404 && xhr.status === 404);
				if (xhr.status === undefined || (xhr.status >= 200 && xhr.status < 400) || notFoundOk) {
					if (callback) {
						callback(xhr);
					} else {
						result = xhr;
						return xhr;
					}
				} else {
					try {
						rbmFailure(xhr);
						//alert("There was a problem communicating with the Learning Record Store. (" + xhr.status + " | " + xhr.responseText+ ")");
					} catch (ex) {alert (ex.toString());}
					//throw new Error("debugger");
					return xhr;
				}
			} else {
				return result;
			}
		};

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				requestComplete();
			}
		};

		xhr.onload = requestComplete;
		xhr.onerror = requestComplete;

		xhr.send(ieXDomain ? ieModeRequest.data : data);

		if (!callback) {
			// synchronous
			if (ieXDomain) {
				// synchronous call in IE, with no asynchronous mode available.
				until = 1000 + new Date();
				while (new Date() < until && xhr.readyState !== 4 && !finished) {
					delay();
				}
			}
			return requestComplete();
		}
	}

	function rbmSuccess() {
		var textSpan = document.getElementById('rbmSpan');
		textSpan.firstChild.data = document.title;
		textSpan.appendChild(document.createElement('div'));
		textSpan.appendChild(document.createTextNode("Statement Sent!"));

		//var img_sample = document.getElementById("img_sample");
		//img_sample.removeChild(img_sample);
		//el_i.removeChild(el_i);
	//	var img_sample = document.getElementById('fragment');

	//	for (var i =fragment.childNodes.length-1; i>=0; i--) {
	//	fragment.removeChild(fragment.childNodes[i]);
	//	}


var d = document.getElementById('rbmoverlay');
                if (d) {
                        d.style.display = 'none';
                        d.parentNode.removeChild(d);
                }
                delete window.rbmAuth;
                delete window.rbmEndpoint;
                delete window.rbmEmail;
                delete window.rbmName;
                delete window.rbmIsActive;



	}

	function rbmFailure(xhr) {
		if (xhr.status === 400 && window.rbmMode95)
		{
			window.rbmMode95 = false;
			var inputs = {};
			inputs.auth = window.rbmAuth;
			inputs.endpoint = window.rbmEndpoint;
			inputs.email = window.rbmEmail;
			inputs.name = window.rbmName;
			rbmSendStatement(inputs);
			return;
		}
		var textSpan = document.getElementById('rbmSpan');
		textSpan.firstChild.data = "Statement Failed";
		setTimeout(rbmClose, 1000);
	}

	function rbmRedirect(endpoint) {
		if (endpoint === "https://cloud.scorm.com/ScormEngineInterface/TCAPI/public/statements")
		{
			endpoint = "http://tincanapi.com/developers/resources/statement-viewer/";
		}
		var newWindow = window.open(endpoint);
		if (!newWindow)
		{
			window.prompt("Copy to clipboard: Ctrl+C (CMD+C), Enter, and paste into Address Bar", endpoint);
		}
	}

	function rbmClose() {
		var d = document.getElementById('rbmoverlay');
		if (d) {
			d.style.display = 'none';
			d.parentNode.removeChild(d);
		}
		delete window.rbmAuth;
		delete window.rbmEndpoint;
		delete window.rbmEmail;
		delete window.rbmName;
		delete window.rbmIsActive;
	}

	function TCDriver_GetIEModeRequest (method, url, headers, data) {
        var newUrl = url,
            //Everything that was on query string goes into form vars
            formData = [],
            qsIndex = newUrl.indexOf('?'),
            result
        ;
        if (qsIndex > 0) {
            formData.push(newUrl.substr(qsIndex + 1));
            newUrl = newUrl.substr(0, qsIndex);
        }

        //Method has to go on querystring, and nothing else
        newUrl = newUrl + '?method=' + method;

        //Headers
        if (headers !== null) {
            for (var headerName in headers) {
                formData.push(headerName + "=" + encodeURIComponent(headers[headerName]));
            }
        }

        //The original data is repackaged as "content" form var
        if (data !== null) {
            formData.push('content=' + encodeURIComponent(data));
        }

        result = {
            method: "POST",
            url: newUrl,
            headers: {},
            data: formData.join("&")
        };

        return result;
    }

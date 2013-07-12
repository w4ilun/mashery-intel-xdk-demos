/* xhr.js 
 * This overrides the XMLHTTPRequest object to allow cross domain ajax requests
 */
(function () {
    document.addEventListener("appMobi.device.remote.data", getRemoteExtCB, false);
    var ajaxCallbacks = [];

    function getRemoteExtCB(obj) {
        if (ajaxCallbacks.length > 0 && ajaxCallbacks[obj.id]) {
            ajaxCallbacks[obj.id](obj);
        }
    }

    XMLHttpRequest_Native = XMLHttpRequest;
    XMLHttpRequest.Extension = new Object;

    XMLHttpRequest.Extension.addObject = function (object) {
        uniqueId = Math.floor(Math.random() * 99999999);
        object.uniqueId = uniqueId;
        this[uniqueId] = object;
        return uniqueId;
    }

    XMLHttpRequest.Extension.sendXMLHTTP = function (data) {
        var myparams = new AppMobi.Device.RemoteDataParameters();
        for (var j in data.headers) {
            myparams.addHeader(j, data.headers[j]);
        }

        myparams.url = data.requestData.URL;
        myparams.id = data.uniqueId;
        myparams.method = data.requestData.method
        myparams.body = data.body;
		try{
		if(typeof myparams.body=="object"){
		    myparams.body=JSON.stringify(myparams.body);
		}
        ajaxCallbacks[myparams.id] = this.handleResponseData;
        AppMobi.device.getRemoteDataExt(myparams);
		}
		catch(e){}
    }

    XMLHttpRequest.Extension.handleResponseData = function (object) {

        var XMLObj = XMLHttpRequest.Extension[object.id];
        //EMULATED "HEADERS RECEIVED" CHANGES
        var newHeaders = [];
        for (var j in object.extras.headers) {
            newHeaders[j.toLowerCase()] = object.extras.headers[j]; //jQuery looks for lowercase
            newHeaders[j] = object.extras.headers[j];
        }
        XMLObj.responseData.headers = newHeaders;
        XMLObj.readyState = XMLObj.HEADERS_RECEIVED;
        if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();

        XMLObj.readyState = XMLObj.LOADING;
        if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();

        XMLObj.response = object.response;
        XMLObj.status = object.extras.status;
        XMLObj.responseText = object.response;
        XMLObj.responseXML = object.response;
        XMLObj.readyState = XMLObj.DONE;

        if (typeof XMLObj.onreadystatechange == 'function') XMLObj.onreadystatechange();
    }


    // XMLHTTP REDEFINE
    //=======================================================================================================================
    //DEFINE "CONSTANTS" FOR CONSTRUCTOR
    XMLHttpRequest.UNSENT = 0; //const
    XMLHttpRequest.OPENED = 1; //const
    XMLHttpRequest.HEADERS_RECEIVED = 2; //const
    XMLHttpRequest.LOADING = 3; //const
    XMLHttpRequest.DONE = 4; //const

    //DEFINE "CONSTANTS" PROTOTYPE
    XMLHttpRequest.prototype.UNSENT = 0; //const
    XMLHttpRequest.prototype.OPENED = 1; //const
    XMLHttpRequest.prototype.HEADERS_RECEIVED = 2; //const
    XMLHttpRequest.prototype.LOADING = 3; //const
    XMLHttpRequest.prototype.DONE = 4; //const
    //XMLHttpRequest = {readyState:0 };
    XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.readyState = 0;
    XMLHttpRequest.prototype.onreadystatechange;
    XMLHttpRequest.prototype.headers = {};
    XMLHttpRequest.prototype.body = "";



    XMLHttpRequest.prototype.requestData = {
        'method': null,
        'URL': null,
        'asynchronous': true,
        'username': null,
        'password': null,
        'headers': null
    };
    XMLHttpRequest.prototype.responseData = {
        'headers': null
    };


    XMLHttpRequest.prototype.abort = function abort() {};
    XMLHttpRequest.prototype.addEventListener = function addEventListener() {};
    XMLHttpRequest.prototype.constructor = function XMLHttpRequest() {};
    XMLHttpRequest.prototype.dispatchEvent = function dispatchEvent() {};

    XMLHttpRequest.prototype.getAllResponseHeaders = function getAllResponseHeaders() {
        if (this.readyState == this.OPENED || this.readyState == this.UNSENT) return "";
        else {
            return this.responseData.headers;
        }
    };

    XMLHttpRequest.prototype.getResponseHeader = function getResponseHeader(header) {
        return this.responseData.headers && this.responseData.headers[header] ? this.responseData.headers[header] : "";
    };

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        //supported methods: CONNECT, DELETE, GET, HEAD, OPTIONS, POST, PUT, TRACE, or TRACK
		/*    Empty the list of author request headers.
		Set the request method to method.
		Set the request URL to url.
		Set the request username to temp user.
		Set the request password to temp password.
		Set the asynchronous flag to the value of async.
		*/
        this.requestData.method = method;
        this.requestData.URL = url;
        this.requestData.asynchronous = async;
        this.requestData.user = user;
        this.requestData.password = password;
        this.readyState = this.OPENED;
        if (typeof this.onreadystatechange == 'function') this.onreadystatechange();

    }

    XMLHttpRequest.prototype.overrideMimeType = function overrideMimeType() {};
    XMLHttpRequest.prototype.removeEventListener = function removeEventListener() {};

    XMLHttpRequest.prototype.send = function send(data) {
        this.body = data;
		if(this.requestData.asynchronous===false)
		{
			throw ("Synchronous XMLHtppRequest calls are not allowed.  Please change your request to be asynchronous");
			return;
		}
        XMLHttpRequest.Extension.sendXMLHTTP(this);
    };

    XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(header, value) {
        this.headers[header] = value;
    };


    function XMLHttpRequest() {
        XMLHttpRequest.Extension.addObject(this);
        this.onabort = null;
        this.onerror = null;
        this.onload = null;
        this.onloadstart = null;
        this.onprogress = null;
        this.onreadystatechange = null;
        this.readyState = 0;
        this.response = "";
        this.responseText = "";
        this.responseType = "";
        this.responseXML = null;
        this.status = 0;
        this.statusText = "";
        this.withCredentials = false;
        this.requestData = {
            'method': null,
            'URL': null,
            'asynchronous': null,
            'username': null,
            'password': null,
            'headers': null
        };
    }
    window.XMLHttpRequest = XMLHttpRequest;
})();
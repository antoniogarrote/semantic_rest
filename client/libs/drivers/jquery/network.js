Siesta.registerNamespace("Siesta","Drivers","jQuery","Network");

Siesta.Drivers.jQuery.Network.jsonpRequest = function(request,callbackParameterName,callbackName) {
    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+callbackName;
    } else {
        request = request+"?"+callbackParameterName+"="+callbackName;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};

Siesta.Drivers.jQuery.Network.jsonpRequestForFunction = function(request,callbackParameterName,callbackFunction) {

    var tmpIdentifier = "siesta_func_jsonp_callback_"+(new Date()).getTime();

    eval(tmpIdentifier+" = function(resp){ callbackFunction(resp); };");

    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+tmpIdentifier;
    } else {
        request = request+"?"+callbackParameterName+"="+tmpIdentifier;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};

Siesta.Drivers.jQuery.Network.jsonpRequestForMethod = function(request,callbackParameterName,callbackObject,callbackFunction) {

    var tmpIdentifier = "siesta_func_jsonp_callback_"+(new Date()).getTime();

    eval(tmpIdentifier+" = function(resp){ callbackFunction.call(callbackObject,resp); };");

    if(request.indexOf("?")!=-1) {
        request = request+"&"+callbackParameterName+"="+tmpIdentifier;
    } else {
        request = request+"?"+callbackParameterName+"="+tmpIdentifier;
    }

    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = request;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(node);
};


Siesta.Drivers.jQuery.Network.ajaxRequestForFunction = function(request,httpMethod,headers,callbackFunction) {
    jQuery.ajax({
        url: request,
        type: method,
        dataType: "text",
        success: function(data){
            callbackFunction(data);
        },
        error: function(transport) {
            callbackFunction(Siesta.Constants.FAILURE);
        } });


//     new Ajax.Request(request,
//                      { method:httpMethod,
//                        requestHeaders: headers,
//                        evalJS: false,
//                        evalJSON: false,
//                        onSuccess: function(transport) {
//                            callbackFunction(transport.responseText);
//                        },
//                        onFailure: function(transport) {
//                            callbackFunction(Siesta.Constants.FAILURE);
//                        } });

};

Siesta.Drivers.jQuery.Network.ajaxRequestForMethod = function(request,method,headers,callbackObject,callbackFunction) {
    jQuery.ajax({
        url: request,
        type: method,
        dataType: "text",
        success: function(data){
            callbackFunction.call(callbackObject,data);
        },
        error: function(transport) {
            callbackFunction(Siesta.Constants.FAILURE);
        } });

//     new Ajax.Request(request,
//                      { method:httpMethod,
//                        requestHeaders: headers,
//                        evalJS: false,
//                        evalJSON: false,
//                        onSuccess: function(transport) {
//                            callbackFunction.call(callbackObject,transport.responseText);
//                        },
//                        onFailure: function(transport) {
//                            callbackFunction.call(callbackObject,Siesta.Constants.FAILURE);
//                        } });

};


//Let's register the framework
Siesta.registerFramework("network");
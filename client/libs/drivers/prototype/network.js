Siesta.registerNamespace("Siesta","Drivers","Prototype","Network");

Siesta.Drivers.Prototype.Network.jsonpRequest = function(request,callbackParameterName,callbackName) {
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

Siesta.Drivers.Prototype.Network.jsonpRequestForFunction = function(request,callbackParameterName,callbackFunction) {

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

Siesta.Drivers.Prototype.Network.jsonpRequestForMethod = function(request,callbackParameterName,callbackObject,callbackFunction) {

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


Siesta.Drivers.Prototype.Network.ajaxRequestForFunction = function(request,httpMethod,headers,callbackFunction) {
    new Ajax.Request(request,
                     { method:httpMethod,
                       requestHeaders: headers,
                       evalJS: false,
                       evalJSON: false,
                       onSuccess: function(transport) {
                           callbackFunction(transport.responseText);
                       },
                       onFailure: function(transport) {
                           callbackFunction(Siesta.Constants.FAILURE);
                       } });

};

Siesta.Drivers.Prototype.Network.ajaxRequestForMethod = function(request,method,headers,callbackObject,callbackFunction) {
    new Ajax.Request(request,
                     { method:httpMethod,
                       requestHeaders: headers,
                       evalJS: false,
                       evalJSON: false,
                       onSuccess: function(transport) {
                           callbackFunction.call(callbackObject,transport.responseText);
                       },
                       onFailure: function(transport) {
                           callbackFunction.call(callbackObject,Siesta.Constants.FAILURE);
                       } });

};


//Let's register the framework
Siesta.registerFramework("network");
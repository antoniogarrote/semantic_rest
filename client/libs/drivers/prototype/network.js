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
}

//Let's register the framework
Siesta.registerFramework("network");
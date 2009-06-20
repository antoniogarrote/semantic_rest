/**
  main namespace for the library
*/
var Siesta = {};


/**
  main namespace for the framework
*/
Siesta.Framework = {};

/**
  constants

*/
Siesta.Constants = {};
Siesta.Constants.SUCCESS = "success";
Siesta.Constants.FAILURE = "failure";

/**
  Checks if one function is defined in the
  runtime.
  - fn : Lambda function wrapping the symbol
         to check.
*/
Siesta.defined = function(fn) {
  try {
    fn();
    return true;
  } catch(ex) {
    return false;
  }
};


/**
  Tests if we are executing under Rhino
*/
Siesta.isRhino = function() {
    return Siesta.defined(function(){gc});
};

/**
  Returns the current path in the browser till the last '/' (not included)
*/
Siesta.currentPath = function() {
        return location.href.split("/").slice(0,-1).join("/");
};


/**
  generic load of scripts it should load
  with the Rhino 'load' function or with
  the javascript framework in the browser
  - scriptPath : path to the script to load.
*/
Siesta.load = function(scriptPath)  {
    if(Siesta.isRhino()) {
	load(scriptPath);
    } else {
        var thePath = "";
        for(i = 0; i<arguments.length; i++) {
            if(i!=0) {
                thePath = thePath.concat("/").concat(arguments[i]);
            } else {
                thePath = thePath.concat(arguments[i]);
            }
        }
        var e = document.createElement("script");
        e.src = thePath;
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
};

/**
  load scripts from the path specified from the initial base directory
  - scriptPath : path to the script to load.
*/
Siesta.loadFromBase = function(scriptPath)  {
    if(Siesta.isRhino()) {
	load(scriptPath);
    } else {
        thePath = Siesta.basePath();
        for(i = 0; i<arguments.length; i++) {
            thePath = thePath.concat("/").concat(arguments[i]);
        }
        var e = document.createElement("script");
        e.src = thePath;
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
};

/**
  Allow the enumeration of object methods in Rhino
*/
Object.prototype.methods = function() {
    var ms = [];
    counter = 0;
    for(var i in this) {
        ms[counter] = i;
        if(Siesta.isRhino()) {
            print(counter+": "+i);
        }
        counter++;
    }

    ms;
}

/**
 *  Let's load microtype if we are in
 *  Rhino to have basic class support.
 *  If we're in a browser, Prototype
 *  will be loaded.
 */
if(Siesta.isRhino()) {
    load("microtype.js");
}

/**
 *  Registers a new namespace in the javascript
 *  runtime.
 */
Siesta.registerNamespace = function() {
    var nsPath = "";
    for (var i=0; i<arguments.length; i++) {
        var ns = arguments[i];
        if(nsPath != "") {
            nsPath = nsPath + ".";
        }
        var nsPath = nsPath + ns;
        try {
            var res = eval(nsPath);
            if(res == null) {
                throw new Exception();
            }
        } catch(e) {
            eval(nsPath + " = {};");
        }
    }
}

/**
 *  Namespace object definition.
 *  Stores a name and url for the namespace.
 */
Siesta.Framework.Namespace = Class.create();
Siesta.Framework.Namespace.prototype = {

    /**
     *  Builds a new namespace.
     *
     *  @arguments
     *  - name: the name of the namespace.
     *  - uri: the uri of this namespace.
     */
    initialize: function(name,uri) {
        this.name = name;
        this.uri = uri;
        this.__type = 'namespace';
    }
};

/**
 *  Uri object definition.
 *  Stores a a Uri for the namespace.
 */
Siesta.Framework.Uri = Class.create();
Siesta.Framework.Uri.prototype = {

    /**
     *  Builds a new Uri object.
     *
     *  @arguments
     *  - namespace: optional prefix of a namespace.
     *  - value: mandatory value for the URI.
     *
     *  @throws
     *  - an exception is thrown if no value or namespace and value are given.
     */
    initialize: function() {
        if(arguments.length == 2) {
            this.namespace = arguments[0];
            this.value = arguments[1];
        } else if(arguments.length == 1) {
            this.value = arguments[0];
            this.namespace = null;
        } else {
            throw new Error("Trying to create null Siesta.Framework.Uri");
        }
        this.__type = 'uri';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        if(this.namespace == null) {
            return this.value;
        } else {
            return this.namespace + this.value;
        }
    }
};

/**
 *  BlankNode object definition.
 */
Siesta.Framework.BlankNode = Class.create();
Siesta.Framework.BlankNode.prototype = {

    /**
     *  Builds a new BlankNode object.
     *
     *  @arguments
     *  - identifier: the identifier of the blank node.
     *
     */
    initialize: function(identifier) {
        if(identifier == null) {
            throw new Error("Trying to create a Siesta.Framework.BlankNode with a null identifier");
        }

        this.value = identifier;
        this.__type = 'blanknode';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        return "_:"+this.value;
    }
};


/**
 *  Literal object definition.
 */
Siesta.Framework.Literal = Class.create();
Siesta.Framework.Literal.prototype = {

    /**
     *  Builds a new Literal object.
     *
     *  @arguments
     *  - object with the following fields:
     *    - value: mandator value for the literal.
     *    - language: optional language for the literal.
     *    - type: optional Siesta.framework.Uri for the type.
     *
     *  @throws
     *  - an exception is thrown if no value or namespace and value are given.
     */
    initialize: function(options) {
        if(options.value == null) {
            throw new Error("Trying to create null Siesta.Framework.Literal");

        //} else if(options.value != null && options.value.prototype != Siesta.Framework.Uri.prototype) {
            // TODO: look for a way to check this.
            //throw new Error("Trying to set up the type of Siesta.Framework.Literal with an object different of a Siesta.Framework.Uri");

        } else if(arguments.length == 1) {

            this.value = options.value;
            this.language = options.language;
            this.type = options.type

        } else {

            throw new Error("Trying to set up the type of Siesta.Framework.Literal with a more than one argument");

        }
        this.__type = 'literal';
    },

    /**
     * Human readable representation of this URI
     */
    toString: function() {
        var str = '"'+this.value+'"';
        if(this.type != null) {
            str = str+"^^"+this.type.toString();
        }
        if(this.language != null) {
            str = str+"@"+this.language;
        }

        return str;
    }
};

/**
 *  Triple object definition to
 *  be shared between drivers
 *
 *  A Siesta triple is basically a container for
 *  the subject, predicate and object of the
 *  triple.
 */
Siesta.Framework.Triple = Class.create();
Siesta.Framework.Triple.prototype = {
    /**
     * Builds a new Triple.
     * Every argument is optional.
     *
     * @arguments:
     * - subject: the subject of the triple.
     * - predicate: the predicate of the triple.
     * - object: the object of the triple.
     */
    initialize: function() {
        if(arguments.length == 3) {
            this.subject = arguments[0];
            this.predicate = arguments[1];
            this.object = arguments[2];
        } else if(arguments.length == 2) {
            this.subject = arguments[0];
            this.predicate = arguments[1];
            this.object = null;
        } else if(arguments.length == 1) {
            this.subject = arguments[0];
            this.predicate = null;
            this.object = null;
        } else {
            this.subject = null;
            this.predicate = null;
            this.object = null;
        }
        this.__type = 'triple';
    },

    /**
     * Test if subject, predicate and object
     * are set for this triple.
     *
     * @returns Bool
     */
    isValid: function() {
        return (this.subject != null &&
                this.predicate != null &&
                this.object != null)
    },

    /**
     *  Human readable representation of this triple.
     */
    toString: function() {
        return "("+this.subject+","+this.predicate+","+this.object+")";
    }
};

/**
 *  Graph object definition to
 *  be shared between drivers
 *
 *  A Siesta graph is basically a container of triples,
 *  each driver must manipulate this graph and
 *  transform it to their native representation.
 */
Siesta.Framework.Graph = Class.create();
Siesta.Framework.Graph.prototype = {
    initialize: function() {

        // A hash of namespaces
        this.namespaces = {};

        // The inverted hash o namespaces
        this.invNamespaces = {};

        // The collection of triples in the graph
        this.triples = {};

        // Triples cache
        this.triplesCache = [];

        // base URI for the graph
        this.baseUri = null;

        // a native representation for this graph
        // cached in the siesta graph.
        //this.native = null;
    },

    /**
     *  Adds a new namespace to this graph.
     *
     *  @arguments
     *  - aNamespace: the namespace to be added
     */
    addNamespace: function(aNamespace /* Siesta.Framework.Namespace */) {
        this.namespaces[aNamespace.name] = aNamespace.uri;
        this.invNamespaces[aNamespace.uri] = aNamespace.name;
    },

    /**
     *  Adds one triple to the index
     *
     *  @arguments
     *  - aTriple: the triple to be added.
     */
    addTriple: function(aTriple /* Siesta.Framework.Triple */) {

        if(aTriple.__type != 'triple') {
            throw new Exception("Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph");
        } else {

            var wasInserted = this.__addTripleByObject(aTriple,
                this.__addTripleByPredicate(aTriple,
                this.__addTripleBySubject(aTriple)));
            if(wasInserted == true) {
                this.triplesCache.push(aTriple);
            }
        }
    },

    /**
     *  Returns all the triples stored in the graph as an array.
     */
    triplesArray: function() {
        return this.triplesCache;
    },

    /*
     *  Private methods
     */

    /**
     *  Looks in the subject index of the triple hash.
     *
     *  @arguments:
     *  - aTriple: the triple to insert.
     *
     *  @returns:
     *  - a hash for the triples with the same predicate than the triple to store.
     */
    __addTripleBySubject: function(aTriple /* Siesta.Framework.Triple */) {
        var identifier = null;

        switch(aTriple.subject.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.subject);
            break;
        case 'blanknode':
            identifier = aTriple.subject.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.subject);
            break;
        }

        if(this.triples[identifier] == null) {
            this.triples[identifier] = {};
        }
        return this.triples[identifier];

    },

    /**
     *  Looks in the predicate index of the triple hash.
     *
     *  @arguments:
     *  - aTriple: the triple to insert.
     *  - predicates: a hash with the predicates for the triples with the same subject
     *
     *  @returns:
     *  - a hash for the triples with the same predicate than the triple to store.
     */
    __addTripleByPredicate: function(aTriple /* Siesta.Framework.Triple */,predicates) {
        var identifier = null;

        switch(aTriple.predicate.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.predicate);
            break;
        case 'blanknode':
            identifier = aTriple.predicate.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.predicate);
            break;
        }

        if(predicates[identifier] == null) {
            predicates[identifier] = {};
        }
        return predicates[identifier];

    },

    /**
     *  Looks in the object index of the triple hash.
     *
     *  @argument aTriple: the triple to insert.
     *  @argument objects: a hash with the objects for the triples with the same subject
     *
     *  @returns true if the triple is inserted, false if it was already inserted
     */
    __addTripleByObject: function(aTriple /* Siesta.Framework.Triple */,objects) {
        var identifier = null;

        switch(aTriple.object.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.object);
            break;
        case 'blanknode':
            identifier = aTriple.object.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.object);
            break;
        }

        if(objects[identifier] == null) {
            objects[identifier] = aTriple;
            return true;
        } else {
            return false;
        }

    },

    /**
     *  Generates a String key for this URI expanding the possible namespace
     *  of the URI if it is registered in the namespaces of the graph
     *
     *  @arguments aUri: a Siesta.Framework.Uri to be normalized.
     *
     *  @returns a String normalized for this URI.
     */
    __normalizeUri: function(aUri /* Siesta.Framework.Uri */) {
        if(aUri.namespace == null) {
            return aUri.value;
        } else {
            if(this.namespaces[aUri.namespace] != null) {
                return this.namespaces[aUri.namespace] + aUri.value;
            } else {
                return aUri.namespace + aUri.value;
            }
        }
    },

    /**
     *  Generates a String key for this literal expanding the possible type
     *  URI if its namespace is registered in the namespaces of the graph
     *
     *  @argument aLiteral: a Siesta.Framework.Literal to be normalized.
     *
     *  @returns a String normalized for this literal.
     */
    __normalizeLiteral: function(aLiteral /* Siesta.Framework.Literal */) {
        var str = '"'+aLiteral.value+'"';
        if(aLiteral.type != null) {
            str = str+"^^"+this.__normalizeUri(aLiteral.type);
        }
        if(aLiteral.language != null) {
            str = str+"@"+aLiteral.language;
        }

        return str;
    }


};

/**************************************************************************************************************/
/*                                              Model Layer                                                   */
/**************************************************************************************************************/

/**
  Capitalize function
*/
String.prototype.capitalize = function(){ //v1.0
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

// Namespaces
Siesta.registerNamespace("Siesta","Model");
Siesta.registerNamespace("Siesta","Model","Repositories");
Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
Siesta.Model.Repositories.data = new Siesta.Framework.Graph();


// Services
Siesta.registerNamespace("Siesta","Services");

// Services registration

/**
 Callback function for registering of services if AJAX used

 @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceAjax = function(serviceDescription) {

};

/**
 Callback function for registering of services if JSONP used

 @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceJsonp = function(serviceDescription) {
    try {
        var format = Siesta.Framework.Common.determineFormat(serviceDescription);
        var formater = null;

        if(format == "xml") {
            formater = Siesta.Formats.Xml;
        } else if(format == "turtle") {
            formater = Siesta.Formats.Turtle;
        }

        var parsedGraph = formater.parseDoc("",serviceDescription);
        for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
            Siesta.Model.Repositories.services.addTriple(parsedGraph.triplesArray()[_i]);
        }

        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            serviceRegistrationCallbacks[_f].call(Siesta.Constants.SUCCESS,parsedGraph);
        }
    } catch(e) {
        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            serviceRegistrationCallbacks[_f].call(Siesta.Constants.FAILURE,e);
        }
    }
};

/**
  Starts the registrations of a service.
  The user must provide the URL of the service and the network transport mechanism to retrieve
  the service: "ajax" or "jsonp" are valid transport mechanisms.
  If "jsonp" is chosen as the transport mechanism, and additional parameter is accepted with
  the value for the callback function parameter, if none is provided 'callback' will be used.


   @argument serviceUrl: URL of the service
   @argument networkTransport: transport mechanism, 'ajax' or 'jsonp' are valid
   @argument callback (optional): an optional third parameter with the name used for the callback parameter if jsonp is used as mechanim.
*/
Siesta.Services.registerService = function(serviceUrl, networkTransport /*, callback (optional)*/) {
    if(networkTransport == "jsonp") {
        var callbackParam = arguments[2] || "callback";
        Siesta.Network.jsonpRequest(serviceUrl,callbackParam, "Siesta.Services.onRegisteredServiceJsonp");
    } else if(networkTransport == "ajax"){
        throw new Error("not implemented yet");
    } else {
        throw new Error("uknown transport: "+networkTransport);
    }
};

Siesta.Services.serviceRegistrationCallbacks = [];
/**
  Registers a function that will be notified with success or failure after
  a service registration trial.

  @argument callback: the function to be notified, it must receive two arguments, a status and a value.
*/
Siesta.Services.addServiceRegistrationCallback = function(callback) {
    Siesta.Services.serviceRegistrationCallbacks.push(callback);
}

// Common
Siesta.registerNamespace("Siesta","Framework","Common");
/**
  Try to determine the format of the test passed as a parameter.

  @argument documentText: the text to be checked.

  @returns "turtle" or "xml"

  @throws Error if no format can be determined.
*/
Siesta.Framework.Common.determineFormat = function(documentText) {
    if(documentText.indexOf("<rdf:RDF") != -1 ||
       documentText.indexOf("<?xml") != -1 ) {
        return "xml";
    } else if(documentText.indexOf("@prefix") != -1 ||
              documentText.indexOf(".") != -1) {
        return "turtle";
    } else {
        throw new Error("Unknown format");
    }
};

Siesta.Services.RestfulOperationInputParameter = Class.create();
/**
  @class Siesta.Services.RestfulOperationInputParameter

  An input parameter for a hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperationInputParameter.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperationInputParameter object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument parameterUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
     */
    initialize: function(parameterUri) {
        this.uri = parameterUri;
        this.uriInQuery = this.uri;
        if(parameterUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(parameterUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._type = null;
        this._parameterName = null;
    },

    type: function() {
        if(this._type != null) {
            return this._type;
        } else {
            var query = "SELECT ?type WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?type } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the type for the input parameter "+this.uri);
            } else {
                this._type = result[0].type.value
            }
            return this._type;
        }
    },

    parameterName: function() {
        if(this._parameterName != null) {
            return this._parameterName;
        } else {
            var query = "SELECT ?name WHERE {  " + this.uriInQuery + " <http://www.wsmo.org/ns/hrests#parameterName> " + "?name } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the parameterName for the input parameter "+this.uri);
            } else {
                this._parameterName = result[0].name.value
            }
            return this._parameterName;
        }
    }
};

Siesta.Services.RestfulOperationInputMessage = Class.create();
/**
  @class Siesta.Services.RestfulOperationInputMessage

  An input message for a hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperationInputMessage.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperationInputMessage object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument messageUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
     */
    initialize: function(messageUri) {
        this.uri = messageUri;
        this.uriInQuery = this.uri;
        if(messageUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(messageUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._modelReference = null;
        this._loweringSchemaMapping = null;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
//            var query = "SELECT ?id ?model WHERE {  ?id "+ "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
//            query = query + "?id <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var query = "SELECT ?model WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the modelReference for the input message "+this.uri);
            } else {
/*
                var found = false;
                for(_i=0; _i<result.length; _i++) {
                    if(result[_i].id.toString() == this.uriInQuery) {
                        found = true;
                        this._modelReference = result[0].model.value;
                        break;
                    }
                }
                if(!found) {
                    throw new Error("Error retrieving the modelReference for the input message "+this.uri);
                }
*/
                this._modelReference = result[0].model.value
            }
            return this._modelReference;
        }
    },

    loweringSchemaMapping: function() {
        if(this._loweringSchemaMapping != null) {
            return this._loweringSchemaMapping;
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#loweringSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the loweringSchemaMapping for the input message "+this.uri);
            } else {
                this._loweringSchemaMapping = result[0].schema.value
            }
            return this._loweringSchemaMapping;
        }
    }
};

Siesta.Services.RestfulOperationOutputMessage = Class.create();
/**
  @class Siesta.Services.RestfulOperationOutputMessage

  An input message for a hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperationOutputMessage.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperationOutputMessage object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument messageUri: input message URI (blank node identifier), a Siesta.Framework.Uri object, a Siesta.Framework.BlankNode or a String
     */
    initialize: function(messageUri) {
        this.uri = messageUri;
        this.uriInQuery = this.uri;
        if(messageUri.__type == 'uri') {
            this.uri = uri.toString();
            this.uriInQuery = "<"+this.uri+">";
        } else if(messageUri.__type == 'blanknode') {
            this.uri = uri.toString();
            this.uriInQuery = this.uri;
        }

        this._modelReference = null;
        this._liftingSchemaMapping = null;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
//            var query = "SELECT ?id ?model WHERE {  ?id "+ "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
//            query = query + "?id <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var query = "SELECT ?model WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#modelReference> ?model }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the modelReference for the input message "+this.uri);
            } else {
/*
                var found = false;
                for(_i=0; _i<result.length; _i++) {
                    if(result[_i].id.toString() == this.uriInQuery) {
                        found = true;
                        this._modelReference = result[0].model.value;
                        break;
                    }
                }
                if(!found) {
                    throw new Error("Error retrieving the modelReference for the input message "+this.uri);
                }
*/
                this._modelReference = result[0].model.value
            }
            return this._modelReference;
        }
    },

    /**
      Retrieves the liftinSchemaMapping for this message.

      @returns the URL of the schema mapping
    */
    liftingSchemaMapping: function() {
        if(this._liftingSchemaMapping != null) {
            return this._liftingSchemaMapping;
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#liftingSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                 this._liftingSchemaMapping = null;
            } else {
                this._liftingSchemaMapping = result[0].schema.value
            }
            return this._liftingSchemaMapping;
        }
    }
};

Siesta.Services.RestfulOperation = Class.create();
/**
  @class Siesta.Services.RestfulOperation

  A hRESTS operation of a hRESTS service.
*/
Siesta.Services.RestfulOperation.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulOperation object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument operationUri: operation location URI, a Siesta.Framework.Uri object or a String
     */
    initialize: function(operationUri) {
        this.uri = operationUri;
        if(operationUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._label = null;
        this._method = null;
        this._address = null;
        this._inputMessages = null;
        this._inputParameters = null;
        this._outputMessage = null;
    },

    label: function() {
        if(this._label != null) {
            return this._label;
        } else {
            var query = "SELECT ?text WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Operation> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/2000/01/rdf-schema#label> ?text }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                this._label = "";
            } else {
                this._label = result[0].text.value;
            }
            return this._label;
        }
    },

    method: function() {
        if(this._method != null) {
            return this._method;
        } else {
            var query = "SELECT ?method WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasMethod> " + "?method } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the method associated to the operation "+this.uri);
            } else {
                this._method = result[0].method.value;
                return this._method;
            }
        }
    },

    address: function() {
        if(this._address != null) {
            return this._address;
        } else {
            var query = "SELECT ?address WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasAddress> " + "?address } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the address associated to the operation "+this.uri);
            } else {
                this._address = result[0].address.value;
                return this._address;
            }
        }
    },

    /**
      Returns an array of RestfulOperationInputMessages object with all the
      input messages associated to this operation.

      @returns An array of RestulOperationInputMessages objects
    */
    inputMessages: function() {
        if(this._inputMessages != null) {
            return this._inputMessages;
        } else {
            var query = "SELECT ?message WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasInputMessage> " + "?message } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            this._inputMessages = [];

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationInputMessage(result[_i].message.toString());
                this._inputMessages.push(msg);
            }

            return this._inputMessages;
        }
    },


    /**
      Returns the RestfulOperationOutputMessage object associated
      to this operation.

      @returns A RestulOperationOutputMessage objects or null if no output message is associated.
    */
    outputMessage: function() {
        if(this._outputMessage != null) {
            return this._outputMessage;
        } else {
            var query = "SELECT ?message WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasOutputMessage> " + "?message } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationOutputMessage(result[_i].message.toString());
                this._outputMessage = msg;
            }

            return this._outputMessage;
        }
    },


    /**
      Returns an array of RestfulOperationInputParameter object with all the
      input messages associated to this operation.

      @returns An array of RestulOperationInputMessages objects
    */
    inputParameters: function() {
        if(this._inputParameters != null) {
            return this._inputParameters;
        } else {
            var query = "SELECT ?parameter WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasInputParameter> " + "?parameter } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            this._inputParameters = [];

            for(_i=0; _i<result.length; _i++) {
                var msg = new Siesta.Services.RestfulOperationInputParameter(result[_i].parameter.toString());
                this._inputParameters.push(msg);
            }

            return this._inputParameters;
        }
    }
};

Siesta.Services.RestfulService = Class.create();
/**
  @class Siesta.Services.RestfulService

  A Semantic Restful hRESTS service.
*/
Siesta.Services.RestfulService.prototype = {
    /**
     * @constructor
     *
     * Initiates a new RestfulService object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.services repository,
     * they must have been retrieved first via a callo to Siesta.Services.registerService.
     *
     * @see Siesta.Services.registerService
     *
     * @argument serviceuri: Service location URI, a Siesta.Framework.Uri object or a String
     */
    initialize: function(serviceUri ) {
        this.uri = serviceUri;
        if(serviceUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._operations = null;
        this._operationsUris = null;

        this._modelReference = null;
        this._connected = false;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?reference WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/ns/sawsdl#modelReference> ?reference }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving sawsdl#modelReference for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._modelReference = result[0].reference.value;
                return this._modelReference;
            }
        }
    },

    isDefinedBy: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?defined WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/2000/01/rdf-schema#isDefinedBy> ?defined }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving rdfs#isDefinedBy for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._modelReference = result[0].defined.value;
                return this._modelReference;
            }
        }
    },

    operationsUris: function() {
        if(this._operationsUris != null) {
            return this._operationsUris;
        } else {
            this._operationsUris = [];

            var query = "SELECT ?operation WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/wsmo-lite#hasOperation> " + "?operation } ";


            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            for(_i=0; _i<result.length; _i++) {
                this._operationsUris.push(result[_i].operation.value);
            }
            return this._operationsUris;
        }
    },

    operations: function() {
        if(this._operations != null) {
            return this._operations;
        } else {
            this._operations = [];
            var opsUris = this.operationsUris();

            for(_i=0; _i<opsUris.length; _i++) {
                var opName = opsUris[_i];
                this._operations.push(new Siesta.Services.RestfulOperation(opName));
            }

            return this._operations;
        }
    },

    /**
      Retrieves all the external resources for this service: model, lowering and lifting operations, etc.

      @returns nothing
    */
    connect: function() {
        // we retrieve the model reference if not already present
        var query = "SELECT ?reference WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?object } ";
        var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);
        if(result.length == 0) {
            // El modelo no est
        }
    }
};

Siesta.Model.Schema = Class.create();
/**
  @class Siesta.Model.Schema

  A RDF model schema.
*/
Siesta.Model.Schema.prototype = {
    /**
     * @constructor
     *
     * Initiates a new model schema object with the
     * the data associated to the URI passed as an
     * argument in the constructor.
     *
     * Triplets are looked up in the Siesta.Model.Repositories.schemas repository,
     * they must have been retrieved before initating the schema object.
     *
     * @argument serviceuri: Schema URI: a Siesta.Framework.Uri object or a String
     */
    initialize: function(schemaUri ) {
        this.uri = schemaUri;
        if(schemaUri.__type == 'uri') {
            this.uri = uri.toString();
        }

        this._type = null;
        this._properties = null;
    },

    /**
      Retrieves the type of this model schema.

      @returns The URI of the type associated to this schema model
    */
    type: function() {
        if(this._type != null) {
            return this._type;
        } else {
            var query = "SELECT ?type WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "?type }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);

            if(result.length != 1) {
                throw new Error("Error retrieving rdfs#type for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
            } else {
                this._type = result[0].type.value;
                return this._type;
            }
        }
    },

    /**
      Retrieves all the properties associated to this schema URI by a rdfs:domain predicate.

      @returns A hash of URIs -> range for the properties of the model schema.
    */
    properties: function() {
        if(this._properties != null) {
            return this._properties;
        } else {
            var query = "SELECT ?prop ?range WHERE { ?prop  <http://www.w3.org/2000/01/rdf-schema#domain> <"+ this.uri +"> . ?prop <http://www.w3.org/2000/01/rdf-schema#range> ?range}";
            var result = Siesta.Sparql.query(Siesta.Model.Repositories.schemas,query);

            this._properties = [];

            for(_i=0; _i<result.length; _i++) {
                var prop = {};
                prop['uri'] = result[_i].prop.value;
                prop['range'] = result[_i].range.value;

                this._properties.push(prop);
            }
            return this._properties;
        }
    }
};
/**************************************************************************************************************/
/*                            Framework configuration and initalization                                       */
/**************************************************************************************************************/
Siesta.registerNamespace("Siesta","Sparql");
Siesta.registerNamespace("Siesta","Formats","Turtle");
Siesta.registerNamespace("Siesta","Formats","Xml");

Siesta.defineConfiguration = function(theConfiguration) {
    Siesta.Configuration = theConfiguration;
    Siesta.loadFrameworks();
}

Siesta.loadConfiguration = function(basePath) {
   /**
     Returns the current URL till the last '/' (not included) in th URL:
     - http://test.com/scripts/my_script.js -> http://test.com/scripts
   */
    Siesta.basePath = function() {
        //        return location.href.split("/").slice(0,-1).join("/");
        return basePath;
    };

    Siesta.load(Siesta.basePath(),"configuration.js");
};

// Loading of the frameworks
Siesta.loadFrameworks = function() {
    // We check if prototype is not loaded we load microtype
    var isPrototypeLoaded = false;

    Siesta.remainingFrameworks = {};
    Siesta.remainingFrameworks["sparql"] = true;
    Siesta.remainingFrameworks["formats/turtle"] = true;
    Siesta.remainingFrameworks["formats/xml"] = true;
    Siesta.remainingFrameworks["network"] = true;

    // Loading of the frameworks
    if(Siesta.Configuration.drivers != null) {
        for(_i=0; _i< Siesta.Configuration.drivers.length; _i++) {
            if(Siesta.Configuration.drivers[_i]!="prototype") {
                var path = "libs/drivers/"+Siesta.Configuration.drivers[_i]+"/load.js";
                Siesta.loadFromBase(path);
            }
        }
    }

    // Loading the components

    // sparql queries
    Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.sparql+"/sparql/query.js");
    // formats
    Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.turtle+"/formats/turtle.js"); //turtle
    Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.xml+"/formats/xml.js"); //xml
    // networking
    Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.network+"/network.js"); //xml

};

Siesta.WhenInitiatedScripts = [];

Siesta.onFrameworkInitiated = function(f) {
    Siesta.WhenInitiatedScripts.push(f);
};

Siesta.registerFramework = function(key) {
    Siesta.remainingFrameworks[key] = false;

    var notReady = false;

    notReady = notReady || Siesta.remainingFrameworks["sparql"];
    notReady = notReady || Siesta.remainingFrameworks["formats/turtle"];
    notReady = notReady || Siesta.remainingFrameworks["formats/xml"];
    notReady = notReady || Siesta.remainingFrameworks["network"];

    if(key == "sparql") {
        Siesta.Sparql = eval("Siesta.Drivers."+Siesta.Configuration.sparql.capitalize()+".Sparql");
    } else if(key == "formats/turtle") {
        Siesta.Formats.Turtle = eval("Siesta.Drivers."+Siesta.Configuration.formats.turtle.capitalize()+".Formats.Turtle");
    } else if(key == "formats/xml") {
        Siesta.Formats.Xml = eval("Siesta.Drivers."+Siesta.Configuration.formats.xml.capitalize()+".Formats.Xml");
    } else if(key == "network") {
        Siesta.Network = eval("Siesta.Drivers."+Siesta.Configuration.network.capitalize()+".Network");
    }

    if(!notReady) {
        for(_i=0; _i< Siesta.WhenInitiatedScripts.length; _i++) {
            Siesta.WhenInitiatedScripts[_i].call();
        }
    }
}
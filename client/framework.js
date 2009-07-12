/**
  main namespace for the library
*/
var Siesta = {};

/**
  By default the framework is not packaged.
  This setting will be overriden by sprockets 
  when requiring the next script
*/
Siesta.isPackaged = false;
//= require "packagedConfiguration"

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
        var thePath = "/";
        try{
            var thePath = Siesta.basePath();
        }catch(e) {}
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
// CUIDADO CON PROTOTYPE Y ESTE METODO!!!
/*
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
*/

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
                throw "Non existant path";
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

        // blank node counter
        this.blankNodeCounter = 0;

        // should I recreate blank node identifier?
        this.respectBlankNodeCounter = false;

        // a mapping use when computing the union of two graphs
        this.__blankNodeMap = {};
        // a native representation for this graph
        // cached in the siesta graph.
        //this.native = null;
    },
    
    /**
     *  Resets the mapping of blank nodes
     */
    resetBlankNodeMapping: function() {
        this.__blankNodeMap = {};
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
     *  Computes the union between graphs respecting blank node
     *  identifiers in both graphs.
     *
     *  @arguments
     *  - aGraph: the graph to compute the union with.
     */
    mergeGraph: function(aGraph /* Siesta.Framework.Graph */) {
        for(ns in aGraph.namespaces) {
            this.addNamespace(ns);
        }

        var triplesToMerge = aGraph.triplesArray();
        for(var _i=0; _i<triplesToMerge.length; _i++) {
            this.mergeTriple(triplesToMerge[_i]);
        }
    },

    /**
     *  Computes the union between graphs without respecting blank node
     *  identifiers in the graph to add.
     *
     *  @arguments
     *  - aGraph: the graph to compute the union with.
     */
    addGraph: function(aGraph /* Siesta.Framework.Graph */) {
        this.__blankNodeMap = {};
        for(ns in aGraph.namespaces) {
            this.addNamespace(ns);
        }

        var triplesToAdd = aGraph.triplesArray();
        for(var _i=0; _i<triplesToAdd.length; _i++) {
            this.addTriple(triplesToMerge[_i]);
        }
    },

    /**
     *  Computes the difference between graphs.
     *
     *  @arguments
     *  - aGraph: the graph to compute the difference with.
     */
    removeGraph: function(aGraph /* Siesta.Framework.Graph */) {
        var triplesToRemove = aGraph.triplesArray();
        for(var _i=0; _i<triplesToRemove.length; _i++) {
            this.removeTriple(triplesToRemove[_i]);
        }
    },

    /**
     *  Adds one triple to the index.
     *  If one blank node identifier is found, it will be overwritten with a new one.
     *
     *  @arguments
     *  - aTriple: the triple to be added.
     */
    addTriple: function(aTriple /* Siesta.Framework.Triple */) {
        this.respectBlankNodeCounter = false;
        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
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
     *  Merges one triple into the index.
     *  If one blank node identifier is found, it will be respected.
     *
     *  @arguments
     *  - aTriple: the triple to be added.
     */
    mergeTriple: function(aTriple /* Siesta.Framework.Triple */) {
        this.respectBlankNodeCounter = true;
        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
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
     *  Remove one triple from the index.
     *
     *  @arguments
     *  - aTriple: the triple to be removed.
     */
    removeTriple: function(aTriple /* Siesta.Framework.Triple */) {
        this.respectBlankNodeCounter = false;
        if(aTriple.__type != 'triple') {
            throw "Trying to add something different of a Siesta.Framework.Triple to a Siesta.Framework.Graph";
        } else {

            var wasRemoved = this.__removeTripleByObject(aTriple,
                this.__removeTripleByPredicate(aTriple,
                this.__removeTripleBySubject(aTriple)));
            if(wasRemoved == true) {
                var newTriplesCache = [];
                for(var _i=0; _i<this.triplesCache.length; _i++) {
                    var _theTriple = this.triplesCache[_i];
                    if(_theTriple.subject.value != aTriple.subject.value ||
                       _theTriple.predicate.value != aTriple.predicate.value ||
                       _theTriple.object.value != aTriple.object.value) {
                        newTriplesCache.push(_theTriple);
                    }
                }
                this.triplesCache = newTriplesCache;
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
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.subject.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.subject.value = identifier;
                    this.__blankNodeMap[aTriple.subject.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
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
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.predicate.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.predicate.value = identifier;
                    this.__blankNodeMap[aTriple.predicate.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
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
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.object.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.object.value = identifier;
                    this.__blankNodeMap[aTriple.object.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
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
     *  Looks in the subject index of the triple hash.
     *
     *  @arguments:
     *  - aTriple: the triple to insert.
     *
     *  @returns:
     *  - a hash for the triples with the same predicate than the triple to store.
     */
    __removeTripleBySubject: function(aTriple /* Siesta.Framework.Triple */) {
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
            return [identifier, {}];
        } else {
            return [identifier, this.triples[identifier]]
        }

    },

    /**
     *  Looks in the predicate index of the triple hash.
     *
     *  @arguments:
     *  - aTriple: the triple to insert.
     *  - an array of
     *     - the identifier of the subject
     *     - predicates: a hash with the predicates for the triples with the same subject
     *
     *  @returns:
     *  - a hash for the triples with the same predicate than the triple to store.
     */
    __removeTripleByPredicate: function(aTriple /* Siesta.Framework.Triple */,tmp) {
        var identifier = null;

        switch(aTriple.predicate.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.predicate);
            break;
        case 'blanknode':
            identifier = aTriple.subject.value;
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.predicate);
            break;
        }
        
        var subjectIdentifier = tmp[0];
        var predicates = tmp[1];
        if(predicates[identifier] == null) {
            return [subjectIdentifier, identifier, {}];
        }
        return [subjectIdentifier, identifier, predicates[identifier]];

    },

    /**
     *  Looks in the object index of the triple hash.
     *
     *  @argument aTriple: the triple to insert.
     *  @argument tmp: an array wit subject identifier, preidcate identifier and a hash with the objects for the triples with the same subject
     *
     *  @returns true if the triple is inserted, false if it was already inserted
     */
    __removeTripleByObject: function(aTriple /* Siesta.Framework.Triple */,tmp) {
        var identifier = null;

        switch(aTriple.object.__type) {
        case 'uri':
            identifier = this.__normalizeUri(aTriple.object);
            break;
        case 'blanknode':
            if(this.respectBlankNodeCounter) {
                identifier = aTriple.subject.value;
            } else {
                var identifierInGraph = this.__blankNodeMap[aTriple.object.value]
                if(identifierInGraph == undefined) {
                    identifier = ''+this.blankNodeCounter++;
                    aTriple.object.value = identifier;
                    this.__blankNodeMap[aTriple.object.value] = identifier;
                } else {
                    identifier = identifierInGraph;
                }
            }
            break;
        case 'literal':
            identifier = this.__normalizeLiteral(aTriple.object);
            break;
        }

        var subjectId = tmp[0];
        var predicateId = tmp[1];
        var objects = tmp[2];

        if(objects[identifier] != null) {
            var theTriple = objects[identifier];
            var newObjects = {};
            var newObjsCounter = 0;
            for(var _id in objects) {
                if(_id != identifier) {
                    newObjsCounter++;
                    newObjects[_id] = objects[_id];
                }
            }
            if(newObjsCounter != 0) {
                this.triples[subjectId][predicateId] = newObjects;
            } else {
                var newPreds = {};
                var newPredsCounter = 0;
                for(var _id in this.triples[subjectId]) {

                    if(_id != predicateId) {
                        newPredsCounter++;
                        newPreds[_id] = this.triples[subjectId][_id];
                    }
                }
                if(newPredsCounter != 0) {
                    this.triples[subjectId] = newPreds;
                } else {
                    var newSubjs = {};
                    for(var _id in this.triples) {
                        if(_id != subjectId)
                        {
                            newSubjs[_id] = this.triples[_id];                               
                        }
                    }
                    this.triples = newSubjs;
                }            
            }
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
/*                                              Utils                                                         */
/**************************************************************************************************************/

Siesta.registerNamespace("Siesta","Utils");

Siesta.Utils.htmlParser = function(doc) {
    // iFrame way???
//     $(function() {
//         $.ajax({
//             type: 'GET', 
//             url: 'result.html',
//             dataType: 'html',
//             success: function(data) {
//                 var $frame = $("<iframe src='about:blank'/>").hide();
//                 $frame.appendTo('body');
//                 var doc = $frame.get(0).contentWindow.document;
//                 doc.write(data);
//                 var $title = $("title", doc);
//                 alert('Title: '+$title.text() );
//                 $frame.remove();
//             }
//         });


    //cross platform xml object creation from w3schools
    try //Internet Explorer
    {
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(doc);
        return xmlDoc;
    }
    catch(e)
    {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(doc,"text/xml");
        return xmlDoc;
    }
}

Siesta.Utils.Sequentializer = Class.create();
/**
  @class Siesta.Utils.Network.SequentialRemoteRequester

  Helper class for easing the creation of sequential asynchronous calls.
*/
Siesta.Utils.Sequentializer.prototype = {
    /**
     * @constructor
     *
     * Builds a new requester.
     */
    initialize: function() {
        this._requestsQueue = [];
        this._finishedCallback = null;
    },

    /**
     * Adds a remote request to the queue of requests.
     *
     * @argument remoteRequest, function containing the invocation
     */
    addRemoteRequest: function(remoteRequest) {
        this._requestsQueue.push(remoteRequest);
    },

    /**
     * Adds a remote request to the queue of requests and passes the argument to it.
     * The callback function must accept one parameter.
     *
     * @argument remoteRequest, function containing the invocation.
     * @argument env, the environment to pass to the function.
     */
    addRemoteRequestWithEnv: function(remoteRequest,env) {
        this._requestsQueue.push(function(){ remoteRequest(env) });
    },

    /**
     * Sets the function that will be optionally invoked
     * when all the requests have been processed.
     *
     * @argument callback, the function to be invoked.
     */
    finishedCallback: function(callback) {
        this._finishedCallback = callback;
    },

    /**
     * This funcition must be invoked in the callbacks of the remote requests
     * callbacks to notify the request has finished.
     */
    notifyRequestFinished: function() {
        this._nextRequest();
    },

    /**
     * Starts the processing of the requests.
     */
    start: function() {
        this._nextRequest();
    },

    _nextRequest: function() {
        if(this._requestsQueue.length == 0) {
            this._finishedCallback();
        } else {
            (this._requestsQueue.pop())();
        }
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

Siesta.Services.chooseFormaterFor = function(document) {
    var format = Siesta.Framework.Common.determineFormat(document);
    var formater = null;

    if(format == "xml") {
        formater = Siesta.Formats.Xml;
    } else if(format == "turtle") {
        formater = Siesta.Formats.Turtle;
    } else if(format == 'rdfa') {
        formater = Siesta.Formats.Rdfa;
    }

    return formater;
};

Siesta.Services.TRIPLET_CHANGE_EVENT = "TRIPLET_CHANGE_EVENT";

/**
  Parses a new doc and add the parsed triplets to the provided repository.

  @argument doc, to be parsed in a valid format: N3, XML, JSON...
  @argument repository, the repository where the triplets will be added.

  @returns throw a Siesta.Services.TRIPLET_CHANGE_EVENT with an object message including the repository \
where the triplets have been added an the graph from the document.
 */
Siesta.Services.parseAndAddToRepository = function(doc,repository) {
    var  formater = Siesta.Services.chooseFormaterFor(doc);

    if(formater.isParserAsynchronous() == false) {
        var parsedGraph = formater.parseDoc("",doc);
        for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
            repository.addTriple(parsedGraph.triplesArray()[_i]);
        }

        var resp = {
            repository: repository,
            parsedGraph: parsedGraph
        };

        Siesta.Events.publish(Siesta.Services.TRIPLET_CHANGE_EVENT,resp);
    } else {
        formater.parseDoc("",doc, function(resBaseUri, resDoc, parsedGraph) {
            for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
                repository.addTriple(parsedGraph.triplesArray()[_i]);
            }

            var resp = {
                repository: repository,
                parsedGraph: parsedGraph
            };

            Siesta.Events.publish(Siesta.Services.TRIPLET_CHANGE_EVENT,resp);
        });
    }
};

/**
 Callback function for registering of services if JSONP used

 @argumet serviceDescription: the text with the description of the service in any format.
*/
Siesta.Services.onRegisteredServiceJsonp = function(serviceDescription) {
    try {
        var formater = Siesta.Services.chooseFormaterFor(serviceDescription);

        var parsedGraph = formater.parseDoc("",serviceDescription);
        for(_i=0; _i< parsedGraph.triplesArray().length; _i++) {
            Siesta.Model.Repositories.services.addTriple(parsedGraph.triplesArray()[_i]);
        }

        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            Siesta.Services.serviceRegistrationCallbacks[_f].call(Siesta.Constants.SUCCESS,parsedGraph);
        }
    } catch(e) {
        for(_f=0; _f<Siesta.Services.serviceRegistrationCallbacks.length; _f++) {
            Siesta.Services.serviceRegistrationCallbacks[_f].call(Siesta.Constants.FAILURE,e);
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
    } else if(documentText.indexOf("<html") != -1 ||
              documentText.indexOf("<body") != -1 ||
              documentText.indexOf("<head") != -1 ||
              documentText.indexOf("<div") != -1 ||
              documentText.indexOf("<span") != -1 ||
              documentText.indexOf("<a") != -1 ){
        return "rdfa";
    } else if(documentText.indexOf("@prefix") != -1 ||
              documentText.indexOf(".") != -1) {
        return "turtle";
    } else  {
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
        this.loweringSchemaMappingContent = null;
        this.connected = false;
        this._model = null;
        this_transportMechanism = null;
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
    },

    model: function() {
        if(this._model != null) {
            return this._model;
        } else {
            // we retrieve the model reference if not already present
            if(this.modelReference() != null) {
                this._model = new Siesta.Model.Schema(this.modelReference());
            }
        }
    },

    /**
       Retrieves all the remote references of this message.

       @returns The method sends the event: EVENT_MESSAGE_LOADED
    */
    connect: function(mechanism) {
        this._transportMechanism = mechanism;
        if(this.connected == false) {
            if(this.model() == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.modelReference(),callback,function(resp){
                            Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
                            that.model();

                            that._retrieveLoweringSchemaMapping(that._transportMechanism);
                        });
                    } else {

                    }
                } catch(e) { _retrieveLoweringSchemaMapping(mechanism); }
            } else {
                _retrieveLoweringSchemaMapping(mechanism);
            }
        }
    },

    // Events

    EVENT_MESSAGE_LOADED: "EVENT_MESSAGE_LOADED",

    // Connection callbacks

    _retrieveLoweringSchemaMapping: function(mechanism) {
        if(this.connected == false) {
            this.connected = true;
            if(this.loweringSchemaMappingContent == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.loweringSchemaMapping(),callback,function(res){
                            that.loweringSchemaMappingContent = res;
                            Siesta.Events.publish(that.EVENT_MESSAGE_LOADED,that);
                        });
                    } else {

                    }
                } catch(e) {  Siesta.Events.publish(this.EVENT_MESSAGE_LOADED,this); }
            }
        } else {
            Siesta.Events.publish(this.EVENT_MESSAGE_LOADED,this);
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
        this.liftingSchemaMappingContent = null;
        this.connected = false;
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
            if(this._liftingSchemaMapping == 0) {
                return null;
            } else {
                return this._liftingSchemaMapping;
            }
        } else {
            var query = "SELECT ?schema WHERE {  " + this.uriInQuery + " <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> . ";
            query = query + this.uriInQuery +" <http://www.w3.org/ns/sawsdl#liftingSchemaMapping> ?schema }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                 this._liftingSchemaMapping = 0; // this is to avoid continously quering the repository in case of no liftingSchema
            } else {
                this._liftingSchemaMapping = result[0].schema.value
            }
            return this._liftingSchemaMapping;
        }
    },

    // Events

    EVENT_CONNECTED: "EVENT_OUTPUT_MESSAGE_CONNECTED",

    // Connection callbacks

    connect: function(mechanism) {
        if(this.connected == false) {
            this.connected = true;
            if(this.liftingSchemaMappingContent == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        var that = this;
                        Siesta.Network.jsonpRequestForFunction(this.liftingSchemaMapping(),callback,function(res){
                            that.liftingSchemaMappingContent = res;
                            Siesta.Events.publish(that.EVENT_CONNECTED,that);
                        });
                    } else {
                        // TODO AJAX here.
                    }
                } catch(e) {  Siesta.Events.publish(this.EVENT_CONNECTED,this); }
            }
        } else {
            Siesta.Events.publish(this.EVENT_CONNECTED,this);
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
        this.connected = false;
        this._addressAttributes = null;
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
            return this._method.toUpperCase();
        } else {
            var query = "SELECT ?method WHERE { <"+this.uri+"> " + "<http://www.wsmo.org/ns/hrests#hasMethod> " + "?method } ";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                throw new Error("Error retrieving the method associated to the operation "+this.uri);
            } else {
                this._method = result[0].method.value;
                return this._method.toUpperCase();
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

    _parsingAddressPatterRegExOut: /\{[\w%]+\}/g,

    _parsingAddressPatternRegExIn: /[^\{\}]+/,

    /**
      Parses the address of the operation retrieving the list of prameters
      from the address.

      @returns the list of parsed parameters
    */
    addressAttributes: function() {
        var theAddress = this.address();
        if(this._addressAttributes == null) {
            this._addressAttributes = [];

            var finished = false;
            while(!finished) {
                var attribute = this._parsingAddressPatterRegExOut.exec(theAddress);
                if(attribute != null) {
                    this._addressAttributes.push(this._parsingAddressPatternRegExIn.exec(attribute)[0]);
                } else {
                    finished = true;
                }
            }
        }
        return this._addressAttributes;
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
    },

    connect: function(mechanism) {
        var that = this;
        if(that.connected == false) {
            var sequentializer = new Siesta.Utils.Sequentializer();
            
            this.method();
            this.address();
            this.label();

            // let's add the closures for the requests
            for(var _i=0; _i<that.inputMessages().length; _i++) {
                sequentializer.addRemoteRequestWithEnv(function(message){
                    var subscription = Siesta.Events.subscribe(message.EVENT_MESSAGE_LOADED,function(event,msg,myData) {
                        if(myData == message) {
                            Siesta.Events.unsubscribe(subscription);
                            sequentializer.notifyRequestFinished();
                        }
                    }, that,message);
                    message.connect(mechanism);
                },that.inputMessages()[_i]);
            }

            // let's add the output message
            var outputMessage = this.outputMessage();
            if(outputMessage != null) {
                sequentializer.addRemoteRequest(function(){
                    var subscription = Siesta.Events.subscribe(outputMessage.EVENT_CONNECTED,function(event,msg,myData) {
                        if(outputMessage == myData) {
                            Siesta.Events.unsubscribe(subscription);
                            sequentializer.notifyRequestFinished();
                        }
                    },that,outputMessage);
                    outputMessage.connect(mechanism);
                });            
            }

            // here we set the callback for all requests done
            sequentializer.finishedCallback(function() {
                
                that.connected = true;
                Siesta.Events.publish(that.EVENT_CONNECTED,that);
            });

            // the fun starts here
            sequentializer.start();
        }
    },

    consume: function(mechanism,graph) {
        if(this.connected == false) {
            throw "Unable to consume a disconnected service";
        }

        var loweredParametersMap = {};
        var inputMsgs = this.inputMessages();
        for(var _i=0; _i<inputMsgs.length; _i++) {
            var inputMsg = inputMsgs[_i];
            var result = Siesta.Sparql.query(graph,inputMsg.loweringSchemaMappingContent);
            for(var v in result[0]) {
                if((typeof result[0][v]) == "object") {
                    loweredParametersMap[v] = result[0][v];
                }
            }
        }
        var theAddress = this.address();
        for(var _i=0; _i<this.addressAttributes().length; _i++) {
            var theAttr = this.addressAttributes()[_i];
            var theAttrInAddress = "{"+ theAttr +"}";
            
            theAddress = theAddress.replace(theAttrInAddress,encodeURIComponent(loweredParametersMap[theAttr].value));
        }

        if(mechanism == "jsonp") {
            var that = this;
            if(theAddress.indexOf("?") != -1) {
                theAddress = theAddress + "&_method=" + this.method().toLowerCase();
            } else {
                theAddress = theAddress + "?_method=" + this.method().toLowerCase();
            }
            Siesta.Network.jsonpRequestForFunction(theAddress,"callback",function(resp) {
                if(that.method() == 'GET' || that.method() == 'POST') {
                    Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.data);
                    Siesta.Events.publish(that.EVENT_CONSUMED,that);
                } else if(that.method() == 'DELETE') {
                    Siesta.Model.Repositories.data.removeGraph(graph);
                    Siesta.Events.publish(that.EVENT_CONSUMED,that);
                } else if(that.method() == 'PUT') {
                    Siesta.Model.Repositories.data.removeGraph(graph);                    
                    Siesta.Model.parseAndAddToRepository(resp,Siesta.Model.Repositories.data);
                    Siesta.Events.publish(that.EVENT_CONSUMED,that);
                }
            });
        } else {
            // AJAX here
        }
    },

    // Events

    EVENT_CONNECTED: "EVENT_OPERATION_CONNECTED",

    EVENT_CONSUMED: "CONSUMED_OPERATON_EVENT"
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
        this.connected = false;
        this._model = null;
    },

    modelReference: function() {
        if(this._modelReference != null) {
            return this._modelReference;
        } else {
            var query = "SELECT ?reference WHERE { <"+this.uri+"> " + "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Service> . ";
            query = query + "<"+this.uri+"> <http://www.w3.org/ns/sawsdl#modelReference> ?reference }";

            var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

            if(result.length != 1) {
                //throw new Error("Error retrieving sawsdl#modelReference for <"+this.uri+"> uri. Found "+result.length+" results instead of 1");
                this._modelReference = null;
            } else {
                this._modelReference = result[0].reference.value;
            }
            return this._modelReference;
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

            for(var _i=0; _i<result.length; _i++) {
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

    model: function() {
        if(this._model != null) {
            return this._model;
        } else {
            // we retrieve the model reference if not already present
            if(this.modelReference() != null) {
                this._model = new Siesta.Model.Schema(this.modelReference());
            }
        }
    },

    /**
      Retrieves all the external resources for this service: model, lowering and lifting operations, etc.

      @returns nothing
    */
    connect: function(mechanism) {
        if(this.connected == false) {
            
            var that = this;
            var sequentializer = new Siesta.Utils.Sequentializer();
            
            if(this.model() == null) {
                try {
                    if(mechanism == "jsonp") {
                        var callback = "callback";
                        if(arguments.length == 2) {
                            callback = arguments[1];
                        }
                        sequentializer.addRemoteRequest(function(){
                            Siesta.Network.jsonpRequestForFunction(that.modelReference(),callback,function(resp){
                                
                                Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
                                that.model();
                                sequentializer.notifyRequestFinished();
                            });
                        });                        
                    } else {

                    }
                } catch(e) { }
            } 

            for(var _i=0; _i<this.operations().length; _i++){
                
                /*
                var f = (function (theOperation) { return function () { 
                    Siesta.Events.addListener(theOperation,theOperation.EVENT_CONNECTED,that,function(event,op) {
                        
                        Siesta.Events.removeListener(theOperation,theOperation.EVENT_CONNECTED,that);                        
                        sequentializer.notifyRequestFinished();                        
                    });
                    theOperation.connect(mechanism);
                }})(this.operations()[_i]);
                sequentializer.addRemoteRequest(f);                
                */
                sequentializer.addRemoteRequestWithEnv(function(theOperation) {
                    
                    var subscription = Siesta.Events.subscribe(theOperation.EVENT_CONNECTED,function(event,op,myData) {
                        if(theOperation == myData) {
                            Siesta.Events.unsubscribe(subscription);
                            sequentializer.notifyRequestFinished();                        
                        }
                    },that,theOperation);
                    theOperation.connect(mechanism);
                }, this.operations()[_i]);
            }

            // here we set the callback for all requests done
            sequentializer.finishedCallback(function() {
                that.connected = true;
                Siesta.Events.publish(that.EVENT_SERVICE_LOADED,that);
            });

            // the fun starts here
            sequentializer.start();
        }
    },

    _retryConnectModel: function(resp) {
        Siesta.Services.parseAndAddToRepository(resp,Siesta.Model.Repositories.schemas);
        this.model();

        Siesta.Events.publish(this.EVENT_SERVICE_LOADED,this);
    },

    EVENT_SERVICE_LOADED: "EVENT_SERVICE_LOADED"
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
    },    
};

Siesta.Model.Instance = Class.create();
/**
  @class Siesta.Model.Instance

  A RDF instance of some model.
*/
Siesta.Model.Instance.prototype = {
    /**
     * @constructor
     *
     * Initiates a new instance model with the URI andvalues
     * provided in the constructor.
     *
     * @argument schema: Siesta.Model.Schema for the instance.
     * @argument uri: instance URI, it can be null.
     * @argument properties: values for the properties of the instance
     */
    initialize: function(schema, uri, properties ) {
        this._schema = schema;
        this.uri = uri;
        this._properties = properties;
        this._graph = null;
        for(var p in properties) {
            this[p] = properties[p];
        }
    },

    toGraph: function() {
        if(this._graph == null) {
            this._graph = new  Siesta.Framework.Graph();            
            if(this.uri == null) {
                this.uri = "_:0";
            }
            var subject = new Siesta.Framework.Uri(this.uri);
            for(var _i=0; _i<this._schema.properties().length; _i++) {
                var prop = this._schema.properties()[_i];
                var found = null;
                var foundUri = null;
                for(var p in this._properties) {
                    var pindex = prop.uri.indexOf(p);
                    if(pindex != -1 && (pindex + p.length) == prop.uri.length) {
                        found = p;
                        foundUri = prop.uri;
                        break;
                    }
                }

                if(found != null) {
                    this._graph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri(this.uri),
                                                                      new Siesta.Framework.Uri(foundUri),
                                                                      new Siesta.Framework.Literal({value: this._properties[found]})));
                }
            }
        } 
        return this._graph;
    }
};

/**
  Events manager
*/
Siesta.Events = {
    eventsDictionary: {},

    subscriptionsMap: {},

    _subscriptionsCounter: 0,
   
   /**
    * Creates a subscription on the specified topic name. 
    *
    * @param {String} name
    *     The name of the topic to which you want to subscribe. 
    * @param {Function|String} refOrName
    *     A function object reference or the name of a function 
    *     that is invoked whenever an event is published on the topic.
    * @param {Object} [scope]
    *     An Object in which to execute refOrName when handling the event. 
    *     If null, window object is used. The scope parameter will be the 
    *     "this" object when the callback is invoked.
    * @param {*} [subscriberData]
    *     Client application provides this data, which is handed
    *     back to the client application in the subscriberData
    *     parameter of the callback function.
    * @returns 
    *     A String Object (a "subscription") that is unique for this particular subscription.
    * @type {String}
    */
    subscribe: function(name, refOrName, scope, subscriberData) {
    //addListener: function(sender,notification,receiver,method) {        
        if(this.eventsDictionary[name] == undefined) {
            this.eventsDictionary[name] = {};
        }
        var subscriptionId = '_'+this._subscriptionsCounter++;        
        this.eventsDictionary[name][subscriptionId] = { refOrName: refOrName,
                                                        scope: scope || this,
                                                        subscriberData: subscriberData || {} };
        this.subscriptionsMap[subscriptionId] = name;
        return subscriptionId;
    },

   /**
    * Removes a subscription to an event.
    *
    * @param {String} subscription
    *     The return value from a previous call to OpenAjax.hub.subscribe().
    */
    unsubscribe: function(subscription) {
    //removeListener: function(sender,notification,receiver) {
        var event = this.subscriptionsMap[subscription];
        if(event != undefined) {
            if(this.eventsDictionary[event] != undefined) {
                //var oldSubscription = this.eventsDictionary[event][subscription];
                //this.eventsDictionary[event].splice(this.eventsDictionary[event].indexOf(oldSubscription),1);
                delete this.eventsDictionary[event][subscription];
                var hasMore = false;
                for(var _p in this.eventsDictionary[event]) {
                    if(this.eventsDictionary[event][_p] != undefined) {
                        hasMore = true;
                    }
                }
//                 if(this.eventsDictionary[event].length == 0) {
//                     delete this.eventsDictionary[event];
//                 }
                if(hasMore == false) {
                    delete this.eventsDictionary[event];
                }
                delete this.subscriptionsMap[subscription];
            }
        }
    },

   /**
    * Publishes (broadcasts) an event.
    *
    * @param {String} name
    *     The name of the topic that is being published. 
    * @param {*} [publisherData]
    *     (Optional) An arbitrary Object holding extra information that 
    *     will be passed as an argument to the handler function.
    * @type {Object}
    */
    publish: function(name, publisherData) {
    //notifyEvent: function(sender,notification,data) {
        if(this.eventsDictionary[name] != undefined) {
            for(var subscriptionId in this.eventsDictionary[name]) {
                var subscription = this.eventsDictionary[name][subscriptionId];
                var theUserData = subscription.subscriberData;

                subscription.refOrName.apply(subscription.scope,[name,publisherData,theUserData]);
            }
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
    // var isPrototypeLoaded = false;
    Siesta.remainingFrameworks = {};
    Siesta.remainingFrameworks["sparql"] = true;
    Siesta.remainingFrameworks["formats/turtle"] = true;
    Siesta.remainingFrameworks["formats/xml"] = true;
    Siesta.remainingFrameworks["formats/rdfa"] = true;
    Siesta.remainingFrameworks["network"] = true;

    // Loading of the frameworks from remote scripts,
    // only when not packaged
    if(!Siesta.isPackaged) {
        if(Siesta.Configuration.drivers != null) {
            for(_i=0; _i< Siesta.Configuration.drivers.length; _i++) {
                var path = "libs/drivers/"+Siesta.Configuration.drivers[_i]+"/load.js";
                Siesta.loadFromBase(path);
            }
        }

        // Loading the components

        // sparql queries
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.sparql+"/sparql/query.js");
        // formats
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.turtle+"/formats/turtle.js"); //turtle
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.xml+"/formats/xml.js"); //xml
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.formats.rdfa+"/formats/rdfa.js"); //rdfa
        // networking
        Siesta.loadFromBase("libs/drivers/"+Siesta.Configuration.network+"/network.js"); //xml
    }
};

Siesta.WhenInitiatedScripts = [];

Siesta.onFrameworkInitiated = function(f) {
    Siesta.WhenInitiatedScripts.push(f);
};

//Sprocket including the configuration
//= require "configuration"

Siesta.registerFramework = function(key) {
    Siesta.remainingFrameworks[key] = false;

    var notReady = false;

    notReady = notReady || Siesta.remainingFrameworks["sparql"];
    notReady = notReady || Siesta.remainingFrameworks["formats/turtle"];
    notReady = notReady || Siesta.remainingFrameworks["formats/xml"];
    notReady = notReady || Siesta.remainingFrameworks["formats/rdfa"];
    notReady = notReady || Siesta.remainingFrameworks["network"];

    if(key == "sparql") {
        Siesta.Sparql = eval("Siesta.Drivers."+Siesta.Configuration.sparql+".Sparql");
    } else if(key == "formats/turtle") {
        Siesta.Formats.Turtle = eval("Siesta.Drivers."+Siesta.Configuration.formats.turtle+".Formats.Turtle");
    } else if(key == "formats/xml") {
        Siesta.Formats.Xml = eval("Siesta.Drivers."+Siesta.Configuration.formats.xml+".Formats.Xml");
    } else if(key == "formats/rdfa") {
        Siesta.Formats.Rdfa = eval("Siesta.Drivers."+Siesta.Configuration.formats.rdfa+".Formats.Rdfa");
    } else if(key == "network") {
        Siesta.Network = eval("Siesta.Drivers."+Siesta.Configuration.network+".Network");
    }

    if(!notReady) {
        for(_i=0; _i< Siesta.WhenInitiatedScripts.length; _i++) {
            Siesta.WhenInitiatedScripts[_i].call();
        }
    }
}
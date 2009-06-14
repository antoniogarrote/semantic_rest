/**
 * Reimplementation of Ariel.Hercules SPARQL store
 * using Prototype framework.
 */

/**
 * @author Antonio Garrote Hernandez
 * 6-5-2009
 */

//namespaces
if (! Siesta) var Siesta = {};

// Prototype will handle this
//if (! Siesta.Util) Siesta.Util = {}; 

if (! Siesta.Parser) Siesta.Parser = {};
if (! Siesta.Parser.RecursiveDescentParser) Siesta.Parser.RecursiveDescentParser = {};
if (! Siesta.Hercules) Siesta.Hercules = {};
if (! Siesta.Hercules.Rdf) Siesta.Hercules.Rdf = {};
if (! Siesta.Hercules.Rdf.Datatype) Siesta.Hercules.Rdf.Datatype = {};
if (! Siesta.Hercules.Rdf.Datatype.Xsd) Siesta.Hercules.Rdf.Datatype.Xsd = {};
if (! Siesta.Hercules.Sparql) Siesta.Hercules.Sparql = {};
if (! Siesta.Hercules.Serialized) Siesta.Hercules.Serialized = {};
if (! Siesta.Hercules.Serialized.Turtle) Siesta.Hercules.Serialized.Turtle = {};


Siesta.Hercules.Rdf.RDF_NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
Siesta.Hercules.Rdf.RDF_COLLECTION_FIRST = Siesta.Hercules.Rdf.RDF_NAMESPACE + "first";
Siesta.Hercules.Rdf.RDF_COLLECTION_REST = Siesta.Hercules.Rdf.RDF_NAMESPACE + "rest";
Siesta.Hercules.Rdf.RDF_COLLECTION_NIL = Siesta.Hercules.Rdf.RDF_NAMESPACE + "nil";
Siesta.Hercules.Rdf.RDF_TYPE = Siesta.Hercules.Rdf.RDF_NAMESPACE + "type";


/**
 * An abstract Class for RDF Resource.
 * @abstract
 */
Siesta.Hercules.Rdf.Resource = Class.create();

/**
 * Constructs an instance.
 * @param value The value which is hold by the instance
 */
Siesta.Hercules.Rdf.Resource.prototype= {
    
    /**
     * Constructs an instance.
     * @param value The value which is hold by the instance
     */
    initialize: function() {
	this._resourceInit.apply(this,arguments);
    },
    
    /*
     * Inner constructor
     * @param value The value which is hold by the instance
     */
    _resourceInit: function(/*string*/ value) {
	this.value = value;
    },

    /**
     * Sets the value of the instance.
     * @param value The value of the instance.
     */
    setValue: function(/*string*/ value) {
	this.value = value;
    },

    /**
     * Returns the value of the instance.
     * @return The value of the instance. "undefined" will be returned when not be set.
     */
    getValue: function() {
	return this.value;
    },

    /**
     * Returns whether the given object is equals to the instance.
     * Equality is deceided by comparing their values, not by "==" operator.
     * This method will be overrided by child classes. e.g.) PlainLiteral checks their value of LanguageTag.
     * @param to An instance compared for.
     * @return bool
     */
    equals: function(/*Siesta.Hercules.Rdf.Resource*/ to) {
	return (this.value == to.value);
    }
};


/**
 * A Class for the IRI Reference Resource.
 */
Siesta.Hercules.Rdf.RdfUriRef = Class.create();

Siesta.Hercules.Rdf.RdfUriRef.prototype = Object.extend(
    /**
     * subclass of Siesta.Hercules.Rdf.Resource
     */
    new Siesta.Hercules.Rdf.Resource(),
    
    {
	
	/**
         * Constructs an instance.
         * @param uriString The uri value of the instance without any delimiters. e.g.) http://www.arielworks.net/, not <http://www.arielworks.net/>
         */
	initialize: function() {
	    this._rdfUriRefInit.apply(this,arguments);	    
	},

	/**
         * Inner Constructor
         */
	_rdfUriRefInit: function(/*string*/ uriString) {
	    this._resourceInit(this.normalize(uriString));
	},


	// NOTE: This normalization method do only "URI" -> "RDF URI Reference" mapping.
	// The Normalization processes below in RFC 3987 will not be performed.
	// 5.3.2.  Syntax-Based Normalization
	// 5.3.3.  Scheme-Based Normalization
	// 5.3.4.  Protocol-Based Normalization
	// Thise normalizetion process are not supported because "RDF CONCEPT" requires "character by character" comparison.
	// c.f. http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Graph-URIref
	//
	// NOTE:  Strictly, this normalization process converts URI into "RDF URI Reference" not "IRI".
	// "RDF URI Reference" reject only characters #x00 - #x1F, #x7F-#x9F .
	// In other words, "RDF URI Reference" accept some characters which is not accepted in IRIS,
	// for example "not allowed ASCII character in URL" (e.g. " "(#x20), "<"(#x3C)) and some forbidden Unicode characters.
	// NOT ALLOWED ASCII: "<", ">", '"', space, "{", "}", "|", "\", "^", and "`"
	// c.f. "7.1.  Legacy Extended IRI Syntax" in a draft of RFC 3987
	// http://www.ietf.org/internet-drafts/draft-duerst-iri-bis-02.txt
	normalize: function(uriString) {
	    // c.f. "3.2.  Converting URIs to IRIs" in RFC 3987
	    // c.f. "2.2.  Reserved Characters" in RFC RFC 3986
	    //@TODO: check "strictry legal UTF-8", if convert into IRI
	    //@TODO: check NOT ALLOWED ASCII, if convert into IRI
	    // Current non-decodeing characters:
	    // ":" / "/" / "?" / "#" / "[" / "]" / "@"
	    // "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
	    // "%"
    
	    var percentRegex = /(%(?!3A|2F|3F|23|5B|5D|40|21|24|26|27|28|29|2A|2B|2C|3B|3D|25)[0-9A-F]{2})+/g;
	    uriString = uriString.replace(percentRegex, function() {
		return decodeURIComponent(arguments[0]);
	    });
	    return uriString;
	},

	//@TODO: make restricter?
	// from "Appendix B.  Parsing a URI Reference with a Regular Expression" in RFC 3986
	COMPONENT_REGEX: /^([^:\/?#]+:)?(\/\/[^\/?#]*)?([^?#]*)(\?[^#]*)?(#.*)?$/,

	componentsRegExp: /^([^:\/?#]+:)?(\/\/[^\/?#]*)?([^?#]*)(\?[^#]*)?(#.*)?$/,

	resolveUriRef: function(baseUri, uriRef) {
	    // c.f. "5.2.2.  Transform References" in RFC 3986
	    var bComp = baseUri.match(Siesta.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
	    bComp.shift();
	    var rComp = uriRef.match(Siesta.Hercules.Rdf.RdfUriRef.COMPONENT_REGEX);
	    rComp.shift();

	    if (rComp[0]) {
		bComp.splice(0, 5, rComp[0], rComp[1], Siesta.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
	    } else {
		if (! bComp || ! bComp[1]) throw "Given Base URI is not a valid Absolute URI." //@TODO
		if(rComp[1]) {
		    bComp.splice(1, 4, rComp[1], Siesta.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
		} else if (rComp[2] == "") {
		    if (rComp[3]) {
			bComp.splice(3, 2, rComp[3], rComp[4]);
		    } else {
			bComp.splice(4, 1, rComp[4]);
		    }
		} else if (rComp[2][0] == "/") {
		    bComp.splice(2, 3, Siesta.Hercules.Rdf.RdfUriRef.__removeDotSegments(rComp[2]), rComp[3], rComp[4]);
		} else {
		    bComp.splice(2, 3, Siesta.Hercules.Rdf.RdfUriRef.__removeDotSegments(Siesta.Hercules.Rdf.RdfUriRef.__merge(bComp[2], rComp[2])), rComp[3], rComp[4]);
		}
	    }
    
	    return bComp.join("");
	},

	__removeDotSegments: function(path) {
	    var segments = path.split("/");
	    var resultStack = [];
	    for (var i = 0; i < segments.length; i++) {
		if (i == 0) {
		    if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
		    else resultStack.push(segments[i]);
		} else if (i == segments.length - 1) {
		    if (segments[i] == "..") {
			var top = resultStack.pop();
			if (top === "") resultStack.push(top);
		    }
		    
		    if (segments[i] == "." || segments[i] == ".." || segments == "") resultStack.push("");
		    else resultStack.push(segments[i]);
		} else {
		    if (segments[i] == "." || segments[i] == "") continue;
		    else if (segments[i] == "..") {
			var top = resultStack.pop();
			if (top === "") resultStack.push(top);
		    }
		    else resultStack.push(segments[i]);
		}
	    }
	    return resultStack.join("/");
	},

	__merge: function(base, relative) {
	    base = base.substring(0, base.lastIndexOf("/"));
	    return base + "/" + relative;
	}
    }
);

/**
 * An abstract class for the RDF literal.
 * @abstract
 */
Siesta.Hercules.Rdf.Literal = Class.create();

Siesta.Hercules.Rdf.Literal.prototype = Object.extend(
    /**
     * Subclass of Siesta.Hercules.Rdf.Resource
     */
    new Siesta.Hercules.Rdf.Resource(),

    {
	
	/**
         * Constructs an instance.
         * @param uriString The uri value of the instance without any delimiters.
         */
	initialize: function() {
	    this._literalInit.apply(this,arguments);
	},

	/**
         * Inner constructor.
         */
	_literalInit: function(/*string*/ uriString) {
	    this._resourceInit(uriString);	    
	}
    }
);

/**
 * A class for the Plain Literal.
 * The Plain Literal is the Literal without datatypes and has optionally language tags.
 */
Siesta.Hercules.Rdf.PlainLiteral = Class.create();

Siesta.Hercules.Rdf.PlainLiteral.prototype = Object.extend(

    /**
     * Subclass of Siesta.Hercules.Rdf.Literal
     */
    new Siesta.Hercules.Rdf.Literal(),

    {

	initialize: function() {
	    this._plainLiteralInit.apply(this,arguments);
	},

	/**
         * Constructs an instance
         * @param value The value of the instance.
         * @param languageTag The optional language tag for the instance. e.g.) en-US
         */
	_plainLiteralInit: function(/*string*/ value, /*string*/ languageTag) {
	    this.languageTag = languageTag;
	    this._literalInit(value);
	},

	/**
         * Sets the language tag of the instnace.
         * @param language The language tag to set. e.g.) en-US
         */
	setLanguageTag: function(languageTag) {
	    this.languageTag = languageTag;
	},

	/**
         * Returns the language tag of the instance.
         * @return The language tag of the instance. "undefined" will be returned when not be set.
         */
	getLanguageTag: function () {
	    return this.languageTag;
	},

	/**
         * Returns whether the given object is equals to the instance.
         * Equality is deceided by comparing their values and language tags, not by "==" operator.
         * Note: One of pair of literals has the language tag and the other doesn't have, the method will reuturn "false"
         * e.g.) "Hercules"@en-US is NOT equal to "Hercules"
         * see also: http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/#section-Literal-Equality
         * @param to An instance compared for.
         * @return bool
         */
	equals: function(to) {
	    return (to instanceof this.constructor && this.value == to.value && this.languageTag == to.languageTag);
	}
    }
);



/**
 * A class for the Typed Literal.
 * The Typed Literal is the Literal with datatypes like xsd:integer.
 */
Siesta.Hercules.Rdf.TypedLiteral = Class.create();

Siesta.Hercules.Rdf.TypedLiteral.prototype = Object.extend(
    
    /**
     * subclass of TypedLiteral
     */
    new Siesta.Hercules.Rdf.Literal(),

    {

	initialize: function() {
	    this._typedLiteralInit.apply(this,arguments);
	},

	/**
         * Constructs an instance.
         * @param value the value of the instance.
         * @datatypeIri The absolute IRI of the datatype of the instance.
         */
	_typedLiteralInit: function(value, datatypeIri) {
	    this.datatypeIri = datatypeIri;
	    this._literalInit(value);
	},

	/**
         * Sets the datatype of the instnace.
         * @param datatypeIri The datatype iri to set.
         */
	setDataTypeIri: function(datatypeIri) {
	    this.datatypeIri = datatypeIri;
	},

	/**
         * Returns the datatype IRI of the instance.
         * @return The dattype IRI of the instance. "undefined" will be returned when not be set.
         */
	getDataTypeIri: function () {
	    return this.datatypeIri;
	},

	/**
         * Returns whether the given object is equals to the instance.
         * Equality is deceided by comparing their values and language tags, not by "==" operator.
         * @param to An instance compared for.
         * @return bool
         */
	equals: function(to) {
	    return (to instanceof this.constructor && this.value == to.value && this.datatypeIri == to.datatypeIri);
	}
    }
);


/**
 * A Class for the Blank Node.
 */
Siesta.Hercules.Rdf.BlankNode = Class.create();

Siesta.Hercules.Rdf.BlankNode.prototype = Object.extend(

    new Siesta.Hercules.Rdf.Resource(),
    
    {
	initialize: function() {
	    this._blankNodeInit.apply(this,arguments);
	},
	
	_blankNodeInit: function(/*string*/ id) {
	    this._resourceInit(id);
	}
    }
    
);


/**
 * A class for the Triple.
 */
Siesta.Hercules.Rdf.Triple = Class.create();

Siesta.Hercules.Rdf.Triple.prototype = Object.extend(

    new Siesta.Hercules.Rdf.Resource(),
    
    {
	initialize: function() {
	    this._tripleInit.apply(this,arguments);
	},

	/**
         * Constructs an instance.
         * @param subject The subject of the triple
         * @param predicate The predicate of the triple
         * @param object The object of the triple
         */
	_tripleInit: function(/*Siesta.Hercules.Rdf.Resource*/ subject, /*Siesta.Hercules.Rdf.Resource*/ predicate, /*Siesta.Hercules.Rdf.Resource*/ object) {
	    /*
               // reject illigal resources
               if (subject instanceof Siesta.Hercules.Rdf.Literal) throw ""; //TODO
               if (! (predicate instanceof Siesta.Hercules.Rdf.RdfUriRef)) throw ""; //TODO
             */

	    this.subject = subject;
	    this.predicate = predicate;
	    this.object = object;
    
	    this._resourceInit();
	},

	/**
         * Sets the subject of the instance.
         * @param subject An instance of _RD.Resource to set
         */
	setSubject: function(/*Siesta.Hercules.Rdf.Resource*/ subject) {
	    this.subject = subject;
	},

	/**
         * Sets the predicate of the instance.
         * @param predicate An instance of _RD.Resource to set
         */
	setPredicate: function(/*Siesta.Hercules.Rdf.Resource*/ predicate) {
	    this.predicate = predicate;
	},

	/**
         * Sets the object of the instance.
         * @param object An instance of _RD.Resource to set
         */
	setObject: function(/*Siesta.Hercules.Rdf.Resource*/ object) {
	    this.object = object;
	},

	/**
         * Returns the subject of the instance.
         * @return Siesta.Hercules.Rdf.Resource The subject of the instance.
         */
	getSubject: function() {
	    return this.subject;
	},

	/**
         * Returns the predicate of the instance.
         * @return Siesta.Hercules.Rdf.Resource The predicate of the instance.
         */
	getPredicate: function() {
	    return this.predicate;
	},

	/**
         * Returns the object of the instance.
         * @return Siesta.Hercules.Rdf.Resource The object of the instance.
         */
	getObject: function() {
	    return this.object;
	},

	/**
         * Returns whether the given object is equals to the instance.
         * Triples are considered as same when subject, predicate and object of the triples are equal.
         * @param to An instance compared for.
         * @return bool
         */
	equals: function(to) {
	    return (to instanceof this.constructor) && this.subject.equals(to.subject) && this.predicate.equals(to.predicate) && this.object.equals(to.object);
	}
    }
);

Siesta.Hercules.Rdf.Graph = Class.create();

Siesta.Hercules.Rdf.Graph.prototype = {

    initialize: function() {
	this._graphInit.apply(this,arguments);
    },

    _graphInit: function() {
	this.tripleList = [];
	this.triples = {};
	this.resourceCount = 0;
	this.blankNodeCount = 0;
	this.blankNodes = {};
	this.rdfUriRdfs = {};
	this.plainLiterals = {};
	this.typedLiterals = {};
    },


    addTriple: function(subject, predicate, object) {
	// reject resources in the other graph
	if (subject.graph != this) throw ""; //TODO
	if (predicate.graph != this) throw ""; //TODO
	if (object.graph != this) throw ""; //TODO

	var sId = subject.resourceId;
	var pId = predicate.resourceId;
	var oId = object.resourceId;
	if (! this.triples[sId]) this.triples[sId] = {};
	if (! this.triples[sId][pId]) this.triples[sId][pId] = {};
	if (! this.triples[sId][pId][oId]) this.triples[sId][pId][oId] = 0;
	if (++this.triples[sId][pId][oId] == 1) {
            this.tripleList.push(new Siesta.Hercules.Rdf.Triple(subject, predicate, object));
	}

	return this;
    },

    getRdfUriRef: function(/*string*/ uri) {
	var normalized = Siesta.Hercules.Rdf.RdfUriRefInGraph.normalize(uri);
	if (! this.rdfUriRdfs[normalized]) this.rdfUriRdfs[normalized] = new Siesta.Hercules.Rdf.RdfUriRefInGraph(this, this.resourceCount++, uri);
	return this.rdfUriRdfs[normalized];
    },

    getPlainLiteral: function(/*string*/ value, languageTag) {
	if (! this.plainLiterals[value]) this.plainLiterals[value] = {};
	if (! this.plainLiterals[value][languageTag]) this.plainLiterals[value][languageTag] = new Siesta.Hercules.Rdf.PlainLiteralInGraph(this, this.resourceCount++, value, languageTag);    
	return this.plainLiterals[value][languageTag];
    },

    getTypedLiteral: function(/*string*/ value, datatypeIri) {
	if (! this.typedLiterals[value]) this.typedLiterals[value] = {};
	if (! this.typedLiterals[value][datatypeIri]) this.typedLiterals[value][datatypeIri] = new Siesta.Hercules.Rdf.TypedLiteralInGraph(this, this.resourceCount++, value, datatypeIri);    
	return this.typedLiterals[value][datatypeIri];
    },

    getBlankNode: function(/*string*/ id) {
	if (! id) {
            return new  Siesta.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
	} else {
            if (! this.blankNodes[id]) this.blankNodes[id] = new Siesta.Hercules.Rdf.BlankNodeInGraph(this, this.resourceCount++, this.blankNodeCount++);
            return this.blankNodes[id];
	}
    },

    clearBlankNodeId: function() {
	this.blankNodes = {};
	return this;
    }
};

Siesta.Hercules.Rdf.ResourceInGraph = Class.create();

Siesta.Hercules.Rdf.ResourceInGraph.prototype = {

    initialize: function() {
	this._resourceInGraphInit.apply(this,arguments);
    },
    
    _resourceInGraphInit: function(graph, resourceId) {
	this.graph = graph;
	this.resourceId = resourceId;
    }

};
 
Siesta.Hercules.Rdf.ResourceInSubject = Class.create();

Siesta.Hercules.Rdf.ResourceInSubject.prototype = Object.extend(

    new Siesta.Hercules.Rdf.ResourceInGraph(),

    {

    initialize: function() {
	this._resourceInSubjectInit.apply(this,arguments);
    },
    
    _resourceInSubjectInit: function(graph, resourceId) {
	this._resourceInGraphInit(graph,resourceId);
    },

    addProperty: function(predicate, object) {
	this.graph.addTriple(this, predicate, object);
	return this;
    }

});


Siesta.Hercules.Rdf.ResourceInObject = Class.create();

Siesta.Hercules.Rdf.ResourceInObject.prototype = Object.extend(
    
    new Siesta.Hercules.Rdf.ResourceInGraph(),
    
    {
	initialize: function() {
	    this._resourceInObject.apply(this,arguments);
	},
	
	_resourceInObject: function(graph, resourceId) {
	    this._resourceInGraphInit(graph,resourceId);
	},

	addReverseProperty: function(predicate, subject) {
	    this.graph.addTriple(subject, predicate, this);
	    return this;
	}
    }

);

/*
Siesta.Hercules.Rdf.RdfUriRefInGraph = Class.create();

Siesta.Hercules.Rdf.RdfUriRefInGraph.prototype = Object.extend(//Siesta.Hercules.Rdf.RdfUriRef, Siesta.Hercules.Rdf.ResourceInGraph, Siesta.Hercules.Rdf.ResourceInObject);

    new Siesta.Hercules.Rdf.RdfUriRef(),

    new Siesta.Hercules.Rdf.ResourceInGraph(),

    new Siesta.Hercules.Rdf.ResourceInObject(),
    
    {
        initialize: function() {
            this._rdfUriRefInGraphInit.apply(this,arguments);
        },

        _rdfUriRefInGraphInit: function(graph,resourceId,uriString) {
            _rdfUriRefInit(uriString);
            _resourceInObject(graph,resourceId);
        }
    }
);
*/
//load("sparql.js");
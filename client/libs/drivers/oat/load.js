// nothing to load for this driver
OAT = {};

OAT.Loader = {featureLoaded: function() {}};

OAT.RDFData = {
	DISABLE_HTML:1,
	DISABLE_DEREFERENCE:2,
	DISABLE_BOOKMARK:4,
	DISABLE_FILTER:8
}

OAT.RDF = {
	ignoredAttributes:["about","nodeID","ID","parseType"],
	toTriples:function(xmlDoc,url) {
		var triples = [];
		var root = xmlDoc.documentElement;
		if (!root || !root.childNodes) { return triples; }
		var bnodePrefix = "_:" + Math.round(1000*Math.random()) + "_";
		var bnodeCount = 0;
		
		var u = url || "";
		u = u.match(/^[^#]+/);
		u = u? u[0] : "";
		var idPrefix = u + "#";
		
		function getAtt(obj,att) {
			if (att in obj) { return obj[att]; }
			return false;
		}
		
		function processNode(node,isPredicateNode) {
			/* get info about node */
			var attribs = OAT.Xml.getLocalAttributes(node);
			/* try to get description from node header */
			var subj = getAtt(attribs,"about");
			var id1 = getAtt(attribs,"nodeID");
			var id2 = getAtt(attribs,"ID");
			/* no subject in triplet */
			if (!subj) { 
				/* try construct it from ids */
				if (id1) {
					subj = idPrefix+id1; 
				} else if (id2) {
					subj = idPrefix+id2; 
				} else {
					/* create anonymous subject */
					subj = bnodePrefix+bnodeCount;
					bnodeCount++;
				}
			}
			/* now we have a subject */
			
			/* handle literals ? */
			if (OAT.Xml.localName(node) != "Description" && !isPredicateNode) { /* add 'type' where needed */
				var pred = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
				var obj = node.namespaceURI + OAT.Xml.localName(node);
				triples.push([subj,pred,obj,0]); /* 0 - literal, 1 - reference */
			}

			/* for each of our own attributes, push a reference triplet into the graph */	
			for (var i=0;i<node.attributes.length;i++) {
				var a = node.attributes[i];
				var local = OAT.Xml.localName(a);
			    if (OAT.RDF.ignoredAttributes.find(function(attr){ return attr == local}) == undefined ) {
					var pred = a.namespaceURI+OAT.Xml.localName(a);
					var obj = a.nodeValue;
					triples.push([subj,pred,obj,1]);
			    }
			} /* for all attributes */

			/* for each of our children create triplets based on their type */
			for (var i=0;i<node.childNodes.length;i++) if (node.childNodes[i].nodeType == 1) {
				var n = node.childNodes[i];
				var nattribs = OAT.Xml.getLocalAttributes(n);
				var pred = n.namespaceURI+OAT.Xml.localName(n);
				if (getAtt(nattribs,"resource") != "") { /* link via id */
					var obj = getAtt(nattribs,"resource");
					if (obj[0] == "#") { obj = idPrefix + obj.substring(1); }
					triples.push([subj,pred,obj,1]);
				} else if (getAtt(nattribs,"nodeID") != "") { /* link via id */
					/* recurse */
					var obj = processNode(n,true); 
					triples.push([subj,pred,obj,1]);
				} else if (getAtt(nattribs,"ID") != "") { /* link via id */
					/* recurse */
					var obj = processNode(n,true); 
					triples.push([subj,pred,obj,1]);
				} else {
					var children = [];
					for (var j=0;j<n.childNodes.length;j++) if (n.childNodes[j].nodeType == 1) { 
						children.push(n.childNodes[j]);
					}
					/* now what those children mean: */
					if (children.length == 0) { /* no children nodes - take text content */
						var obj = OAT.Xml.textValue(n);
						triples.push([subj,pred,obj,0]);
					} else if (children.length == 1) { /* one child - it is a standalone subject */
						var obj = processNode(children[0]);
						triples.push([subj,pred,obj,1]);
					} else if (getAtt(nattribs,"parseType") == "Collection") { /* multiple children - each is a standalone node */
						for (var j=0;j<children.length;j++) {
							var obj = processNode(children[j]);
							triples.push([subj,pred,obj,1]);
						}
					} else { /* multiple children - each is a pred-obj pair */
						var obj = processNode(n,true);
						triples.push([subj,pred,obj,1]);
					} /* multiple children */
				}
			} /* for all subnodes */
			return subj;
		} /* process node */
		
		for (var i=0;i<root.childNodes.length;i++) {
			var node = root.childNodes[i];
			if (node.nodeType == 1) { processNode(node); }
		}
		return triples;
	}
} /* OAT.RDF */
OAT.Loader.featureLoaded("rdf");

OAT.Browser = {
    isIE:function() {
        return (window.attachEvent && navigator.userAgent.indexOf('Opera') === -1);
    }
};

OAT.Xml = {
	textValue:function(elem) {
		/*
			gecko: textContent
			ie: text
			safari: .nodeValue of first child
		*/
		if (!elem) { return; }
		if (document.implementation && document.implementation.createDocument) {				
			var result = elem.textContent;
			/* safari hack */
			if (typeof(result) == "undefined") { 
				result = elem.firstChild; 
				return (result ? result.nodeValue : "");
			}
			return result;
		} else if (window.ActiveXObject) {
			return elem.text;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
	},
	
	localName:function(elem) {
		if (!elem) { return; }
	        if (OAT.Browser.isIE()) {
			return elem.baseName;
		} else {
			return elem.localName;
		}
	},
	
	createXmlDoc:function(string) {
		if (document.implementation && document.implementation.createDocument) {				
			if (!string) { return document.implementation.createDocument("","",null); }
			var parser = new DOMParser();
			try {
				var xml = parser.parseFromString(string, "text/xml");
			} catch(e) { 
				alert('XML parsing error. Either the XML file is not well-formed or your browser sucks.');
			}
			return xml;
		} else if (window.ActiveXObject) {
			var xml = new ActiveXObject("Microsoft.XMLDOM");
			if (!string) { return xml; }
			xml.loadXML(string);
			if (xml.parseError.errorCode) {
				alert('IE XML ERROR: '+xml.parseError.reason+' ('+xml.parseError.errorCode+')');
				return false;
			}
			return xml;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},
	
	newXmlDoc:function() {
		if (document.implementation && document.implementation.createDocument) {				
			var xml = document.implementation.createDocument("","",null);
			return xml;
		} else if (window.ActiveXObject) {
			var xml = new ActiveXObject("Microsoft.XMLDOM")
			return xml;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},
	
	serializeXmlDoc:function(xmlDoc) {
		if (document.implementation && document.implementation.createDocument) {				
			var ser = new XMLSerializer();
			var s = ser.serializeToString(xmlDoc);
//			s = '<?xml version="1.0" ?>\n'+s;
			return s;
		} else if (window.ActiveXObject) {
			var s = xmlDoc.xml;
//			s = '<?xml version="1.0" ?>\n'+s;
			return s;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
		return false;
	},
	
	transformXSLT:function(xmlDoc,xslDoc,paramsArray) {
		if (document.implementation && document.implementation.createDocument) {				
			var xslProc = new XSLTProcessor();
			if (paramsArray) for (var i=0;i<paramsArray.length;i++) {
				var param = paramsArray[i];
				xslProc.setParameter(param[0],param[1],param[2]);
			}
			xslProc.importStylesheet(xslDoc);
			var result = xslProc.transformToDocument(xmlDoc);
			return result;
		} else if (window.ActiveXObject) {
			/* new solution with parameters */
			var freeXslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
			freeXslDoc.load(xslDoc);
			var template = new ActiveXObject("MSXML2.XSLTemplate");
			template.stylesheet = freeXslDoc;
			var proc = template.createProcessor();
			proc.input = xmlDoc;
			if (paramsArray) for (var i=0;i<paramsArray.length;i++) {
				var param = paramsArray[i];
				proc.addParameter(param[1],param[2]);
			}
			proc.transform();
			var result = proc.output;
			var rDoc = OAT.Xml.createXmlDoc(result);
			return rDoc;
		} else {
			alert("Ooops - no XSL parser available");
			return false;
		}
	},
	
	getElementsByLocalName:function(elem,tagName) {
		var result = [];
		var elems = elem;
		if (!elem) { return result; }
		if (!(elems instanceof Array)) { elems = [elem]; }
		for (var i=0;i<elems.length;i++) {
			var all = elems[i].getElementsByTagName("*");
			for (var j=0;j<all.length;j++) 
				if (all[j].localName == tagName || all[j].baseName == tagName) { result.push(all[j]); }
		}
		return result;
	},
	
	childElements:function(elem) {
		var result = [];
		if (!elem) { return result; }
		var all = elem.getElementsByTagName("*");
		for (var i=0;i<all.length;i++) {
			if (all[i].parentNode == elem) { result.push(all[i]); }
		}
		return result;
	},
	
	getLocalAttribute:function(elm,localName) {
		var all = elm.attributes;
		for (var i=0;i<elm.attributes.length;i++) {
			if (elm.attributes[i].localName == localName || elm.attributes[i].baseName == localName) { return elm.attributes[i].nodeValue; }
		}
		return false;
	},
	
	getLocalAttributes:function(elm) {
		var obj = {};
		if(!elm) { return obj; }
		for (var i=0;i<elm.attributes.length;i++) {
			var att = elm.attributes[i];
			var ln = att.localName;
			var key = ln ? ln : att.baseName;
			obj[key] = att.nodeValue;
		}
		return obj;
	},
	
	xpath:function(xmlDoc,xpath,nsObject) {
		var result = [];
		function resolver(prefix) {
			var b = " ";
			if (prefix in nsObject) { return nsObject[prefix]; }
			if (b in nsObject) { return nsObject[" "]; } /* default ns */
			return ""; /* fallback; should not happen */
		}
		if (document.evaluate) {
			var it = xmlDoc.evaluate(xpath,xmlDoc,resolver,XPathResult.ANY_TYPE,null); 
			var node;
			while ((node = it.iterateNext())) {	result.push(node); }
			return result;
		} else if (window.ActiveXObject) {
			var tmp = xmlDoc.selectNodes(xpath);
			for (var i=0;i<tmp.length;i++) { result.push(tmp[i]); }
			return result;
		} else {
			alert("Ooops - no XML parser available");
			return false;
		}
	},
	
	removeDefaultNamespace:function(xmlText) {
		var xml = xmlText.replace(/xmlns="[^"]*"/g,"");
		return xml;
	}/*,
	
	escape:OAT.Dom.toSafeXML,
	unescape:OAT.Dom.fromSafeXML*/
}
//OAT.Loader.featureLoaded("xml");

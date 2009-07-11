// here the intializers for the profiles will be loaded
// simulating JSONP requests
GRDDL_initializers = {};

// setup the basic
RDFA = new Object();

// EXPECTING __RDFA_BASE
if (typeof(__RDFA_BASE) == 'undefined')
   __RDFA_BASE = 'http://www.w3.org/2001/sw/BestPractices/HTML/rdfa-bookmarklet/';

var __RDFA_VERSION_SUBDIR = '2006-10-08/';

//
// An in-place GRDDL profile
// for XHTML1 hGRDDL
//
// Ben Adida (ben@adida.net)
// 2006-10-08
//

//
// helper functions
//

XH = new Object();

XH.getNodeAttributeValue = function(element, attr) {
    if (!element)
        return null;

    if (element.getAttribute) {
        if (element.getAttribute(attr))
            return(element.getAttribute(attr));
    }

    if (!element.attributes)
        return null;

	if (!element.attributes[attr])
		return null;

	return element.attributes[attr].value;
};

XH.setNodeAttributeValue = function(element, attr, value) {
    if (!element)
        return;

    if (element.setAttribute) {
        element.setAttribute(attr,value);
        return;
    }

    if (!element.attributes)
        element.attributes = new Object();

    element.attributes[attr] = new Object();
    element.attributes[attr].value = value;
};

XH.get_special_subject = function(element) {
	// ABOUT overrides ID
	if (XH.getNodeAttributeValue(element,'about'))
		return XH.getNodeAttributeValue(element,'about');

    // there is no ABOUT, but this might be the HEAD
    if (element.name == 'head')
        return ""

	// ID
	if (XH.getNodeAttributeValue(element,'id'))
		return "#" + XH.getNodeAttributeValue(element,'id');

  if (typeof(XH.bnode_counter) == 'undefined')
    XH.bnode_counter = 0;

  XH.bnode_counter++;
  return '[_:' + element.nodeName + XH.bnode_counter + ']';
};

//
// the transformation
//

// FIXME: more of these
XH.SPECIAL_RELS_ARR = ['next','prev','home'];

XH.SPECIAL_RELS = new Object();
for (var i=0; i<XH.SPECIAL_RELS_ARR.length; i++) {
  XH.SPECIAL_RELS[XH.SPECIAL_RELS_ARR[i]] = true;
}

XH.RDF_PREFIX = 'rdf';
XH.RDF_URI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

XH.XHTML_PREFIX = 'xhtml';
XH.XHTML_URI = 'http://www.w3.org/1999/xhtml';

XH.transform = function(element) {
    // recurse down the children
    // depth-first search here, because we don't need to
    // explore nodes we add along the way, only existing ones.
    var children = element.childNodes;
    for (var i=0; i < children.length; i++) {
	    XH.transform(children[i]);
    }

    // the classes
    if (typeof(element.className) != 'undefined' && element.className != '') {
      var classes = element.className.split(' ');

      for (var i=0; i<classes.length; i++) {
        var link_el = document.createElement('link');
        link_el.rel= 'rdf:type';
        link_el.href= '[' + classes[i] + ']'
        element.appendChild(link_el);
      }
    }

    // the special RELs
    if (typeof(element.rel) != 'undefined' && element.rel != '') {
      var rels = element.rel.split(' ');

      var new_rels=[];
      for (var i=0; i<rels.length; i++) {
        var the_rel = rels[i];
        if (XH.SPECIAL_RELS[the_rel]) {
          the_rel = XH.XHTML_PREFIX + ':' + the_rel;
        }
        new_rels[new_rels.length] = the_rel;
      }

      element.setAttribute('rel',new_rels.join(" "));
    }

    // 2007-02-05: no longer processing OL and UL, too much controversy for now (Ben)
    return;

    // the OL and UL
    if (element.nodeName == 'UL' || element.nodeName == 'OL') {
      var link_el = document.createElement('link');
      XH.setNodeAttributeValue(link_el, 'rel', 'rdf:type');
      XH.setNodeAttributeValue(link_el, 'href', 'rdf:Bag');
      element.appendChild(link_el);

      // go through the LIs
      var li_els = element.getElementsByTagName('li');
      for (var i=0; i<li_els.length; i++) {
        var new_rel = "rdf:_" + (i+1);
        var existing_rel = XH.getNodeAttributeValue(li_els[i],'rel');
        if (existing_rel) {
          new_rel = existing_rel + ' ' + new_rel;
        }
        XH.setNodeAttributeValue(li_els[i],'rel',new_rel);
      }
    }
};

XH.initForDoc = function(doc) {
    XH.transform(doc.body)
    XH.transform(doc.getElementsByTagName('head')[0])
    doc.body.setAttribute('xmlns:' + XH.RDF_PREFIX, XH.RDF_URI);
    doc.body.setAttribute('xmlns:' + XH.XHTML_PREFIX, XH.XHTML_URI);
    doc.getElementsByTagName('head')[0].setAttribute('xmlns:' + XH.RDF_PREFIX, XH.RDF_URI);
    doc.getElementsByTagName('head')[0].setAttribute('xmlns:' + XH.XHTML_PREFIX, XH.XHTML_URI);
    RDFA.GRDDL.DONE_LOADING(__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'xhtml1-hgrddl.js');
}

GRDDL_initializers[__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'xhtml1-hgrddl.js'] = XH.initForDoc;

/**
 *	RDF/A in Javascript
 *	Ben Adida - ben@mit.edu
 *  Nathan Yergler - nathan@creativecommons.org
 *
 *	licensed under GPL v2
 */

// EXPECTING __RDFA_BASE
// if (typeof(__RDFA_BASE) == 'undefined')
//   __RDFA_BASE = 'http://www.w3.org/2001/sw/BestPractices/HTML/rdfa-bookmarklet/';

// if (typeof(__RDFA_VERSION_SUBDIR) == 'undefined')
//   __RDFA_VERSION_SUBDIR = '2006-10-08/';

// internal data structures
RDFA.triples = new Array();
RDFA.bnode_counter = 0;

//
// dummy callbacks in case they're not defined
//
if (!RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT)
    RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT = function(foo,bar) {};

if (!RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT)
    RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT = function(foo,bar) {};

if (!RDFA.CALLBACK_NEW_TRIPLE_WITH_SUBJECT)
    RDFA.CALLBACK_NEW_TRIPLE_WITH_SUBJECT = function(foo,bar) {};

//
// A better associative array
//
Array.prototype.add = function(name,value) {
    this.push(value);
    this[name] = value;

    // keep a list of names
    if (!this.names) {
        this.names = new Array();
    }

    this.names.push(name);
};

// a shallow copy of an array (only the named items)
Array.prototype.copy = function() {
    var the_copy = new Array();

    if (this.names) {
        // loop and copy
        for (var i=0; i < this.names.length; i++) {
            the_copy.add(this.names[i],this[this.names[i]]);
        }
    }

    return the_copy;
};

//
//
//

// XML Namespace abstraction
RDFA.Namespace = function(prefix, uri) {
    this.prefix = prefix;
    this.uri = uri;
};

RDFA.Namespace.prototype.equals = function(other) {
    return (this.uri == other.uri);
};

// RDF/A CURIE abstraction
RDFA.CURIE = function(ns,suffix) {
    this.ns = ns;
    this.suffix = suffix;
};

RDFA.CURIE.VALID_END_CHARS = new Array('/','#');

RDFA.CURIE.prototype.pretty = function() {
    return (this.ns? this.ns.prefix:'?') + ':' + this.suffix;
};

RDFA.CURIE.prototype.uri = function() {
  if (!this.ns) return '';

  // ensure the namespace uri ends with # or /
  if (this.ns.uri[this.ns.uri.length - 1] in RDFA.CURIE.VALID_END_CHARS) {
   	return this.ns.uri + this.suffix;
  } else {
   	return this.ns.uri + "#" + this.suffix;
  }
};

RDFA.CURIE.prototype.equals = function(other) {
    return (this.ns.equals(other.ns) && (this.suffix == other.suffix));
};

RDFA.CURIE.parse = function(str, namespaces) {
    var position = str.indexOf(':');

    // this will work even if prefix == -1
    var prefix = str.substring(0,position);
    var suffix = str.substring(position+1);

    var curie = new RDFA.CURIE(namespaces[prefix],suffix);
    return curie;
};

RDFA.CURIE.prettyCURIEorURI = function(str) {
    if (str[0] == '[')
        return str.substring(1,str.length - 1);
    else
        return '<' + str + '>';
}

RDFA.CURIE.prettyCURIEorURIinHTML = function(str) {
    if (str[0] == '[')
        return str.substring(1,str.length - 1);
    else
        return '&lt;' + str + '&gt;';
}

// RDF Triple abstraction
RDFA.Triple = function() {
    this.subject = '';
    this.predicate = '';
    this.object = '';
    this.object_literal_p = null;
};

RDFA.Triple.prototype.setLiteral= function(is_literal) {
    this.object_literal_p = is_literal;
};

RDFA.Triple.prototype.pretty = function() {

    // subject
    var pretty_string = RDFA.CURIE.prettyCURIEorURI(this.subject) + ' ';

    // predicate
    pretty_string += this.predicate.pretty() + ' ';

    if (this.object_literal_p) {
        pretty_string+= '"'+ this.object + '"';
    } else {
        pretty_string+= RDFA.CURIE.prettyCURIEorURI(this.object);
    }

    return pretty_string;
};

RDFA.Triple.prototype.prettyhtml = function() {
    var pretty_subject = this.subject;

    var pretty_string= RDFA.CURIE.prettyCURIEorURIinHTML(this.subject) + ' <a href="' + this.predicate.uri() + '">' + this.predicate.pretty() + '</a> ';

    if (this.object_literal_p) {
        pretty_string+= '"'+ this.object + '"';
    } else {
        pretty_string+= RDFA.CURIE.prettyCURIEorURIinHTML(this.object);
    }

    return pretty_string;
};


//
// This would be done by editing Node.prototype if all browsers supported it... (-Ben)
//
RDFA.getNodeAttributeValue = function(element, attr) {
    if (!element)
        return null;

    if (element.getAttribute) {
        if (element.getAttribute(attr))
            return(element.getAttribute(attr));
    }

    if (!element.attributes)
        return null;

	if (!element.attributes[attr])
		return null;

	return element.attributes[attr].value;
};

RDFA.setNodeAttributeValue = function(element, attr, value) {
    if (!element)
        return;

    if (element.setAttribute) {
        element.setAttribute(attr,value);
        return;
    }

    if (!element.attributes)
        element.attributes = new Object();

    element.attributes[attr] = new Object();
    element.attributes[attr].value = value;
};

//
// Support for loading other files
//

RDFA.GRDDL = new Object();

RDFA.GRDDL.CALLBACKS = new Array();

RDFA.GRDDL.DONE_LOADING = function(url) {
    RDFA.GRDDL.CALLBACKS[url]();
};

RDFA.GRDDL.load = function(url, callback,parsed_document)
{
    // MODIFIED
//     var s = document.createElement("script");
//     s.type = 'text/javascript';
//     s.src = url;

    // set up the callback
    RDFA.GRDDL.CALLBACKS[url] = callback;

    // MODIFIED
    GRDDL_initializers[url](parsed_document);

    // add it to the document tree, load it up!
    // MODIFIED
    // document.getElementsByTagName('head')[0].appendChild(s);
};

//
// Support of in-place-GRDDL
//

RDFA.GRDDL._profiles = new Array();

RDFA.GRDDL.addProfile = function(js_url) {
    RDFA.GRDDL._profiles[RDFA.GRDDL._profiles.length] = js_url;
};

RDFA.GRDDL.runProfiles = function(callback,parsedDoc) {
    // workaround for Prototype v1.4 and below
    if (RDFA.GRDDL._profiles.length == 0) {
      callback();
      return;
    }

    var next_profile = RDFA.GRDDL._profiles.shift();

    if (!next_profile) {
        //alert('no more profiles!');
        callback();
        return;
    }

    // load the next profile, and when that is done, run the next profiles
    RDFA.GRDDL.load(next_profile, function() {
        //alert('back from profile ' + next_profile);
        RDFA.GRDDL.runProfiles(callback,parsedDoc);
    },parsedDoc);
}


//
//
//

RDFA.add_triple = function (subject, predicate, object, literal_p) {
    var triple = new RDFA.Triple();
    triple.subject = subject;
    triple.predicate = predicate;
    triple.object = object;
    triple.setLiteral(literal_p);

    // set up the array for that subject
    if (!RDFA.triples[triple.subject]) {
        RDFA.triples.add(triple.subject, new Array());
    }

    // we have to index by a string, so let's get the unique string, the URI
    var predicate_uri = triple.predicate.uri();

    if (!RDFA.triples[triple.subject][predicate_uri]) {
        RDFA.triples[triple.subject][predicate_uri] = new Array();
    }

    // store the triple
    var the_array = RDFA.triples[triple.subject][predicate_uri];
    the_array.push(triple);

	return triple;
};

RDFA.get_special_subject = function(element) {
	// ABOUT overrides ID
	if (RDFA.getNodeAttributeValue(element,'about'))
		return RDFA.getNodeAttributeValue(element,'about');

    // there is no ABOUT, but this might be the HEAD
    if (element.name == 'head')
        return ""

	// ID
	if (RDFA.getNodeAttributeValue(element,'id'))
		return "#" + RDFA.getNodeAttributeValue(element,'id');

	// BNODE, let's set it up if we need to
	if (!element.special_subject) {
		element.special_subject = '[_:' + element.nodeName + RDFA.bnode_counter + ']';
		RDFA.bnode_counter++;
	}

	return element.special_subject
};

//
// Process Namespaces
//
RDFA.add_namespaces = function(element, namespaces) {
    // we only copy the namespaces array if we really need to
    var copied_yet = 0;

    // go through the attributes
    var attributes = element.attributes;

    if (!attributes)
        return namespaces;

    for (var i=0; i<attributes.length; i++) {
        if (attributes[i].name.substring(0,5) == "xmlns") {
            if (!copied_yet) {
                namespaces = namespaces.copy();
                copied_yet = 1;
            }

            if (attributes[i].name.length == 5) {
                namespaces.add('',new RDFA.Namespace('',attributes[i].value));
            }

            if (attributes[i].name[5] != ':')
                continue;

            var prefix = attributes[i].name.substring(6);
            var uri = attributes[i].value;

            namespaces.add(prefix, new RDFA.Namespace(prefix,uri));
        }
    }

    return namespaces;
};

// this function takes a given element in the DOM tree and:
//
// - determines RDF/a statements about this particular element and adds the triples.
// - recurses down the DOM tree appropriately
//
// the namespaces is an associative array where the default namespace is namespaces['']
//
RDFA.traverse = function (element, inherited_about, explicit_about, namespaces) {

    // are there namespaces declared
    namespaces = RDFA.add_namespaces(element,namespaces);

    // determine the current about
    var current_about = inherited_about;
    var children_about = null;
    var element_to_callback = element;

    // do we explicitly override it?
    var new_explicit_about = null;
    if (RDFA.getNodeAttributeValue(element,'about')) {
        new_explicit_about = RDFA.getNodeAttributeValue(element,'about');
        current_about = new_explicit_about;
    }

    // determine the object
    var el_object = null;
    if (RDFA.getNodeAttributeValue(element,'href'))
      el_object = RDFA.getNodeAttributeValue(element,'href');
    if (RDFA.getNodeAttributeValue(element,'src'))
      el_object = RDFA.getNodeAttributeValue(element,'src');

    // LINK
    if (element.nodeName == 'link' || element.nodeName == 'meta') {
      current_about = RDFA.get_special_subject(element.parentNode);
      element_to_callback = element.parentNode;
    }

    // REL attribute
    if (RDFA.getNodeAttributeValue(element,'rel')) {
      // what if there is no object yet?
      if (!el_object) {
        el_object = RDFA.get_special_subject(element);
        children_about = el_object;
      }

      var triple = RDFA.add_triple(current_about, RDFA.CURIE.parse(RDFA.getNodeAttributeValue(element,'rel'),namespaces), el_object, 0);
      RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT(element_to_callback, triple);
    }

    // REV attribute
    if (RDFA.getNodeAttributeValue(element,'rev')) {
      // what if there is no object yet?
      if (!el_object) {
        el_object = RDFA.get_special_subject(element);
        children_about = el_object;
      }

      var triple = RDFA.add_triple(el_object, RDFA.CURIE.parse(RDFA.getNodeAttributeValue(element,'rev'),namespaces), current_about, 0);
      RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT(element_to_callback, triple);
    }

    // PROPERTY attribute
    if (RDFA.getNodeAttributeValue(element,'property')) {
        var content = RDFA.getNodeAttributeValue(element,'content');

        if (!content)
            content = element.textContent;

        var triple = RDFA.add_triple(current_about, RDFA.CURIE.parse(RDFA.getNodeAttributeValue(element,'property'),namespaces), content, 1);
        RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT(element_to_callback, triple);
    }

    // about for the children
    if (children_about) {
      new_explicit_about = children_about;
      current_about = children_about;
    }

    // recurse down the children
    var children = element.childNodes;
    for (var i=0; i < children.length; i++) {
	    RDFA.traverse(children[i], current_about, new_explicit_about, namespaces);
    }
};

RDFA.getTriples = function(subject, predicate) {
    if (!RDFA.triples[subject])
        return null;

    return RDFA.triples[subject][predicate.uri()];
};

RDFA.parse = function(parse_document,parse_base) {
    parse_document = parse_document || document;

    // by default, the current namespace for CURIEs is the current page
    // we remove the hash if there is one
    // MODIFIED
    //var current_base = document.baseURI.replace(/\#.*$/,'');
    var current_base = parse_base;
    var default_ns = new RDFA.Namespace('',current_base);
    var namespaces = new Array();

    // set up default namespace
    namespaces.add('',default_ns);

    // hGRDDL for XHTML1 special needs
    RDFA.GRDDL.addProfile(__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'xhtml1-hgrddl.js');

    // MODIFIED
    // Add the hcal profile if it's needed
//     var head = document.getElementsByTagName('head')[0];
//     var profile_attr = RDFA.getNodeAttributeValue(head,'profile');

//     if (profile_attr) {
//       var profiles =  profile_attr.split(' ');

//       for (var i=0; i<profiles.length; i++) {
// 	      if (profiles[i] == 'http://www.w3.org/2006/03/hcard') {
// 	        RDFA.GRDDL.addProfile(__RDFA_BASE + __RDFA_VERSION_SUBDIR + 'hcard-rdfa.js');
// 	      }
//       }
//     }

    // do the profiles, and then traverse
    RDFA.GRDDL.runProfiles(function() {
        //alert('now traversing.... ');
        RDFA.traverse(parse_document, '', null, namespaces);

        RDFA.CALLBACK_DONE_PARSING();
    },parse_document);
};

RDFA.log = function(str) {
    alert(str);
};

RDFA.reset = function() {
   // reset the triple container
   RDFA.triples = new Array();
}

// MODIFIED
//RDFA.CALLBACK_DONE_LOADING();

/**
 * The RDFa Javascript template.
 *
 * Ben Adida - ben@mit.edu
 * 2006-03-21
 * 2006-05-22 moved to W3C
 *
 * licensed under GPL v2
 */

// configuration information
RDFA.url = __RDFA_BASE + __RDFA_VERSION_SUBDIR + 'rdfa.js';

RDFA.N3_GRAPH = new Siesta.Framework.Graph();

N3_ADD = function(el,triple) {
    var subj = RDFA.__parseReference(triple.subject);
    var pred = RDFA.__parseReference(triple.predicate);
    var obj = null;
    if(triple.object_literal_p == null) {
        obj = new Siesta.Framework.Uri(triple.object)
    } else {
        /*
        var obj_lit = triple.object_literal_p
        if (obj_lit.indexOf('^^') != -1) {

        } else {

        }
        */
        obj = new Siesta.Framework.Literal({value: triple.object});
    }
    var triple = new Siesta.Framework.Triple(subj,pred,obj);
    RDFA.N3_GRAPH.addTriple(triple);
}

// a function that is called on an element when a triple pertains to it
// with the element being the literal object
RDFA.CALLBACK_NEW_TRIPLE_WITH_LITERAL_OBJECT = function(el, triple) {
	N3_ADD(el,triple);
}

// a function that is called on an element when a triple pertains to it
// with the element being the clickable link for a URI object
RDFA.CALLBACK_NEW_TRIPLE_WITH_URI_OBJECT = function(el, triple) {
	N3_ADD(el,triple);
}

// a function that is called on an element when a triple pertains to it
// with the element being the subject of the assertions
RDFA.CALLBACK_NEW_TRIPLE_WITH_SUBJECT = function(el, triple) {
	N3_ADD(el,triple);
}

// MODIFIED

// this should be defined in the driver code to 
// process results
// RDFA.CALLBACK_DONE_PARSING = function() {
//     var n3_b64 = btoa(N3_TEXT);
//     var n3_uri = 'data:text/rdf+n3;base64,' + n3_b64;

//     document.location= n3_uri;
// }

// MODIFIED

//
// Everything below is used only for loading the RDF/A javascript.
// You probably don't need to look at it.
//

// callback when the RDF/A parsing is done.
// RDFA.CALLBACK_DONE_LOADING = function() {
//     RDFA.parse();
// }

// RDFA.load = function()
// {
//     var s = document.createElement("script");
//     s.type = 'text/javascript';
//     s.src = RDFA.url;

//     // add it to the document tree, load it up!
//     document.getElementsByTagName('head')[0].appendChild(s);
// }

// RDFA.load();

/*
  // This should set up in motion
  //RDFA.parse();
*/


/**
 *  Parses a Hercules reference into a Siesta reference
 *
 *  @arguments:
 *  - reference: some kind of Hercules reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
RDFA.__parseReference = function(reference) {
    if(typeof reference == 'string') {
        if(reference.indexOf('_:') == -1) {
            return new Siesta.Framework.Uri(reference);
        } else {
            var bnodeId = reference.split(':')[1].split(']')[0]
            return new Siesta.Framework.BlankNode(bnodeId);
        }
    } else {
        return new Siesta.Framework.Uri(reference.uri());
    }
    /*
    } else if(reference instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             type: new Siesta.Framework.Uri(reference.datatypeIri)});

    } else if(reference instanceof Arielworks.Hercules.Rdf.PlainLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             language:  reference.languageTag});

    } else if(reference instanceof Arielworks.Hercules.Rdf.BlankNode.prototype.constructor) {
        return new Siesta.Framework.BlankNode(reference.value);

    } else {
        throw "Parsing Hercules unknown reference";
    }
*/
};

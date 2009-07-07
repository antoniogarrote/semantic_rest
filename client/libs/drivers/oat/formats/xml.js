Siesta.registerNamespace("Siesta","Drivers","OAT","Formats","Xml");

/**
 * informs the client that if this parser is synchronous or asynchronous
 */
Siesta.Drivers.OAT.Formats.Xml.isParserAsynchronous = function() {
    return false;
}

Siesta.Drivers.OAT.Formats.Xml.parseDoc = function(baseUri, doc /* RDF/XML document string */) {
    
    var xmlDoc = OAT.Xml.createXmlDoc(doc);
    var parsedTriples = OAT.RDF.toTriples(testDoc,baseUri);

    var graph = new Siesta.Framework.Graph();
    graph.baseUri = baseUri;

    for(var i=0; i<parsedTriples.length; i++) {
        var triple = new Siesta.Framework.Triple(Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][0]),
                                                 Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][1]),
                                                 Siesta.Drivers.OAT.__parseReference(baseUri,parsedTriples[i][2]));
        graph.addTriple(triple);
    }

    return graph;
}

/**
 *  Parses a String containing a reference as it has been
 *  parsed by OAT.
 *
 *  @arguments:
 *  - reference: some kind of OAT parsed reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
Siesta.Drivers.OAT.__parseReference = function(baseUri,reference) {
    if(reference.indexOf("http") == 0) {

        return new Siesta.Framework.Uri(reference);

    } else if(reference.indexOf("#") == 0) {

        return new Siesta.Framework.Uri(baseUri+reference);

    } else if(reference.indexOf("_:") == 0) {
        
        return new Siesta.Framework.BlankNode(reference);

    } else {

        return new Siesta.Framework.Literal({value: reference});

    }
};

//Let's register the framework
Siesta.registerFramework("formats/xml");
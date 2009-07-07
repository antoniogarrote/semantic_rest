Siesta.registerNamespace("Siesta","Drivers","W3c","Formats","Rdfa");

/**
 * informs the client that if this parser is synchronous or asynchronous
 */
Siesta.Drivers.W3c.Formats.Rdfa.isParserAsynchronous = function() {
    return true;
}

/**
 *  Parses a HTML enconded RDFa document and returns a
 *  Siesta.Framework.Graph of Siesta.Framework.Triple objects
 *  with the RDF triples encoded in the Turtle document
 *
 *  @arguments
 *  - baseUri: the URI of the document to be parsed.
 *  - doc: a String containing the Turtle document.
 *
 *  @returns
 *  - Siesta.Framework.Graph
 */
Siesta.Drivers.W3c.Formats.Rdfa.parseDoc = function(baseUri, doc /* html with encoded RDFa document string */, callback) {
    // results here
    RDFA.CALLBACK_DONE_PARSING = function() {
        // synchronous is better?
        RDFA.N3_GRAPH.tripleList.baseUri = baseUri;

        callback(baseUri,doc,RDFA.N3_GRAPH);
    }

    RDFA.parse(doc,baseUri);
};

//Let's register the framework
Siesta.registerFramework("formats/rdfa");
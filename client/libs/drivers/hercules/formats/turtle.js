Siesta.registerNamespace("Siesta","Drivers","Hercules","Formats","Turtle");

/**
 * informs the client that if this parser is synchronous or asynchronous
 */
Siesta.Drivers.Hercules.Formats.Turtle.isParserAsynchronous = function() {
    return false;
}

/**
 *  Parses a Turtle enconded RDF document and returns a
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
Siesta.Drivers.Hercules.Formats.Turtle.parseDoc = function(baseUri, doc /* turtle document string */) {
    var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
    turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
    turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
    turtleParser.compileRuleSet();
    var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0(baseUri);
    turtleParser.parse(doc, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);

    var parsedTriples = action.graph.tripleList;

    var graph = new Siesta.Framework.Graph();
    graph.baseUri = baseUri;

    for(var i=0; i<parsedTriples.length; i++) {
        var triple = new Siesta.Framework.Triple(Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].subject),
                                                 Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].predicate),
                                                 Siesta.Drivers.Hercules.__parseReference(parsedTriples[i].object));
        graph.addTriple(triple);
    }

    return graph;
};


/**
 *  Parses a Hercules reference into a Siesta reference
 *
 *  @arguments:
 *  - reference: some kind of Hercules reference
 *
 *  @returns:
 *  - the equivalente Siesta.Framework reference
 */
Siesta.Drivers.Hercules.__parseReference = function(reference) {
    if(reference instanceof Arielworks.Hercules.Rdf.RdfUriRef.prototype.constructor) {

        return new Siesta.Framework.Uri(reference.value);

    } else if(reference instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             type: new Siesta.Framework.Uri(reference.datatypeIri)});

    } else if(reference instanceof Arielworks.Hercules.Rdf.PlainLiteral.prototype.constructor) {

        return new Siesta.Framework.Literal({value: reference.value,
                                             language:  reference.languageTag});

    } else if(reference instanceof Arielworks.Hercules.Rdf.BlankNode.prototype.constructor) {
        return new Siesta.Framework.BlankNode(reference.value);

    } else {
        throw new Exception("Parsing Hercules unknown reference");
    }
};

//Let's register the framework
Siesta.registerFramework("formats/turtle");
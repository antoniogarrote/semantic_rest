Siesta.registerNamespace("Siesta","Drivers","Hercules","Sparql");

/**
 *  Queries a Siesta.Framework.Graph of triples with a certain
 *  SPARQL query passed as a reference.
 *
 *  @arguments:
 *  - graph: a Siesta.Framework.Graph containing Siesta.Framework.Triples.
 *  - sparqlQuery: a string containing a SPARQL query.
 *
 *  @returns:
 *  - A set of result bindings containing Siesta.Framework references.
 */
Siesta.Drivers.Hercules.Sparql.query = function (/* Siesta.Framework.Graph */ graph,
                                                 /* String */ sparqlQuery) {

    var hg = new Arielworks.Hercules.Rdf.Graph();

    var ts = graph.triplesArray();

    for(var i=0; i<ts.length; i++) {
        var t = ts[i];
        hg.addTriple(Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.subject,graph),
                     Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.predicate,graph),
                     Siesta.Drivers.Hercules.__parseSiestaReference(hg,t.object,graph));
    }

    var engine = new Arielworks.Hercules.Sparql.Engine(hg.tripleList);
    var query = engine.prepare(sparqlQuery);
    var results = query.execute();    
    var resultVariables = results.getVariableList();

    var toReturn = [];

    for(var i=0; i< results.length; i++) {
        var result  = results[i];
        var toAdd = {}
        for(j=0; j<resultVariables.length; j++) {
            toAdd[resultVariables[j]] = Siesta.Drivers.Hercules.__parseReference(results[i][resultVariables[j]]);
        }
        toReturn.push(toAdd);
    }

    return toReturn;
};


/**
 *  Transforms a Siesta.Framework object into its Hercules equivalent.
 *
 *  @arguments:
 *  - graph: a Hercules graph where the built reference will be inserted.
 *  - reference: a Siesta reference.
 *
 *  @returns:
 *  - a Hercules equivalent reference.
 *
 *  @throws:
 *  - an exception if the reference passed is of unknown type.
 */
Siesta.Drivers.Hercules.__parseSiestaReference = function(/* Arielworks.Hercules.Graph */ graph,
                                                          /* Siesta.Framework.* */ reference,
                                                          /* Siesta.Framework.Graph */ siestaGraph) {
    if(reference.__type == 'uri') {
        return graph.getRdfUriRef(siestaGraph.__normalizeUri(reference));
    } else if(reference.__type == 'literal') {
        if(reference.type != null) {
            return graph.getTypedLiteral(reference.value,
                                         siestaGraph.__normalizeUri(reference.type));
        } else if(reference.language != null) {
            return graph.getPlainLiteral(reference.value,
                                         reference.language);
        } else {
            return graph.getTypedLiteral(reference.value,
                                         siestaGraph.__normalizeUri(new Siesta.Framework.Uri("http://www.w3.org/2000/01/rdf-schema#Literal")));            
        }
    } else if(reference.__type == 'blanknode') {
        var blankId = reference.value;
        if(typeof blankId == "number") {
            blankId = ""+blankId;
        }
        return graph.getBlankNode(blankId);
    } else {
        throw "Uknown type for Siesta resource: " + reference.__type ;
    }
};


//Let's register the framework
Siesta.registerFramework("sparql");
Screw.Unit(function() {

    describe('Siesta.Drivers.Hercules.Sparql',function() {

	describe('#query',function() {

            it("should query a Siesta.Framework Graph with a given Sparql query returning a set of bindings",
               function() {

                   var graphTest = '@prefix foaf:  <http://xmlns.com/foaf/0.1/> .\n_:a  foaf:name   "Johnny Lee Outlaw" .\n_:a  foaf:mbox   <mailto:jlow@example.com> .\n_:b  foaf:name   "Peter Goodguy" .\n_:b  foaf:mbox   <mailto:peter@example.org> .\n_:c  foaf:mbox   <mailto:carol@example.org> .';
                   
                   var graph = Siesta.Drivers.Hercules.Formats.Turtle.parseDoc("",graphTest);

                   var query = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\nSELECT ?name ?mbox\nWHERE  {\n    ?x foaf:name ?name .\n    ?x foaf:mbox ?mbox .\n}';

                   var result = Siesta.Drivers.Hercules.Sparql.query(graph,query);

		   expect(result.length == 2).to(equal,true);
	       });
        });

	describe('#__parseSiestaReference',function() {

            it("should parse correctly a Siesta.Framework.BlankNode",
               function() {
                   var test = new Siesta.Framework.BlankNode("a");
                   var hg = new Arielworks.Hercules.Rdf.Graph();
                   var g = new Siesta.Framework.Graph();
		   expect(Siesta.Drivers.Hercules.__parseSiestaReference(hg,test,g) instanceof Arielworks.Hercules.Rdf.BlankNode.prototype.constructor).to(equal,true);
	       });

	    it("should parse correctly a Siesta.Framework.Uri",
               function() {
                   var test = new Siesta.Framework.Uri("http://test.com");
                   var hg = new Arielworks.Hercules.Rdf.Graph();
                   var g = new Siesta.Framework.Graph();
		   expect(Siesta.Drivers.Hercules.__parseSiestaReference(hg,test,g) instanceof Arielworks.Hercules.Rdf.RdfUriRef.prototype.constructor).to(equal,true);
	       });

	    it("should parse correctly a Siesta.Framework.Literal with language",
               function() {
                   var test = new Siesta.Framework.Literal({value: "test", language: "es_ES"});
                   var hg = new Arielworks.Hercules.Rdf.Graph();
                   var g = new Siesta.Framework.Graph();
		   expect(Siesta.Drivers.Hercules.__parseSiestaReference(hg,test,g) instanceof Arielworks.Hercules.Rdf.PlainLiteral.prototype.constructor).to(equal,true);
	       });

	    it("should parse correctly a Siesta.Framework.Literal with type",
               function() {
                   var test = new Siesta.Framework.Literal({value: "test", type: new Siesta.Framework.Uri("http://test.com")});
                   var hg = new Arielworks.Hercules.Rdf.Graph();
                   var g = new Siesta.Framework.Graph();
		   expect(Siesta.Drivers.Hercules.__parseSiestaReference(hg,test,g) instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor).to(equal,true);
	       });

	    it("should parse correctly a Siesta.Framework.Literal without language or type",
               function() {
                   var test = new Siesta.Framework.Literal({value: "test"});
                   var hg = new Arielworks.Hercules.Rdf.Graph();
                   var g = new Siesta.Framework.Graph();
		   expect(Siesta.Drivers.Hercules.__parseSiestaReference(hg,test,g) instanceof Arielworks.Hercules.Rdf.TypedLiteral.prototype.constructor).to(equal,true);
	       });
        });

    });

});

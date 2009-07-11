Screw.Unit(function() {

    describe('Siesta.Drivers.W3c.Formats.Rdfa',function() {

	describe('#parseDoc',function() {

	    it("should parse correctly a RDFa document with a Hercules parser",
               function() {
                   var rdfaDoc = fixtureRdfaData1;
                   debugger;
                   var rdfaDoc = Siesta.Utils.htmlParser(rdfaDoc)
                   var graph = Siesta.Drivers.W3c.Formats.Rdfa.parseDoc("",rdfaDoc,function(baseUri,doc,graph){
                       debugger;
		       expect(graph.triplesArray().length == 14).to(equal,true);
                   });

	       });
        });

    });

});

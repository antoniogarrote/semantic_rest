Screw.Unit(function() {

    describe('Siesta.Drivers.OAT.Formats.Xml',function() {

	describe('#parseDoc',function() {

	    it("should parse correctly a Turtle document with a OAT parser",
               function() {

                   var graphTest = '<?xml version="1.0"?><!DOCTYPE rdf:RDF [<!ENTITY owl "http://www.w3.org/2002/07/owl#" ><!ENTITY xsd "http://www.w3.org/2001/XMLSchema#" ><!ENTITY owl2xml "http://www.w3.org/2006/12/owl2-xml#" ><!ENTITY rdfs "http://www.w3.org/2000/01/rdf-schema#" ><!ENTITY rdf "http://www.w3.org/1999/02/22-rdf-syntax-ns#" ><!ENTITY Ontology1241974024971 "http://www.semanticweb.org/ontologies/2009/4/Ontology1241974024971.owl#" >]><rdf:RDF xmlns="http://www.semanticweb.org/ontologies/2009/4/Ontology1241974024971.owl#" xml:base="http://www.semanticweb.org/ontologies/2009/4/Ontology1241974024971.owl" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:owl2xml="http://www.w3.org/2006/12/owl2-xml#" xmlns:Ontology1241974024971="http://www.semanticweb.org/ontologies/2009/4/Ontology1241974024971.owl#" xmlns:owl="http://www.w3.org/2002/07/owl#" xmlns:xsd="http://www.w3.org/2001/XMLSchema#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><owl:Ontology rdf:about=""/><owl:DatatypeProperty rdf:about="#test"><rdfs:range rdf:resource="&rdfs;Literal"/></owl:DatatypeProperty><rdf:Description rdf:about="#adfas"><test rdf:datatype="&rdfs;Literal">dfasdfasdf</test></rdf:Description></rdf:RDF>';

                   var graph = Siesta.Drivers.OAT.Formats.Xml.parseDoc("http://test.com",graphTest);

		   expect(graph.triplesArray().length == 4).to(equal,true);
	       });
        });

	describe('#__parseReference',function() {

	    it("should parse correctly a OAT parsed BlankNode string",
               function() {
		   expect(Siesta.Drivers.OAT.__parseReference("test","_:a").__type == 'blanknode').to(equal,true);
	       });

	    it("should parse correctly a OAT parsed URI string",
               function() {
		   expect(Siesta.Drivers.OAT.__parseReference("test","http://test.com").__type == 'uri').to(equal,true);
		   expect(Siesta.Drivers.OAT.__parseReference("test","#a").__type == 'uri').to(equal,true);
		   expect(Siesta.Drivers.OAT.__parseReference("test","#a").value == 'test#a').to(equal,true);
	       });

	    it("should parse correctly a OAT parsed Literal",
               function() {
		   expect(Siesta.Drivers.OAT.__parseReference("test","testsw").__type == 'literal').to(equal,true);
	       });

	});

    });

});

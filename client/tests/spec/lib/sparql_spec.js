Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.Resource',function() {

	describe('#initialize',function() {

	    it("should create a new Resource object with the constructor argument as value",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.Resource("test");
		   expect(testResource.getValue()).to(equal,"test");
	       });

	});

	describe('#setValue',function() {

	    it("should change the value stored in the resource",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.Resource("test");
		   testResource.setValue("adios");
		   expect(testResource.getValue()).to(equal,"adios");
	       });

	});

	describe('#getValue',function() {

	    it("should return the value stored in the resource",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.Resource("test");
		   expect(testResource.getValue()).to(equal,"test");
	       });

	});

	describe('#equals',function() {

	    it("should check if two objects are equal by checking its type and stored value",
               function() {
		   var testResourceA = new Siesta.Hercules.Rdf.Resource("test");
		   var testResourceB = new Siesta.Hercules.Rdf.Resource("test");
		   expect(testResourceA.equals(testResourceB)).to(equal,true);
	       });

	});

    });

});

Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.RdfUriRef',function() {

	describe('#initialize',function() {

	    it("should create a new RdfUriRef object with the constructor argument as value normalized",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/test");
		   expect(testResource.getValue()).to(equal,"http://test.com/test");
	       });

	});

	//TODO: more tests

    });
});

Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.Literal',function() {

	describe('#initialize',function() {

	    it("should create a new Literal object with the constructor argument as value normalized",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.Literal("test");
		   expect(testResource.getValue()).to(equal,"test");
	       });

	});

    });
});

Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.PlainLiteral',function() {

	describe('#initialize',function() {

	    it("should create a new PlainLiteral object with the value and language tag asignated",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.PlainLiteral("test","es-ES");
		   expect(testResource.getValue()).to(equal,"test");
	       });

	});

	describe('#setLanguageTag',function() {

	    it("should change the language tag assignated to the plain literal",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.PlainLiteral("test","es-ES");
		   testResource.setLanguageTag("fr-FR");
		   expect(testResource.getLanguageTag()).to(equal,"fr-FR");
	       });

	});

	describe('#getLanguageTag',function() {

	    it("should return the language tag assignated to the plain literal",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.PlainLiteral("test","es-ES");
		   expect(testResource.getLanguageTag()).to(equal,"es-ES");
	       });

	});

	describe('#equals',function() {

	    it("should check if two plain literals are equal",
               function() {
		   var testResourceA = new Siesta.Hercules.Rdf.PlainLiteral("test","es-ES");
		   var testResourceB = new Siesta.Hercules.Rdf.PlainLiteral("test","es-ES");
		   expect(testResourceA.equals(testResourceB)).to(equal,true);
	       });

	    it("should return false if an not plain literal object is compared to a plain literal",
               function() {
		   var testResourceA = new Siesta.Hercules.Rdf.PlainLiteral("test","es-ES");
		   var testResourceB = { value: "test", languageTag: "es-es" };
		   expect(testResourceA.equals(testResourceB)).to(equal,false);
	       });

	});

    });
});

Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.TypedLiteral',function() {

	describe('#initialize',function() {

	    it("should create a new TypedLiteral object with the value and datatype asignated",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.TypedLiteral("test","test:String");
		   expect(testResource.getValue()).to(equal,"test");
	       });

	});

	describe('#setDatatypeIri',function() {

	    it("should change the datatype assignated to the typed literal",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.TypedLiteral("test","test:String");
		   testResource.setDataTypeIri("test:Number");
		   expect(testResource.getDataTypeIri()).to(equal,"test:Number");
	       });

	});

	describe('#getDataTypeIri',function() {

	    it("should return the language tag assignated to the plain literal",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.TypedLiteral("test","test:String");
		   expect(testResource.getDataTypeIri()).to(equal,"test:String");
	       });

	});

	describe('#equals',function() {

	    it("should check if two typed literals are equal",
               function() {
		   var testResourceA = new Siesta.Hercules.Rdf.TypedLiteral("test","test:String");
		   var testResourceB = new Siesta.Hercules.Rdf.TypedLiteral("test","test:String");
		   expect(testResourceA.equals(testResourceB)).to(equal,true);
	       });

	});

    });
});

Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.BlankNode',function() {

	describe('#initialize',function() {

	    it("should create a new BlankNode object with the constructor argument as value normalized",
               function() {
		   var testResource = new Siesta.Hercules.Rdf.BlankNode("1");
		   expect(testResource.getValue()).to(equal,"1");
	       });

	});

    });
});

Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.Triple',function() {

	describe('#initialize',function() {

	    it("should create a new Triple object with the constructor arguments for subject, predicate and object",
               function() {
		   var subj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/subj");
		   var pred = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/verb");
		   var obj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/obj");
		   var testResource = new Siesta.Hercules.Rdf.Triple(subj,pred,obj);

		   expect(testResource.getSubject()).to(equal,subj);
		   expect(testResource.getPredicate()).to(equal,pred);
		   expect(testResource.getObject()).to(equal,obj);
	       });

	});

	describe('#setSubject',function() {

	    it("should change the subject of the triple with the given resource",
               function() {
		   var subj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/subj");
		   var pred = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/verb");
		   var obj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/obj");

		   var testResource = new Siesta.Hercules.Rdf.Triple(subj,pred,obj);

		   var obj_bis = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/objC");

		   testResource.setSubject(obj_bis);
		   expect(testResource.getSubject()).to(equal,obj_bis);		   
	       });

	});	

	describe('#setPredicate',function() {

	    it("should change the subject of the triple with the given resource",
               function() {
		   var subj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/subj");
		   var pred = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/verb");
		   var obj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/obj");

		   var testResource = new Siesta.Hercules.Rdf.Triple(subj,pred,obj);

		   var obj_bis = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/objC");

		   testResource.setPredicate(obj_bis);
		   expect(testResource.getPredicate()).to(equal,obj_bis);		   
	       });

	});	

	describe('#setObject',function() {

	    it("should change the subject of the triple with the given resource",
               function() {
		   var subj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/subj");
		   var pred = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/verb");
		   var obj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/obj");

		   var testResource = new Siesta.Hercules.Rdf.Triple(subj,pred,obj);

		   var obj_bis = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/objC");

		   testResource.setObject(obj_bis);
		   expect(testResource.getObject()).to(equal,obj_bis);		   
	       });

	});	

	describe('#equals',function() {

	    it("should check if two triples are equal, if the have same subjec, predicate and object",
               function() {
		   var subj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/subj");
		   var pred = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/verb");
		   var obj = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/obj");

		   var testResource = new Siesta.Hercules.Rdf.Triple(subj,pred,obj);
		   var testResourceBis = new Siesta.Hercules.Rdf.Triple(subj,pred,obj);

		   var obj_bis = new Siesta.Hercules.Rdf.RdfUriRef("http://test.com/objC");

		   expect(testResource.equals(testResourceBis)).to(equal,true);		   

		   testResourceBis.setSubject(testResourceBis);

		   expect(testResource.equals(testResourceBis)).to(equal,false);		   
	       });

	});	

    });
});
/*
Screw.Unit(function() {

    describe('Siesta.Hercules.Rdf.RdfUriRefInGraph',function() {

	describe('#initialize',function() {

	    it("should create a new RdfUriRefInGraph object for a given graph, resourceId and URI",
               function() {
                   var graph = new Siesta.Hercules.Rdf.Graph();
                   var testResource = new Siesta.Hercules.Rdf.RdfUriRefInGraph(graph,0,"http://test.com");
		   expect(testResource.graph).to(equal,graph);
		   expect(testResource.resourceId).to(equal,0);
		   expect(testResource.value).to(equal,"http://test.com");
	       });

	});

    });
});
*/
Screw.Unit(function() {

    describe('Siesta',function() {

	describe('#defined',function() {

	    it("should return true if the symbol in the provided lambda function is defined",
               function() {
		   expect(Siesta.defined(function(){
		       Siesta.defined })).to(equal,true);
	       });

	    it("should return false if the symbol in provided lambda function is not defined",
	       function() {
		   expect(Siesta.defined(function() {
		       not_defined_afasfdasdfasdf
		   })).to(equal,false);
	       });

	});


	describe('#load',function() {

	    it("should load the required script from the server",
               function() {
                   Siesta.load(Siesta.currentPath(), "fixtures", "foo.js");
		   expect(fooWarn()).to(equal,"foo");
	       });

	});

        describe('#registerNamespace',function() {

	    it("should create a new object in the provided namespace",
               function() {
                   Siesta.registerNamespace("Test","Hello");
		   expect(typeof Test.Hello == "object").to(equal,true);
	       });

	    it("should not overwrite an existing namespace",
	       function() {
                   Test = {};
                   Test.Hello = {a: "test"};
                   expect(Test.Hello.a == "test").to(equal,true);
                   Siesta.registerNamespace("Test","Hello")
                   expect(Test.Hello.a == "test").to(equal,true);
	       });

	});

    });

});

Screw.Unit(function() {

    describe('Siesta.Framework.Namespace',function() {

	describe('#initialize',function() {

	    it("should create a new namespace with the given name and uri",
               function() {
                   var test = new Siesta.Framework.Namespace("test","uri");
		   expect(test.name == "test").to(equal,true);
		   expect(test.uri == "uri").to(equal,true);
	       });

        });

    });

});


Screw.Unit(function() {

    describe('Siesta.Framework.Uri',function() {

	describe('#initialize',function() {

	    it("should create a new Uri with the given namespace and value",
               function() {
                   var test = new Siesta.Framework.Uri("test","uri");
		   expect(test.namespace == "test").to(equal,true);
		   expect(test.value == "uri").to(equal,true);
	       });

	    it("should create a new Uri with the given value and null namespace",
               function() {
                   var test = new Siesta.Framework.Uri("uri");
		   expect(test.namespace == null).to(equal,true);
		   expect(test.value == "uri").to(equal,true);
	       });

        });

	describe('#toString',function() {

	    it("should return a String with namespace and value if both values are set",
               function() {
                   var test = new Siesta.Framework.Uri("test","uri");
		   expect(test.toString() == "testuri").to(equal,true);
	       });

	    it("should create a String only with the value if no namespace is given",
               function() {
                   var test = new Siesta.Framework.Uri("uri");
		   expect(test.toString() == "uri").to(equal,true);
	       });

        });

    });

});

Screw.Unit(function() {

    describe('Siesta.Framework.Literal',function() {

	describe('#initialize',function() {

	    it("should create a new Literal with the given value, language tag and type tag",
               function() {
                   var t = new Siesta.Framework.Uri("c");
                   var test = new Siesta.Framework.Literal({value: "a", language:"b", type:t});
                   expect(test.value == "a").to(equal,true);
		   expect(test.language == "b").to(equal,true);
		   expect(test.type == "c").to(equal,true);
	       });

	    it("should create a new Uri with the given value and null language tag",
               function() {
                   var test = new Siesta.Framework.Literal({value: "a", language:"b" });
		   expect(test.value == "a").to(equal,true);
		   expect(test.language == "b").to(equal,true);
		   expect(test.type == null).to(equal,true);
	       });

	    it("should create a new Uri with the given value and null language tag and type tag",
               function() {
                   var test = new Siesta.Framework.Literal({value: "a"});
		   expect(test.value == "a").to(equal,true);
		   expect(test.language == null).to(equal,true);
		   expect(test.type == null).to(equal,true);
	       });

        });

	describe('#toString',function() {

	    it("should return a String with value, language and type if all values are set",
               function() {
                   var t = new Siesta.Framework.Uri("c");
                   var test = new Siesta.Framework.Literal({value:'a', language:'b', type:t});
		   expect(test.toString() == '"a"^^c@b').to(equal,true);
	       });

	    it("should create a String only with the value and given prts",
               function() {
                   var t = new Siesta.Framework.Uri("c");

                   var test = new Siesta.Framework.Literal({value:'a', language:'b'});
		   expect(test.toString() == '"a"@b').to(equal,true);

                   test = new Siesta.Framework.Literal({value:'a', type:t});
		   expect(test.toString() == '"a"^^c').to(equal,true);
	       });

        });

    });

});


Screw.Unit(function() {

    describe('Siesta.Framework.Triple',function() {

	describe('#initialize',function() {

	    it("should create a new triple with the given subject, predicate and object",
               function() {
                   var test = new Siesta.Framework.Triple("a","b","c");
		   expect(test.subject == "a").to(equal,true);
		   expect(test.predicate == "b").to(equal,true);
		   expect(test.object == "c").to(equal,true);
	       });

	    it("should create a new triple with the given subject and predicate if only two arguments given",
               function() {
                   var test = new Siesta.Framework.Triple("a","b");
		   expect(test.subject == "a").to(equal,true);
		   expect(test.predicate == "b").to(equal,true);
		   expect(test.object == null).to(equal,true);
	       });

	    it("should create a new triple with the given subject if only one argument given",
               function() {
                   var test = new Siesta.Framework.Triple("a");
		   expect(test.subject == "a").to(equal,true);
		   expect(test.predicate == null).to(equal,true);
		   expect(test.object == null).to(equal,true);
	       });

	    it("should create a new triple with null components if no arguments are given",
               function() {
                   var test = new Siesta.Framework.Triple();
		   expect(test.subject == null).to(equal,true);
		   expect(test.predicate == null).to(equal,true);
		   expect(test.object == null).to(equal,true);
	       });

	});

        describe('#isValid',function() {

            it("should return true if all the components have value",
               function() {
                   var test = new Siesta.Framework.Triple("a","b","c");
                   expect(test.isValid() == true).to(equal,true);
               });

            it("should return false if some component in triple is null",
               function() {
                   var test = new Siesta.Framework.Triple("a","b");
                   expect(test.isValid() == false).to(equal,true);

                   test = new Siesta.Framework.Triple("a");
                   expect(test.isValid() == false).to(equal,true);

                   test = new Siesta.Framework.Triple();
                   expect(test.isValid() == false).to(equal,true);
               });
        });

    });

});

Screw.Unit(function() {

    describe('Siesta.Framework.Graph',function() {

	describe('#addNamespace',function() {

	    it("should register a new Siesta.Framework.Namespace to this graph",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var ns = new Siesta.Framework.Namespace("a","b");
                   g.addNamespace(ns);


                   expect(g.namespaces["a"] == "b").to(equal,true);
                   expect(g.invNamespaces["b"] == "a").to(equal,true);
	       });

        });

	describe('#addTriple',function() {

	    it("should store a new triple in the graph",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   expect(g.triples[g.__normalizeUri(u)] == null).to(equal,true);

                   var result = g.addTriple(t);

                   expect(g.triples[g.__normalizeUri(u)][g.__normalizeUri(u)][g.__normalizeUri(u)] == t).to(equal,true);
	       });

	    it("should store a new triple in the triplesCache",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   expect(g.triples[g.__normalizeUri(u)] == null).to(equal,true);
                   expect(g.triplesCache.length == 0).to(equal,true);

                   var result = g.addTriple(t);

                   expect(g.triples[g.__normalizeUri(u)][g.__normalizeUri(u)][g.__normalizeUri(u)] == t).to(equal,true);
                   expect(g.triplesCache.length == 1).to(equal,true);
	       });

	    it("should not store a new triple in the triplesCache if it was already inserted",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   expect(g.triples[g.__normalizeUri(u)] == null).to(equal,true);
                   expect(g.triplesCache.length == 0).to(equal,true);

                   var result = g.addTriple(t);

                   expect(g.triples[g.__normalizeUri(u)][g.__normalizeUri(u)][g.__normalizeUri(u)] == t).to(equal,true);
                   expect(g.triplesCache.length == 1).to(equal,true);

                   result = g.addTriple(t);
                   expect(g.triplesCache.length == 1).to(equal,true);
	       });
        });

	describe('#triplesArray',function() {

	    it("should return all the stored triples as an array",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   expect(g.triplesArray().length == 0).to(equal,true);

                   var result = g.addTriple(t);

                   expect(g.triplesArray().length == 1).to(equal,true);
	       });

        });

	describe('#__normalizeLiteral',function() {

	    it("should normalize the Literal if the namespace for the literal datatype is registered in the graph",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var ns = new Siesta.Framework.Namespace("a","b");
                   g.addNamespace(ns);

                   var u = new Siesta.Framework.Uri("a","c");
                   var l = new Siesta.Framework.Literal({value:"v", type:u});

                   expect(g.__normalizeLiteral(l) == '"v"^^bc').to(equal,true);
	       });

        });

	describe('#__addTripleBySubject',function() {

	    it("should create a new hash for the given normalized key triple subject if the key doesn't exist in the triples array",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   expect(g.triples[g.__normalizeUri(u)] == null).to(equal,true);

                   g.__addTripleBySubject(t);

                   expect(typeof g.triples[g.__normalizeUri(u)] == "object").to(equal,true);
	       });

	    it("should return the existent hash for the given normalized key triple subject if the key already exists in the triples array",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   expect(g.triples[g.__normalizeUri(u)] == null).to(equal,true);
                   g.triples[g.__normalizeUri(u)] = {a: "test"};

                   g.__addTripleBySubject(t);

                   expect(typeof g.triples[g.__normalizeUri(u)] == "object").to(equal,true);
                   expect(g.triples[g.__normalizeUri(u)]["a"] == "test").to(equal,true);
	       });

        });

	describe('#__addTripleByPredicate',function() {

	    it("should create a new hash for the given normalized key triple predicate if the key doesn't exist in the triples array",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var prev = {};
                   var res = g.__addTripleByPredicate(t,prev);

                   expect(typeof res == "object").to(equal,true);
                   expect(typeof prev[g.__normalizeUri(u)] == "object").to(equal,true);
	       });

	    it("should return the existent hash for the given normalized key triple predicate if the key already exists in the triples array",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var id = g.__normalizeUri(u);
                   var prev = {};
                   prev[id] = "test";
                   var res = g.__addTripleByPredicate(t,prev);

                   expect(res == "test").to(equal,true);
	       });

        });

	describe('#__addTripleByObject',function() {

	    it("should insert the triple for the given normalized key triple object if the key doesn't exist in the triples array",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var prev = {};
                   var result = g.__addTripleByObject(t,prev);

                   expect(typeof prev[g.__normalizeUri(u)] == "object").to(equal,true);
                   expect(result).to(equal,true);
                   expect(prev[g.__normalizeUri(u)] == t).to(equal,true);

                   result = g.__addTripleByObject(t,prev);
                   expect(result).to(equal,false);
	       });

	    it("should return true if the triplet was inserted",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var prev = {};
                   var result = g.__addTripleByObject(t,prev);

                   expect(typeof prev[g.__normalizeUri(u)] == "object").to(equal,true);
                   expect(result).to(equal,true);
                   expect(prev[g.__normalizeUri(u)] == t).to(equal,true);
	       });

	    it("should return false if the triplet was already inserted",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var prev = {};
                   var result = g.__addTripleByObject(t,prev);

                   expect(typeof prev[g.__normalizeUri(u)] == "object").to(equal,true);
                   expect(result).to(equal,true);
                   expect(prev[g.__normalizeUri(u)] == t).to(equal,true);

                   result = g.__addTripleByObject(t,prev);
                   expect(result).to(equal,false);
	       });

        });

    });
});

Screw.Unit(function() {

    describe('Siesta.Model.Repositories',function() {

	describe('.services',function() {

	    it("should mantain a graph repository for the services at Siesta.Model.Repositories.services",
               function() {
                   expect(Siesta.Model.Repositories.services != null).to(equal,true);
	       });

        });

	describe('.schemas',function() {

	    it("should mantain a graph repository for the schemas at Siesta.Model.Repositories.schemas",
               function() {
                   expect(Siesta.Model.Repositories.schemas != null).to(equal,true);
	       });

        });


	describe('.data',function() {

	    it("should mantain a graph repository for the data at Siesta.Model.Repositories.data",
               function() {
                   expect(Siesta.Model.Repositories.data != null).to(equal,true);
	       });

        });
    });
});

Screw.Unit(function() {

    describe('Siesta.Framework.Common',function() {

	describe('.determineFormat',function() {

	    it("should check a RDF/XML document correctly",
               function() {
                   var doc = "<rdf:RDF  xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'  xmlns:s='http://www.w3.org/2000/01/rdf-schema#' xmlns:sawsdl='http://www.w3.org/ns/sawsdl#' xmlns:wsl='http://www.wsmo.org/ns/wsmo-lite#' xmlns:hr='http://www.wsmo.org/ns/hrests#'> <rdf:Description rdf:about='http://localhost:3000/schemas/services/BookService'> </rdf:Description> </rdf>";

                   expect(Siesta.Framework.Common.determineFormat(doc)).to(equal,"xml");

                   var doc = "<?xml version='1.0'?><rdf:RDF  xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'  xmlns:s='http://www.w3.org/2000/01/rdf-schema#' xmlns:sawsdl='http://www.w3.org/ns/sawsdl#' xmlns:wsl='http://www.wsmo.org/ns/wsmo-lite#' xmlns:hr='http://www.wsmo.org/ns/hrests#'> <rdf:Description rdf:about='http://localhost:3000/schemas/services/BookService'> </rdf:Description> </rdf>";
                   expect(Siesta.Framework.Common.determineFormat(doc)).to(equal,"xml");
	       });

	    it("should check a RDF N3/Turtle document correctly",
               function() {
                   var doc = "@prefix sawsdl: <http://www.w3.org/ns/sawsdl#> . <http://localhost:3000/schemas/services/BookService> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service .";

                   expect(Siesta.Framework.Common.determineFormat(doc)).to(equal,"turtle");
	       });

	    it("should raise an exception if the format cannot be determined",
               function() {
                   var doc = "foo formated";

                   try {
                       Siesta.Framework.Common.determineFormat(doc);
                       expect(true).to(equal,false);
                   } catch(e) {
                       expect(true).to(equal,true);
                   }

	       });
        });

    });
});


Screw.Unit(function() {

    describe('Siesta.Services',function() {

	  describe('.registerService',function() {

	    it("should make a jsonp request to the provided URL of the service if 'jsonp' mechanism is specified, using by default 'callback' as the name of the callback parameter",
               function() {
                   var mockControl = new MockControl();
                   var networkMock = mockControl.createMock(Siesta.Network);
                   networkMock.expect().jsonpRequest("test","callback","Siesta.Services.onRegisteredServiceJsonp");

                   var oldNetwork = Siesta.Network;
                   Siesta.Network = networkMock;

                   Siesta.Services.registerService("test","jsonp");

                   try {
                       mockControl.verify();
                       expect(true).to(equal,true);
                   } catch(e) {
                       expect(true).to(equal,false);
                   } finally {
                       Siesta.Network = oldNetwork;
                   }
	       });

	    it("should make a jsonp request to the provided URL of the service if 'jsonp' mechanism is specified, using the passed value for the callback parameter",
               function() {
                   var mockControl = new MockControl();
                   var networkMock = mockControl.createMock(Siesta.Network);
                   networkMock.expect().jsonpRequest("test","myCallback","Siesta.Services.onRegisteredServiceJsonp");

                   var oldNetwork = Siesta.Network;
                   Siesta.Network = networkMock;

                   Siesta.Services.registerService("test","jsonp","myCallback");

                   try {
                       mockControl.verify();
                       expect(true).to(equal,true);
                   } catch(e) {
                       expect(true).to(equal,false);
                   } finally {
                       Siesta.Network = oldNetwork;
                   }
	       });

        });

	describe('.onRegisterServiceJsonp',function() {

            it("should parse correctly the returned N3 graph and add it to the services graph",
            function() {
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();

                try {
                    expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                    Siesta.Services.onRegisteredServiceJsonp(fixtureN3Data1);
                    expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);
                } catch(e) {
                    expect(true).to(equal,false);
                }
            });

        });
    });

    describe('Siesta.Services.RestfulOperationInputMessage',function() {

	   describe('.modelReference',function() {
               it("should parse the modelReference property of the RestfulOperationInputMessage element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/wsmo-lite#hasInputMessage> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> }";

                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[0].uri.toString();
                          var message = new Siesta.Services.RestfulOperationInputMessage(_uri);
                          expect(message.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);
                      }

                  });
           });

	   describe('.loweringSchemaMapping',function() {
               it("should parse the loweringSchemaMapping property of the RestfulOperationInputMessage element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/wsmo-lite#hasInputMessage> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> }";

                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[0].uri.toString();
                          var message = new Siesta.Services.RestfulOperationInputMessage(_uri);
                          expect(message.loweringSchemaMapping() == "http://localhost:3000/schemas/lowering/Book/create.sparql").to(equal,true);
                      }

                  });
           });

	   describe('.connect',function() {
               it("should try to retrieve the model and lowering schema from the remote server",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/wsmo-lite#hasInputMessage> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> }";

                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[0].uri.toString();
                          var message = new Siesta.Services.RestfulOperationInputMessage(_uri);
                          expect(message.loweringSchemaMapping() == "http://localhost:3000/schemas/lowering/Book/create.sparql").to(equal,true);
                          var that = this;
                          Siesta.Events.addListener(message,message.EVENT_MESSAGE_LOADED,that,function(event,msg) {
                              Siesta.Events.removeListener(message,message.EVENT_MESSAGE_LOADED,that);
                              expect(msg.model().uri == "http://localhost:3000/schemas/models/Book").to(equal,true);
                              expect(msg.loweringSchemaMappingContent != null).to(equal,true);
                              expect(msg.connected).to(equal,true);
                          });
                          message.connect("jsonp");
                      }

                  });
           });

    });

    describe('Siesta.Services.RestfulOperationOutputMessage',function() {

	   describe('.modelReference',function() {
               it("should parse the modelReference property of the RestfulOperationOutputMessage element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/wsmo-lite#hasOutputMessage> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> }";

                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[0].uri.toString();
                          var message = new Siesta.Services.RestfulOperationOutputMessage(_uri);
                          expect(message.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);
                      }

                  });
           });

	   describe('.liftingSchemaMapping',function() {
               it("should parse the liftingSchemaMapping property of the RestfulOperationOutputMessage element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/wsmo-lite#hasOutputMessage> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> }";

                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[1].uri.toString();
                          var message = new Siesta.Services.RestfulOperationOutputMessage(_uri);
                          expect(message.liftingSchemaMapping() == "http://localhost:3000/schemas/lowering/Book/lifting.xslt").to(equal,true);
                      }

                  });
           });


        describe('.connect',function() {
               it("should parse the liftingSchemaMapping value and retrieve the operation from the remote server",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data4);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/wsmo-lite#hasOutputMessage> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://www.wsmo.org/ns/wsmo-lite#Message> }";

                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[1].uri.toString();
                          var message = new Siesta.Services.RestfulOperationOutputMessage(_uri);
                          var that = this;
                          Siesta.Events.addListener(message,message.EVENT_CONNECTED,that,function(event,operation) {
                              Siesta.Events.removeListener(message,message.EVENT_CONNECTED,that);
                              expect(message.liftingSchemaMappingContent != null).to(equal,true);
                          });

                          message.connect('jsonp');
                      }
                  });
           });

    });

    describe('Siesta.Services.RestfulOperationInputParameter',function() {

	   describe('.type',function() {
               it("should parse the type property of the RestfulOperationInputParameter element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/hrests#hasInputParameter> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://semantic_rest.org/ns/hrests_js#JSONPCallback> }";
                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);
                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[0].uri.toString();
                          var message = new Siesta.Services.RestfulOperationInputParameter(_uri);
                          expect(message.type() == "http://semantic_rest.org/ns/hrests_js#JSONPCallback").to(equal,true);
                      }

                  });
           });

	   describe('.parameterName',function() {
               it("should parse the parameterName property of the RestfulOperationInputParameter element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var query = "SELECT ?uri WHERE { ?x <http://www.wsmo.org/ns/hrests#hasInputParameter> ?uri .";
                      query = query + " ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> " + "<http://semantic_rest.org/ns/hrests_js#JSONPCallback> }";
                      var result = Siesta.Sparql.query(Siesta.Model.Repositories.services,query);

                      if(result.length == 0) {
                          expect(true).to(equal,false);
                      } else {
                          var _uri = result[0].uri.toString();
                          var message = new Siesta.Services.RestfulOperationInputParameter(_uri);
                          expect(message.parameterName() == "callback").to(equal,true);
                      }

                  });
           });

    });

    describe('Siesta.Services.RestfulOperation',function() {

	   describe('.label',function() {
               it("should parse the label property of the RestfulOperation element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.label() == "creates a new Book resource").to(equal,true);
                  });
           });

	   describe('.method',function() {
               it("should parse the method property of the RestfulOperation element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.method() == "POST").to(equal,true);
                  });
           });

	   describe('.address',function() {
               it("should parse the address property of the RestfulOperation element",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.address() == "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}").to(equal,true);
                  });
           });

	   describe('.inputMessages',function() {
               it("should parse all the input messages creating an array of RestfulOperationInputMessages with the parsed messages",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.inputMessages().length == 1).to(equal,true);
                      operation.inputMessages()[0].loweringSchemaMapping();
                      expect(operation.inputMessages()[0].loweringSchemaMapping() == "http://localhost:3000/schemas/lowering/Book/create.sparql").to(equal,true);
                  });
           });

	   describe('.outputMessage',function() {
               it("should parse the output message if associated to this operations returning a RestfulOperationOutputMessage",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data2);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#showBook");
                      operation.outputMessage().liftingSchemaMapping();
                      expect(operation.outputMessage().liftingSchemaMapping() == "http://localhost:3000/schemas/lowering/Book/lifting.xslt").to(equal,true);
                  });
           });

	   describe('.inputParameters',function() {
               it("should parse all the input parameters creating an array of RestfulOperationInputParameters with the parsed parameters",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.inputParameters().length == 1).to(equal,true);
                      operation.inputParameters()[0].parameterName();
                      expect(operation.inputParameters()[0].parameterName() == "callback").to(equal,true);
                  });
           });

        describe('.connect',function() {
               it("should parse all the input parameters creating an array of RestfulOperationInputParameters with the parsed parameters",
                  function() {
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);
                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      var that = this;
                      Siesta.Events.addListener(operation,operation.EVENT_CONNECTED,that,function(event,operation) {
                          Siesta.Events.removeListener(operation,operation.EVENT_CONNECTED,that);
                          expect(operation.inputMessages()[0].loweringSchemaMappingContent != null).to(equal,true);
                      });
                      operation.connect('jsonp');
                  });
           });

    });


    describe('Siesta.Model.Schema',function() {

	describe('.modelReference',function() {

            it("should retrieve the model reference associated to this service from the repository",
               function() {
                   Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length == 0).to(equal,true);
                   var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data3);
                   Siesta.Model.Repositories.schemas = graph;
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length > 0).to(equal,true);

                   var model = new Siesta.Model.Schema("http://localhost:3000/schemas/models/Book");
                   expect(model.type() == "http://www.w3.org/2000/01/rdf-schema#Class").to(equal,true);
               });

        });

	describe('.properties',function() {

            it("should retrieve the properties associated to this model and its ranges",
               function() {
                   Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length == 0).to(equal,true);
                   var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data3);
                   Siesta.Model.Repositories.schemas = graph;
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length > 0).to(equal,true);

                   var model = new Siesta.Model.Schema("http://localhost:3000/schemas/models/Book");
                   expect(model.properties().length == 7).to(equal,true);
               });

        });
    })

    describe('Siesta.Services.RestfulService',function() {

	   describe('.modelReference',function() {

            it("should retrieve the model reference associated to this service from the repository",
            function() {
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);
            });

        });


       describe('.isDefinedBy',function() {

            it("should retrieve the service uri of this service from the repository",
            function() {
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.isDefinedBy() == "http://localhost:3000/schemas/services/BookService").to(equal,true);
            });

       });

	describe('.operationsUris',function() {

            it("should retrieve the uris of the operations associated to this service from the repository",
            function() {
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.operationsUris().sort()[0] == "http://localhost:3000/schemas/services/Book#createBook").to(equal,true);
                expect(service.operationsUris().sort()[1] == "http://localhost:3000/schemas/services/Book#showBook").to(equal,true);
            });

        });

	describe('.operations',function() {

            it("should retrieve the operations associated to this service from the repository",
            function() {
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.operations()[0].uri == "http://localhost:3000/schemas/services/Book#createBook").to(equal,true);
                expect(service.operations()[1].uri == "http://localhost:3000/schemas/services/Book#showBook").to(equal,true);
            });

        });

	describe('.connect',function() {

            it("should try to connect the modelReference of the service and retrive the model triplets",
            function() {
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);
                
                var that = this;
                Siesta.Events.addListener(service,service.EVENT_SERVICE_LOADED,that,function(event,serv) {
                    
                    Siesta.Events.removeListener(service,service.EVENT_SERVICE_LOADED,that);
                    expect(serv.model().uri == "http://localhost:3000/schemas/models/Book").to(equal,true);
                    expect(serv.connected).to(equal,true);
                    for(var _i=0; _i<serv.operations().length; _i++) {
                        var op = serv.operations()[_i];
                        expect(op.inputMessages()[0].connected).to(equal,true);
                        expect(op.inputMessages()[0].loweringSchemaMappingContent != null).to(equal,true);
                        expect(op.outputMessage().connected).to(equal,true);
                        //expect(op.outputMessage().liftingSchemaMappingContent != null).to(equal,true);
                        
                    }
                });
                
                service.connect("jsonp");
            });

        });



    });
});


/*

        describe('Siesta.Model.Schema',function() {

	    describe('.modelReference',function() {

                it("should retrieve the model reference associated to this service from the repository",
                   function() {
                       Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                       expect(Siesta.Model.Repositories.schemas.triplesArray().length == 0).to(equal,true);
                       var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data3);
                       Siesta.Model.Repositories.schemas = graph;
                       expect(Siesta.Model.Repositories.schemas.triplesArray().length > 0).to(equal,true);

                       var model = new Siesta.Model.Schema("http://localhost:3000/schemas/models/Book");
                       expect(model.type() == "http://www.w3.org/2000/01/rdf-schema#Class").to(equal,true);
                   });

            });
        })
*/
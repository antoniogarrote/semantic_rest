GLOBAL_MUTEX = false;
wait = function(name,callback) {
    var timeout = function(){
        if(GLOBAL_MUTEX == false) {
            GLOBAL_MUTEX = name
            console.log("MUTEX:"+name);
            try{
                callback();
            } catch(e) {
                console.log('Exception:'+e+'in '+name);
           }
        } else {
            setTimeout(timeout,500);
        }
    };

    setTimeout(timeout,500);
};

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


/*	describe('#load',function() {

	    it("should load the required script from the server",
               function() {
                   Siesta.load(Siesta.currentPath(), "fixtures", "foo.js");
		   expect(fooWarn()).to(equal,"foo");
	       });

	});*/

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

	describe('#mergeTriple',function() {

	    it("should store a new triple in the graph without change the blank node identiier",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.BlankNode('0');
                   var t = new Siesta.Framework.Triple(u,u,u);

                   g.mergeTriple(t);
                   expect(g.triplesArray().length).to(equal,1);

                   var u = new Siesta.Framework.BlankNode('78');
                   var t = new Siesta.Framework.Triple(u,u,u);
                   g.mergeTriple(t);
                   expect(g.triplesArray().length).to(equal,2);

                   var ts = g.triplesArray();

                   expect(ts[0].subject.value).to(equal,'0');
                   expect(ts[1].subject.value).to(equal,'78');
	       });
        });

	describe('#removeTriple',function() {

	    it("should remove an existent triple in the graph",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var result = g.addTriple(t);

                   expect(g.triplesArray().length).to(equal,1);

                   g.removeTriple(t)

                   expect(g.triplesArray().length).to(equal,0);
                   expect(g.triples[g.__normalizeUri(u)]).to(equal,undefined);
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

	    it("should store a new triple in the graph changing the new blank node identiier",
               function() {
                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.BlankNode('12');
                   var t = new Siesta.Framework.Triple(u,u,u);

                   g.addTriple(t);
                   expect(g.triplesArray().length).to(equal,1);

                   var u = new Siesta.Framework.BlankNode('78');
                   var t = new Siesta.Framework.Triple(u,u,u);
                   g.addTriple(t);
                   expect(g.triplesArray().length).to(equal,2);

                   var ts = g.triplesArray();

                   expect(ts[0].subject.value).to(equal,'0');
                   expect(ts[1].subject.value).to(equal,'1');
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

	describe('#removeGraph',function() {

	    it("should return all the stored triples as an array",
               function() {

                   var g = new Siesta.Framework.Graph();

                   var u = new Siesta.Framework.Uri("a","c");
                   var t = new Siesta.Framework.Triple(u,u,u);

                   var u2 = new Siesta.Framework.Uri("d","e");
                   var t2 = new Siesta.Framework.Triple(u2,u2,u2);

                   expect(g.triplesArray().length == 0).to(equal,true);

                   g.addTriple(t);
                   g.addTriple(t2);

                   expect(g.triplesArray().length == 2).to(equal,true);

                   var g2 = new Siesta.Framework.Graph();
                   g2.addTriple(t2);

                   g.removeGraph(g2);

                   expect(g.triplesArray().length == 1).to(equal,true);
                   expect(g.triplesArray()[0].subject.value).to(equal,t.subject.value);
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
                wait('.onRegisterServiceJsonp',function(){
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();

                try {
                    t = function() {
                        expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                        Siesta.Services.onRegisteredServiceJsonp(fixtureN3Data1);
                        expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);
                        GLOBAL_MUTEX = false;
                    };
                    t();
                } catch(e) {
                    t();
                }
                });
            });

        });
    });

	describe('.parseAndAddToRepository',function() {

            it("should inmediately parse the doc and send a notification if the parser is syncrhonous",
            function() {
                wait('.parseAndAddToRepository',function(){
                var _graph = new  Siesta.Framework.Graph();
                try {
                    expect(_graph.triplesArray().length == 0).to(equal,true);
                    var that = this;
                    var subscription = Siesta.Events.subscribe(Siesta.Services.TRIPLET_CHANGE_EVENT,function(event,msg) {
                        Siesta.Events.unsubscribe(subscription);
                        t = function() {
                            expect(_graph.triplesArray().length > 0).to(equal,true);
                            GLOBAL_MUTEX = false;
                        };
                        t();
                    });
                    Siesta.Services.parseAndAddToRepository(fixtureN3Data1,_graph);
                } catch(e) {
                    t();
                }
                });
            });

            it("should parse the doc and send an asynchronous notification if the parser is syncrhonous",
            function() {
                wait('should parse the doc and send an asynchronous notification if the parser is syncrhonous',function(){
                var _graph = new  Siesta.Framework.Graph();
                try {
                    expect(_graph.triplesArray().length == 0).to(equal,true);
                    var that = this;
                    var subscription = Siesta.Events.subscribe(Siesta.Services.TRIPLET_CHANGE_EVENT,function(event,msg) {
                        Siesta.Events.unsubscribe(subscription);
                        t = function() {
                            expect(_graph.triplesArray().length > 0).to(equal,true);
                            GLOBAL_MUTEX = false;
                        };
                        t();
                    });
                    Siesta.Services.parseAndAddToRepository(fixtureRdfaData1,_graph);
                } catch(e) {
                    t();
                }
                });
            });

        });

    describe('Siesta.Services.RestfulOperationInputMessage',function() {

	   describe('.modelReference',function() {
               it("should parse the modelReference property of the RestfulOperationInputMessage element",
                  function() {
                      wait('modelReference',function(){
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
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.loweringSchemaMapping',function() {
               it("should parse the loweringSchemaMapping property of the RestfulOperationInputMessage element",
                  function() {
                      wait('.loweringSchemaMapping',function(){
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
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.connect',function() {
               it("should try to retrieve the model and lowering schema from the remote server",
                  function() {
                      wait('connect',function(){
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
                          var subscription = Siesta.Events.subscribe(message.EVENT_MESSAGE_LOADED,function(event,msg,myData) {
                              if(myData = message) {
                                  Siesta.Events.unsubscribe(subscription);

                                  expect(msg.model().uri == "http://localhost:3000/schemas/models/Book").to(equal,true);
                                  expect(msg.loweringSchemaMappingContent != null).to(equal,true);
                                  expect(msg.connected).to(equal,true);
                              }
                              GLOBAL_MUTEX = false;
                          },this, message);
                          message.connect("jsonp");
                      }
                      });
                  });
           });

    });

    describe('Siesta.Services.RestfulOperationOutputMessage',function() {

	   describe('.modelReference',function() {
               it("should parse the modelReference property of the RestfulOperationOutputMessage element",
                  function() {
                      wait('modelReference',function(){
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
                      GLOBAL_MUTEX = false;
                      });
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
                      wait('.connect(2)',function(){
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
                          var subscription =  Siesta.Events.subscribe(message.EVENT_CONNECTED,function(event,operation,myData) {
                              if(myData == message) {
                                  Siesta.Events.unsubscribe(subscription);

                                  expect(message.liftingSchemaMappingContent != null).to(equal,true);
                                  GLOBAL_MUTEX = false;
                              }
                          }, this, message);

                          message.connect('jsonp');
                      }
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

        describe('.consume(GET) this test may fail',function() {
               it("should consume the GET operation of a service",
                  function() {
                      wait('.consume(GET)',function(){
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                      //console.log("1");
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data5);
                      Siesta.Model.Repositories.services = graph;
                      //console.log("2");
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                      //console.log("3");
                      //expect(service.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);

                      var that = this;
                      var subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                          if(myData == service) {
                              Siesta.Events.unsubscribe(subscription);

                              //console.log("4");
                              //expect(serv.model().uri == "http://localhost:3000/schemas/models/Book").to(equal,true);
                              //console.log("5");
                              //expect(serv.connected).to(equal,true);
                              //console.log("5b");
                              for(var _i=0; _i<serv.operations().length; _i++) {
                                  var op = serv.operations()[_i];
                                  //expect(op.inputMessages()[0].connected).to(equal,true);
                                  //expect(op.inputMessages()[0].loweringSchemaMappingContent != null).to(equal,true);
                                  //expect(op.outputMessage().connected).to(equal,true);
                                  if(op.uri == "http://localhost:3000/schemas/services/Book#showBook") {
                                      //this is our operation
                                      var toLowerGraph = new  Siesta.Framework.Graph();
                                      toLowerGraph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri("http://test.com/1"),
                                                                                         new Siesta.Framework.Uri("http://semantic_rest/siesta#id"),
                                                                                         new Siesta.Framework.Literal({value: "1"})));
                                      toLowerGraph.addTriple(new Siesta.Framework.Triple(new Siesta.Framework.Uri("http://test.com/1"),
                                                                                         new Siesta.Framework.Uri("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                                                                                         new Siesta.Framework.Uri("http://localhost:3000/schemas/models/Book")));

                                      Siesta.Model.Repositories.data = new Siesta.Framework.Graph();

                                      var subscriptionConsumed =  Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,operation,myData) {
                                          if(myData == 'foo_identifier_2') {
                                              Siesta.Events.unsubscribe(subscriptionConsumed);

                                              //expect(Siesta.Model.Repositories.data.triplesArray().length>0).to(equal,true);
                                              //console.log("6");
                                              expect(true).to(equal,true);
                                              //console.log("yeah!!!");
                                              GLOBAL_MUTEX = false;
                                          }
                                      },this,'foo_identifier_2');
                                      op.consume("jsonp",toLowerGraph);
                                  }
                              }
                          }
                      },this,service);
                      service.connect("jsonp");

                      });
                  });
           });

        describe('.consume(POST) this test may fail',function() {
               it("should consume the POST operation of a service",
                  function() {

                      wait('.consume(POST)',function(){
                      //console.log("POST");
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                      //console.log("1");
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                      Siesta.Model.Repositories.services = graph;
                      //console.log("2");
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                      //console.log("3");
                      //expect(service.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);

                      var that = this;
                      var _subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                          if(myData == service) {
                              Siesta.Events.unsubscribe(_subscription);

                              //console.log("4");
                              //expect(serv.model().uri == "http://localhost:3000/schemas/models/Book").to(equal,true);
                              //console.log("5");
                              //expect(serv.connected).to(equal,true);
                              //console.log("5b");

                              var testOps = serv.operations();
                              for(var _i=0; _i<serv.operations().length; _i++) {
                                  var op = serv.operations()[_i];
                                  //expect(op.inputMessages()[0].connected).to(equal,true);
                                  //expect(op.inputMessages()[0].loweringSchemaMappingContent != null).to(equal,true);
                                  //expect(op.outputMessage().connected).to(equal,true);
                                  if(op.uri == "http://localhost:3000/schemas/services/Book#createBook") {
                                      //this is our operation
                                      var toLowerGraph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Book1);

                                      Siesta.Model.Repositories.data = new Siesta.Framework.Graph();

                                      var __subscription = Siesta.Events.subscribe(op.EVENT_CONSUMED,function(event,operation,myData) {
                                          if(myData == 'foo_identifier_1') {
                                              Siesta.Events.unsubscribe(__subscription);

                                              //expect(Siesta.Model.Repositories.data.triplesArray().length>0).to(equal,true);

                                              for(var _j=0; _j<serv.operations().length; _j++) {
                                                  var dop = serv.operations()[_j];
                                                  if(dop.uri == "http://localhost:3000/schemas/services/Book#destroyBook") {
                                                      var ___subscription = Siesta.Events.subscribe(dop.EVENT_CONSUMED,function(event,operation,myData) {
                                                          if(myData == 'foo_identifier_3') {
                                                          Siesta.Events.unsubscribe(___subscription);
                                                              expect(Siesta.Model.Repositories.data.triplesArray().length).to(equal,0);
                                                              GLOBAL_MUTEX = false;
                                                          }
                                                      },this,'foo_identifier_3');
                                                      dop.consume("jsonp",Siesta.Model.Repositories.data);
                                                  }
                                              }
                                          }
                                      },this,'foo_identifier_1');
                                      op.consume("jsonp",toLowerGraph);
                                  }
                              }
                          }
                      },this,service);
                      service.connect("jsonp");
                  });
                  });
           });
    });

    describe('Siesta.Model.Namespaces',function() {

	   describe('.register',function() {
               it("should add a new namespace to the register",
                  function() {
                      wait('.register',function(){
                      Siesta.Model.Namespaces.map = {};
                      Siesta.Model.Namespaces.register("test","http://test.com#")
                      expect(Siesta.Model.Namespaces.map.test).to(equal,"http://test.com#");
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.unregister',function() {
               it("should remove a namespace from the register",
                  function() {
                      wait('.unregister',function(){
                      Siesta.Model.Namespaces.map = {};
                      Siesta.Model.Namespaces.register("test","http://test.com#")
                      expect(Siesta.Model.Namespaces.map.test).to(equal,"http://test.com#");
                      Siesta.Model.Namespaces.unregister("test");
                      expect(Siesta.Model.Namespaces.map.test).to(equal,undefined);
                          GLOBAL_MUTEX = false;
                      });
                  });
           });
	   describe('.resolve',function() {
               it("should return the resolved uri",
                  function() {
                      wait('.resolve',function(){
                      Siesta.Model.Namespaces.map = {};
                      Siesta.Model.Namespaces.register("test","http://test.com#")
                      expect(Siesta.Model.Namespaces.map.test).to(equal,"http://test.com#");
                      expect(Siesta.Model.Namespaces.resolve({test: 'hi'})).to(equal,'http://test.com#hi');
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

    });

    describe('Siesta.Services.RestfulOperationInputParameter',function() {

	   describe('.type',function() {
               it("should parse the type property of the RestfulOperationInputParameter element",
                  function() {
                      wait('.type',function(){
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
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.parameterName',function() {
               it("should parse the parameterName property of the RestfulOperationInputParameter element",
                  function() {
                      wait('.parameterName',function(){
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
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

    });

    describe('Siesta.Services.RestfulOperation',function() {

	   describe('.label',function() {
               it("should parse the label property of the RestfulOperation element",
                  function() {
                      wait('.label',function(){
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.label() == "creates a new Book resource").to(equal,true);
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.method',function() {
               it("should parse the method property of the RestfulOperation element",
                  function() {
                      wait('.method',function(){
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.method() == "POST").to(equal,true);
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.address',function() {
               it("should parse the address property of the RestfulOperation element",
                  function() {
                      wait('.address',function(){
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operation = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operation.address() == "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}").to(equal,true);
                          GLOBAL_MUTEX = false;
                      });
                  });
           });

	   describe('.addressAttributes',function() {
               it("should retrieve the attributes of the address",
                  function() {
                      wait('.addressAttributes',function(){
                      Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                      expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                      var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                      Siesta.Model.Repositories.services = graph;
                      expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                      var operationFirst = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operationFirst.address() == "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}").to(equal,true);
                      expect(operationFirst.addressAttributes().length).to(equal,6);
                      var operationSecond = new Siesta.Services.RestfulOperation("http://localhost:3000/schemas/services/Book#createBook");
                      expect(operationSecond.address() == "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}").to(equal,true);
                      expect(operationSecond.addressAttributes().length).to(equal,6);
                          GLOBAL_MUTEX = false;
                      });
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
                      var subscription = Siesta.Events.subscribe(operation.EVENT_CONNECTED,function(event,operation,myData) {
                          Siesta.Events.unsubscribe(subscription);
                          if(myData == operation) {
                              expect(operation.inputMessages()[0].loweringSchemaMappingContent != null).to(equal,true);
                          }
                      },this,operation);
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

   describe('.save',function() {
       it("should build a new instance and save it into the server",
          function() {
              wait('save',function(){
              Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
              Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();

              expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
              var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
              Siesta.Model.Repositories.services = graph;
              expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

              var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");

              var that = this;
              var _subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                  Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/BookService"] = serv;

                  Siesta.Events.unsubscribe(_subscription);

                  var Book = new Siesta.Model.Class({
                      schemaUri: "http://localhost:3000/schemas/models/Book",
                      serviceUri:"http://localhost:3000/schemas/services/BookService"
                  });

                  Book.definePropertiesAliases({
                      id:"http://semantic_rest/siesta#id",
                      isbn:"http://test.com#isbn",
                      numberOfPages:"http://test.com#numberOfPages",
                      category:"http://test.com#category",
                      editorial:"http://test.com#editorial",
                      published:"http://test.com#published",
                      title:"http://test.com#title"
                  });

                  var myBook = Book.build({
                      isbn: 3323,
                      numberOfPages: 12,
                      category: 'drama',
                      editorial: 'no one',
                      published: '01-05-1982',
                      title: 'habemus res'
                  });

                  myBook.save(function(savedBook){
                      //console.log(savedBook.get('id'));
                      expect(savedBook.get('id')!=undefined).to(equal,true);
                      GLOBAL_MUTEX = false;
                  });

              },this,service);
              service.connect("jsonp");
              });
       });
   });


   describe('.destroy',function() {
       it("should destroy an existent instance from the remote server",
          function() {
              wait('destroy',function(){
                  Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                  Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();

                  expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                  var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                  Siesta.Model.Repositories.services = graph;
                  expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                  var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");

                  var that = this;
                  var _subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                      Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/BookService"] = serv;

                      Siesta.Events.unsubscribe(_subscription);

                      var Book = new Siesta.Model.Class({
                          schemaUri: "http://localhost:3000/schemas/models/Book",
                          serviceUri:"http://localhost:3000/schemas/services/BookService"
                      });

                      Book.definePropertiesAliases({
                          id:"http://semantic_rest/siesta#id",
                          isbn:"http://test.com#isbn",
                          numberOfPages:"http://test.com#numberOfPages",
                          category:"http://test.com#category",
                          editorial:"http://test.com#editorial",
                          published:"http://test.com#published",
                          title:"http://test.com#title"
                      });

                      var myBook = Book.build({
                          isbn: 3323,
                          numberOfPages: 12,
                          category: 'drama',
                          editorial: 'no one',
                          published: '01-05-1982',
                          title: 'habemus res'
                      });

                      myBook.save(function(savedBook){
                          savedBook.destroy(function(destroyedBook) {
                              expect(destroyedBook.uri==undefined).to(equal,true);
                              GLOBAL_MUTEX = false;
                          });
                      });

                  },this,service);
                  service.connect("jsonp");
              });
          });
   });


   describe('.find',function() {
       it("should find and retrieve an existent instance from the remote server",
          function() {
              wait('.find for instance',function(){
                  Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                  Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();

                  expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                  var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                  Siesta.Model.Repositories.services = graph;
                  expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                  var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");

                  var that = this;
                  var _subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                      Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/BookService"] = serv;

                      Siesta.Events.unsubscribe(_subscription);

                      var Book = new Siesta.Model.Class({
                          schemaUri: "http://localhost:3000/schemas/models/Book",
                          serviceUri:"http://localhost:3000/schemas/services/BookService"
                      });

                      Book.definePropertiesAliases({
                          id:"http://semantic_rest/siesta#id",
                          isbn:"http://test.com#isbn",
                          numberOfPages:"http://test.com#numberOfPages",
                          category:"http://test.com#category",
                          editorial:"http://test.com#editorial",
                          published:"http://test.com#published",
                          title:"http://test.com#title"
                      });

                      var myBook = Book.build({
                          isbn: 3323,
                          numberOfPages: 12,
                          category: 'drama',
                          editorial: 'no one',
                          published: '01-05-1982',
                          title: 'habemus res'
                      });
                      myBook.save(function(savedBook){
                          var savedId = savedBook.get('id');
                          Book.find({id:savedId},function(foundBook) {
                              expect(foundBook.uri==savedBook.uri).to(equal,true);
                              GLOBAL_MUTEX = false;
                          });
                      });

                  },this,service);
                  service.connect("jsonp");
              });
          });
   });


   describe('.update for instance',function() {
       it("should find and retrieve an existent instance and update its values",
          function() {
              wait('.update for instance',function(){
                  Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                  Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();

                  expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                  var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                  Siesta.Model.Repositories.services = graph;
                  expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                  var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");

                  var that = this;
                  var _subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                      Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/BookService"] = serv;

                      Siesta.Events.unsubscribe(_subscription);

                      var Book = new Siesta.Model.Class({
                          schemaUri: "http://localhost:3000/schemas/models/Book",
                          serviceUri:"http://localhost:3000/schemas/services/BookService"
                      });

                      Book.definePropertiesAliases({
                          id:"http://semantic_rest/siesta#id",
                          isbn:"http://test.com#isbn",
                          numberOfPages:"http://test.com#numberOfPages",
                          category:"http://test.com#category",
                          editorial:"http://test.com#editorial",
                          published:"http://test.com#published",
                          title:"http://test.com#title"
                      });

                      var myBook = Book.build({
                          isbn: 3323,
                          numberOfPages: 12,
                          category: 'drama',
                          editorial: 'no one',
                          published: '01-05-1982',
                          title: 'habemus res'
                      });
                      myBook.save(function(savedBook){
                          myBook.set('category','comedy');
                          savedBook.save(function(updatedBook) {
                              expect(updatedBook.uri==savedBook.uri).to(equal,true);
                              expect(updatedBook.get('category')=='comedy').to(equal,true);
                              GLOBAL_MUTEX = false;
                          });
                      });

                  },this,service);
                  service.connect("jsonp");
              });
          });
   });

   describe('.relationFindAll',function() {
       it("should find and retrieve an existent instance and update its values",
          function() {
              wait('.relationFindAll',function(){
                  Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                  Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();

                  expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                  var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data7);
                  Siesta.Model.Repositories.services = graph;
                  expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                  var serviceBook = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                  var serviceChapter = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/ChapterService");

                  var that = this;
                  var _subscription =  Siesta.Events.subscribe(serviceBook.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                      Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/BookService"] = serv;
                      Siesta.Events.unsubscribe(_subscription);
		      var _chapterSubscription = Siesta.Events.subscribe(serviceChapter.EVENT_SERVICE_LOADED,function(event,serv,myData) {
			  Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/ChapterService"] = serv;
			  Siesta.Events.unsubscribe(_chapterSubscription);
			  
                          debugger;
                          var Book = new Siesta.Model.Class({
                              schemaUri: "http://localhost:3000/schemas/models/Book",
                              serviceUri:"http://localhost:3000/schemas/services/BookService",
                              indexOperationUri: "http://localhost:3000/schemas/services/Book#indexBook",
                              getOperationUri: "http://localhost:3000/schemas/services/Book#showBook"
                          });
                          
                          Book.definePropertiesAliases({
                              id:"http://semantic_rest/siesta#id",
                              isbn:"http://test.com#isbn",
                              numberOfPages:"http://test.com#numberOfPages",
                              category:"http://test.com#category",
                              editorial:"http://test.com#editorial",
                              published:"http://test.com#published",
                              title:"http://test.com#title",
                              chapters:"http://test.com#hasChapter"
                          });

                          var Chapter = new Siesta.Model.Class({
                              schemaUri: "http://localhost:3000/schemas/models/Chapter",
                              nestedThrough: "http://test.com#fromBook",
                              serviceUri:"http://localhost:3000/schemas/services/ChapterService",
                              indexOperationUri: "http://localhost:3000/schemas/services/Chapter#indexChapter",
                              getOperationUri: "http://localhost:3000/schemas/services/Chapter#showChapter"
                          });



                          Book.find({id:1},function(foundBook) {
                              debugger;

                              foundBook.relationFindAll('chapters',function(bookWithChapters){
                                  debugger;
                                  GLOBAL_MUTEX = false;                                  
                              });
                          });                          

		      },that,serviceChapter);
                      serviceChapter.connect("jsonp");
                  },this,serviceBook);
                  serviceBook.connect("jsonp");
              });
          });
   });

	describe('.toGraph',function() {

            it("should retrieve the properties associated to this model and its ranges",
               function() {
                   wait('.toGraph',function(){
                   Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                   Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length == 0).to(equal,true);
                   var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                   var bookGraph = Siesta.Formats.Turtle.parseDoc("",fixturesN3BookClass);

                   Siesta.Model.Repositories.schemas = bookGraph;
                   Siesta.Model.Repositories.services = graph;
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length > 0).to(equal,true);

                   var model = new Siesta.Model.Schema("http://localhost:3000/schemas/models/Book");
                   expect(model.type() == "http://www.w3.org/2000/01/rdf-schema#Class").to(equal,true);

                   var bookClass = new Siesta.Model.Class({
                       schemaUri: "http://localhost:3000/schemas/models/Book"
                   });

                   bookClass.definePropertiesAliases({
                       isbn:"http://test.com#isbn"
                   });

                   expect(bookClass.properties() != undefined).to(equal,true);
                   var instance = new Siesta.Model.Instance({
                       type: bookClass,
                       properties: {
                           isbn: '222333'
                       }
                   });
                   var result = instance.toGraph();
                   expect(instance.toGraph().triplesArray().length).to(equal,1);
                   expect(instance.toGraph().triplesArray()[0].object.value).to(equal,'222333');
                   GLOBAL_MUTEX = false;
                   });
               });

        });
    })

    describe('Siesta.Services.RestfulService',function() {

	   describe('.findForSchema',function() {

            it("should retrieve the model reference associated to this service from the repository",
            function() {

                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);
                Siesta.Services.RestfulService.servicesCache["http://localhost:3000/schemas/services/BookService"] = service;
                var serviceFound = Siesta.Services.RestfulService.findForSchema("http://localhost:3000/schemas/models/Book")
                expect(serviceFound).to(equal,service);

            });
           });

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
                wait('.connect',function(){
                Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                expect(Siesta.Model.Repositories.services.triplesArray().length == 0).to(equal,true);
                var graph = Siesta.Formats.Turtle.parseDoc("",fixtureN3Data1);
                Siesta.Model.Repositories.services = graph;
                expect(Siesta.Model.Repositories.services.triplesArray().length > 0).to(equal,true);

                var service = new Siesta.Services.RestfulService("http://localhost:3000/schemas/services/BookService");
                expect(service.modelReference() == "http://localhost:3000/schemas/models/Book").to(equal,true);

                var that = this;

                var subscription =  Siesta.Events.subscribe(service.EVENT_SERVICE_LOADED,function(event,serv,myData) {
                    if(myData == service) {
                        Siesta.Events.unsubscribe(subscription);

                        expect(serv.model().uri == "http://localhost:3000/schemas/models/Book").to(equal,true);
                        expect(serv.connected).to(equal,true);
                        for(var _i=0; _i<serv.operations().length; _i++) {
                            var op = serv.operations()[_i];
                            expect(op.inputMessages()[0].connected).to(equal,true);
                            expect(op.inputMessages()[0].loweringSchemaMappingContent != null).to(equal,true);
                            expect(op.outputMessage().connected).to(equal,true);
                            //expect(op.outputMessage().liftingSchemaMappingContent != null).to(equal,true);
                        }
                        GLOBAL_MUTEX = false;
                    }
                },this,service);

                service.connect("jsonp");
                });
            });

        });



    });
});

Screw.Unit(function() {
    describe('Siesta.Model.Class',function() {

        describe('.initialize',function() {

            it("should retrieve the model reference associated to this service from the repository",
               function() {
                   Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                   Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length == 0).to(equal,true);
                   var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                   var bookGraph = Siesta.Formats.Turtle.parseDoc("",fixturesN3BookClass);

                   Siesta.Model.Repositories.schemas = bookGraph;
                   Siesta.Model.Repositories.services = graph;
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length > 0).to(equal,true);

                   var model = new Siesta.Model.Schema("http://localhost:3000/schemas/models/Book");
                   expect(model.type() == "http://www.w3.org/2000/01/rdf-schema#Class").to(equal,true);

                   var bookClass = new Siesta.Model.Class({
                       schemaUri: "http://localhost:3000/schemas/models/Book"
                   });

                   expect(bookClass.properties() != undefined).to(equal,true);
               });

        });

        describe('.definePropertiesAliases',function() {

            it("should retrieve the model reference associated to this service from the repository",
               function() {
                   Siesta.Model.Repositories.services = new Siesta.Framework.Graph();
                   Siesta.Model.Repositories.schemas = new Siesta.Framework.Graph();

                   expect(Siesta.Model.Repositories.schemas.triplesArray().length == 0).to(equal,true);
                   var graph = Siesta.Formats.Turtle.parseDoc("",fixturesN3Data6);
                   var bookGraph = Siesta.Formats.Turtle.parseDoc("",fixturesN3BookClass);

                   Siesta.Model.Repositories.schemas = bookGraph;
                   Siesta.Model.Repositories.services = graph;
                   expect(Siesta.Model.Repositories.schemas.triplesArray().length > 0).to(equal,true);

                   var model = new Siesta.Model.Schema("http://localhost:3000/schemas/models/Book");
                   expect(model.type() == "http://www.w3.org/2000/01/rdf-schema#Class").to(equal,true);

                   var bookClass = new Siesta.Model.Class({
                       schemaUri: "http://localhost:3000/schemas/models/Book"
                   });

                   expect(bookClass.properties() != undefined).to(equal,true);

                   bookClass.definePropertiesAliases({
                       isbn: 'http://test.com#isbn'
                   });

                   expect(bookClass.property('isbn')).to(equal,'http://test.com#isbn');
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
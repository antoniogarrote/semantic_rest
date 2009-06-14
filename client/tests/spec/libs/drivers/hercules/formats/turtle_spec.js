Screw.Unit(function() {

    describe('Siesta.Drivers.Hercules.Formats.Turtle',function() {

	describe('#parseDoc',function() {

	    it("should parse correctly a Turtle document with a Hercules parser",
               function() {
                   var graphTest = '@prefix foaf:  <http://xmlns.com/foaf/0.1/> .\n_:a  foaf:name   "Johnny Lee Outlaw" .\n_:a  foaf:mbox   <mailto:jlow@example.com> .\n_:b  foaf:name   "Peter Goodguy" .\n_:b  foaf:mbox   <mailto:peter@example.org> .\n_:c  foaf:mbox   <mailto:carol@example.org> .';
                   
                   var graph = Siesta.Drivers.Hercules.Formats.Turtle.parseDoc("",graphTest);

		   expect(graph.triplesArray().length == 5).to(equal,true);
	       });
        });

	describe('#__parseReference',function() {

	    it("should parse correctly a Hercules BlankNode",
               function() {
                   var graphTest = '@prefix foaf:  <http://xmlns.com/foaf/0.1/> .\n_:a  foaf:name   "Johnny Lee Outlaw" .\n_:a  foaf:mbox   <mailto:jlow@example.com> .\n_:b  foaf:name   "Peter Goodguy" .\n_:b  foaf:mbox   <mailto:peter@example.org> .\n_:c  foaf:mbox   <mailto:carol@example.org> .';
                   
                   var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
                   turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
                   turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
                   turtleParser.compileRuleSet();
                   var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0("");
                   turtleParser.parse(graphTest, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);
                                      
		   expect(Siesta.Drivers.Hercules.__parseReference(action.graph.tripleList[0].subject).__type == 'blanknode').to(equal,true);
	       });

	    it("should parse correctly a Hercules UriRef",
               function() {
                   var graphTest = '@prefix foaf:  <http://xmlns.com/foaf/0.1/> .\n_:a  foaf:name   "Johnny Lee Outlaw" .\n_:a  foaf:mbox   <mailto:jlow@example.com> .\n_:b  foaf:name   "Peter Goodguy" .\n_:b  foaf:mbox   <mailto:peter@example.org> .\n_:c  foaf:mbox   <mailto:carol@example.org> .';
                   
                   var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
                   turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
                   turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
                   turtleParser.compileRuleSet();
                   var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0("");
                   turtleParser.parse(graphTest, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);
                                      
		   expect(Siesta.Drivers.Hercules.__parseReference(action.graph.tripleList[0].predicate).__type == 'uri').to(equal,true);
		   expect(Siesta.Drivers.Hercules.__parseReference(action.graph.tripleList[1].object).__type == 'uri').to(equal,true);
	       });

	    it("should parse correctly a Hercules Literal",
               function() {
                   var graphTest = '@prefix foaf:  <http://xmlns.com/foaf/0.1/> .\n_:a  foaf:name   "Johnny Lee Outlaw" .\n_:a  foaf:mbox   <mailto:jlow@example.com> .\n_:b  foaf:name   "Peter Goodguy" .\n_:b  foaf:mbox   <mailto:peter@example.org> .\n_:c  foaf:mbox   <mailto:carol@example.org> .';
                   
                   var turtleParser = new Arielworks.Parser.RecursiveDescentParser.Parser();
                   turtleParser.setRuleSet(Arielworks.Hercules.Serialized.Turtle.Parser.RULE_SET);
                   turtleParser.setWhiteSpaceRule(Arielworks.Hercules.Serialized.Turtle.Parser.WHITE_SPACE_RULE);
                   turtleParser.compileRuleSet();
                   var action = new Arielworks.Hercules.Serialized.Turtle.Turtle_1_0("");
                   turtleParser.parse(graphTest, Arielworks.Hercules.Serialized.Turtle.Parser.START_RULE, action);
                                      
		   expect(Siesta.Drivers.Hercules.__parseReference(action.graph.tripleList[0].object).__type == 'literal').to(equal,true);
	       });

	});

    });

});

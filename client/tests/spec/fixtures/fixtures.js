fixtureN3Data1 = '@prefix hr: <http://www.wsmo.org/ns/hrests#> .@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> . @prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . @prefix sawsdl: <http://www.w3.org/ns/sawsdl#> . <http://localhost:3000/schemas/services/BookService> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service ;   rdfs:isDefinedBy <http://localhost:3000/schemas/services/BookService> ;   sawsdl:modelReference <http://localhost:3000/schemas/models/Book> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#createBook> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#showBook> . <http://localhost:3000/schemas/services/Book#createBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "creates a new Book resource" ;   hr:hasMethod  "POST" ;   hr:hasAddress "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;      sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;      hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;      sawsdl:modelReference <http://localhost:3000/schemas/models/Book>   ] . <http://localhost:3000/schemas/services/Book#showBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "retrieves Book resource with id {id}" ;   hr:hasMethod  "GET" ;   hr:hasAddress "http://localhost:3000/books/{id}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;     sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/show.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;     hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book>  ] .';

fixtureN3Data2 = '@prefix hr: <http://www.wsmo.org/ns/hrests#> .@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> . @prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . @prefix sawsdl: <http://www.w3.org/ns/sawsdl#> . <http://localhost:3000/schemas/services/BookService> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service ;   rdfs:isDefinedBy <http://localhost:3000/schemas/services/BookService> ;   sawsdl:modelReference <http://localhost:3000/schemas/models/Book> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#createBook> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#showBook> . <http://localhost:3000/schemas/services/Book#createBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "creates a new Book resource" ;   hr:hasMethod  "POST" ;   hr:hasAddress "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;      sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;      hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;      sawsdl:modelReference <http://localhost:3000/schemas/models/Book>   ] . <http://localhost:3000/schemas/services/Book#showBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "retrieves Book resource with id {id}" ;   hr:hasMethod  "GET" ;   hr:hasAddress "http://localhost:3000/books/{id}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/NoteBook> ;     sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/show.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;     hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book>  ] .';
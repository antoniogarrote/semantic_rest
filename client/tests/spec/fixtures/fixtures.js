fixtureN3Data1 = '@prefix hr: <http://www.wsmo.org/ns/hrests#> .@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> . @prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . @prefix sawsdl: <http://www.w3.org/ns/sawsdl#> . <http://localhost:3000/schemas/services/BookService> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service ;   rdfs:isDefinedBy <http://localhost:3000/schemas/services/BookService> ;   sawsdl:modelReference <http://localhost:3000/schemas/models/Book> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#createBook> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#showBook> . <http://localhost:3000/schemas/services/Book#createBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "creates a new Book resource" ;   hr:hasMethod  "POST" ;   hr:hasAddress "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;      sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;      hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;      sawsdl:modelReference <http://localhost:3000/schemas/models/Book>   ] . <http://localhost:3000/schemas/services/Book#showBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "retrieves Book resource with id {id}" ;   hr:hasMethod  "GET" ;   hr:hasAddress "http://localhost:3000/books/{id}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;     sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/show.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;     hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book>  ] .';

fixtureN3Data2 = '@prefix hr: <http://www.wsmo.org/ns/hrests#> .@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> . @prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . @prefix sawsdl: <http://www.w3.org/ns/sawsdl#> . <http://localhost:3000/schemas/services/BookService> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service ;   rdfs:isDefinedBy <http://localhost:3000/schemas/services/BookService> ;   sawsdl:modelReference <http://localhost:3000/schemas/models/Book> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#createBook> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#showBook> . <http://localhost:3000/schemas/services/Book#createBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "creates a new Book resource" ;   hr:hasMethod  "POST" ;   hr:hasAddress "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;      sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;      hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;      sawsdl:modelReference <http://localhost:3000/schemas/models/Book>   ] . <http://localhost:3000/schemas/services/Book#showBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "retrieves Book resource with id {id}" ;   hr:hasMethod  "GET" ;   hr:hasAddress "http://localhost:3000/books/{id}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/NoteBook> ;     sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/show.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;     hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ; sawsdl:liftingSchemaMapping <http://localhost:3000/schemas/lowering/Book/lifting.xslt> ] .';


fixtureN3Data3 = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . <http://localhost:3000/schemas/models/Book> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Class . <http://semantic_rest/siesta#id> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://semantic_rest/siesta#id> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://semantic_rest/siesta#id> rdfs:range rdfs:Datatype . <http://test.com#optionaltrueuritest#numberOfPages> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://test.com#optionaltrueuritest#numberOfPages> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://test.com#optionaltrueuritest#numberOfPages> rdfs:range rdfs:Datatype . <http://test.com#optionaltrueuritest#isbn> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://test.com#optionaltrueuritest#isbn> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://test.com#optionaltrueuritest#isbn> rdfs:range rdfs:Datatype . <http://test.com#optionaltrueuritest#category> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://test.com#optionaltrueuritest#category> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://test.com#optionaltrueuritest#category> rdfs:range rdfs:Datatype . <http://test.com#optionaltrueuritest#published> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://test.com#optionaltrueuritest#published> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://test.com#optionaltrueuritest#published> rdfs:range rdfs:Datatype . <http://test.com#optionaltrueuritest#editorial> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://test.com#optionaltrueuritest#editorial> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://test.com#optionaltrueuritest#editorial> rdfs:range rdfs:Datatype . <http://test.com#optionaltrueuritest#title> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property . <http://test.com#optionaltrueuritest#title> rdfs:domain <http://localhost:3000/schemas/models/Book> . <http://test.com#optionaltrueuritest#title> rdfs:range rdfs:Datatype .';

fixtureN3Data4 = '@prefix hr: <http://www.wsmo.org/ns/hrests#> .@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> . @prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . @prefix sawsdl: <http://www.w3.org/ns/sawsdl#> . <http://localhost:3000/schemas/services/BookService> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service ;   rdfs:isDefinedBy <http://localhost:3000/schemas/services/BookService> ;   sawsdl:modelReference <http://localhost:3000/schemas/models/Book> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#createBook> . <http://localhost:3000/schemas/services/BookService> wsl:hasOperation <http://localhost:3000/schemas/services/Book#showBook> . <http://localhost:3000/schemas/services/Book#createBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "creates a new Book resource" ;   hr:hasMethod  "POST" ;   hr:hasAddress "http://localhost:3000/books?category={category}&editorial={editorial}&isbn={isbn}&pages={pages}&published={published}&title={title}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ;      sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;      hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;      sawsdl:modelReference <http://localhost:3000/schemas/models/Book>  ; sawsdl:liftingSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql>  ] . <http://localhost:3000/schemas/services/Book#showBook> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;   rdfs:label "retrieves Book resource with id {id}" ;   hr:hasMethod  "GET" ;   hr:hasAddress "http://localhost:3000/books/{id}"^^<hr:URITemplate> ;   wsl:hasInputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/NoteBook> ;     sawsdl:loweringSchemaMapping <http://localhost:3000/schemas/lowering/Book/show.sparql>   ] ;   hr:hasInputParameter [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;     hr:parameterName "callback"   ] ;   wsl:hasOutputMessage [     <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;     sawsdl:modelReference <http://localhost:3000/schemas/models/Book> ; sawsdl:liftingSchemaMapping <http://localhost:3000/schemas/lowering/Book/create.sparql> ] .';
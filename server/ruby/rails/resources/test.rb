require 'rubygems'
require 'rena'
require 'rena/n3parser'

@txt = <<__END
@prefix hr: <http://www.wsmo.org/ns/hrests#> .
@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> .
@prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix sawsdl: <http://www.w3.org/ns/sawsdl#> .
<http://localhost/schemas/services/TestActiveRecord#TestActiveRecordService> <rdf:type> wsl:Service ;
  rdfs:isDefinedBy <http://http://localhost/schemas/services/TestActiveRecord> ;
  sawsdl:modelReference <http://http://localhost/schemas/models/TestActiveRecord> .
<http://localhost/schemas/services/TestActiveRecord#TestActiveRecordService>  wsl:hasOperation <http://localhost/schemas/services/TestActiveRecord#createTestActiveRecord> .
<http://localhost/schemas/services/TestActiveRecord#TestActiveRecordService>  wsl:hasOperation <http://localhost/schemas/services/TestActiveRecord#showTestActiveRecord> .
<http://localhost/schemas/services/TestActiveRecord#createTestActiveRecord> <rdf:type> wsl:Operation ;
  rdfs:label "creates a new TestActiveRecord resource" ;
  hr:hasMethod  "POST" ;
  hr:hasAddress "http://http://localhost/tests/create?foo={foo}"^^<hr:URITemplate> ;
  wsl:hasInputMessage [
    <rdf:type> wsl:Message ;
    sawsdl:modelReference <http://http://localhost/schemas/models/TestActiveRecord> ; 
    sawsdl:loweringSchemaMapping <http://http://localhost/schemas/lowering/TestActiveRecord/create.sparql>
  ] ;
  wsl:hasInputParameter [
    <rdf:type> hrjs:JSONPCallback ; 
    hr:parameterName "callback"
  ] ;
  wsl:hasOutputMessage [
    <rdf:type> wsl:Message ; 
    sawsdl:modelReference <http://http://localhost/schemas/models/TestActiveRecord>
  ] .
<http://localhost/schemas/services/TestActiveRecord#showTestActiveRecord> <rdf:type> wsl:Operation ;
  rdfs:label "retrieves TestActiveRecord resource with id {id}" ;
  hr:hasMethod  "GET" ;
  hr:hasAddress "http://http://localhosthttp://test.comhttp://test.com/generated"^^<hr:URITemplate> ;
  wsl:hasInputMessage [
    <rdf:type> wsl:Message ;
    sawsdl:modelReference <http://http://localhost/schemas/models/TestActiveRecord> ;
    sawsdl:loweringSchemaMapping <http://http://localhost/schemas/lowering/TestActiveRecord/id.sparql>
  ] ;
  wsl:hasInputParameter [
    <rdf:type> hrjs:JSONPCallback ;
    hr:parameterName "callback"
  ] ;
  wsl:hasOutputMessage [
    <rdf:type> wsl:Message ;
    sawsdl:modelReference <http://http://localhost/schemas/models/TestActiveRecord>  ] .
__END
@p = Rena::N3Parser.new(@txt,"http://test.com/")

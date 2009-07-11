require File.dirname(__FILE__) + '/../spec_helper'
require File.dirname(__FILE__) + '/../../lib/semantic_resource'

SemanticResource::Configuration.set_resources_host("http://localhost")

class TestActiveRecord < ActiveRecord::Base

  include SemanticResource

  set_resource_namespace :test, "http://test.com"

  set_resource_mapping do |resource|
    resource[:foo] = {:uri => [:test, "#foo"],
                      :optional => true}

  end

  define_create_operation(:controller => 'tests', :action => 'create')
  define_show_operation(:controller => 'tests', :action => 'show')
  define_destroy_operation(:controller => 'tests', :action => 'destroy')
  define_update_operation(:controller => 'tests', :action => 'update')

  def initialize
  end

  def self.connection(refresh=false)
    return nil
  end

  def self.columns
  end

  def id
    1
  end

  def foo
    2
  end
end


class SemanticResourceTestHelper
  def self.with_routing_stubs
    ActionController::Base.stub!(:relative_url_root).and_return("http://test.com")
    ActionController::Routing::Routes.stub!(:generate).and_return("http://test.com/generated")
  end
end

describe SemanticResource,"ActiveRecord inclusion" do

  it "should register the class where it is included into the resources manager" do

    class TestActiveRecordFoo < ActiveRecord::Base

      include SemanticResource

      set_resource_namespace :test, "http://test.com"

      set_resource_mapping do |resource|
        resource[:foo] = {:uri =>  [:test, "#foo"],
                          :optional => true}
      end

      define_create_operation(:controller => 'tests', :action => 'create')
      define_show_operation(:controller => 'tests', :action => 'show')
      define_destroy_operation(:controller => 'tests', :action => 'destroy')
      define_update_operation(:controller => 'tests', :action => 'update')

      def initialize
      end

      def self.connection(refresh=false)
        return nil
      end

      def self.columns
      end

      def id
        1
      end

      def foo
        2
      end
    end

    SemanticResource::Manager.resources.include?(TestActiveRecordFoo).should be_true

  end

end

describe SemanticResource,".semantic_operations" do

  it "should create a new semantic_operations hash the first the messag is sent" do
    TestActiveRecord.semantic_operations.should be_instance_of(Hash)
  end

  it "should store the parameters of the show semantic operation" do
    TestActiveRecord.semantic_operations[:show].should_not be_nil
    TestActiveRecord.semantic_operations[:show][:controller].should be_eql('tests')
    TestActiveRecord.semantic_operations[:show][:action].should be_eql('show')
  end

  it "should store the parameters of the create semantic operation" do
    TestActiveRecord.semantic_operations[:create].should_not be_nil
    TestActiveRecord.semantic_operations[:create][:controller].should be_eql('tests')
    TestActiveRecord.semantic_operations[:create][:action].should be_eql('create')
  end

  it "should store the parameters of the destroy semantic operation" do
    TestActiveRecord.semantic_operations[:destroy].should_not be_nil
    TestActiveRecord.semantic_operations[:destroy][:controller].should be_eql('tests')
    TestActiveRecord.semantic_operations[:destroy][:action].should be_eql('destroy')
  end

  it "should store the parameters of the update semantic operation" do
    TestActiveRecord.semantic_operations[:update].should_not be_nil
    TestActiveRecord.semantic_operations[:update][:controller].should be_eql('tests')
    TestActiveRecord.semantic_operations[:update][:action].should be_eql('update')
  end

  it "should store the parameters of the index semantic operation"
end

describe SemanticResource,".resource_namespace" do

  it "should associate a given symbol with the URI of a namespace" do

    name,uri =  TestActiveRecord.resource_namespace

    name.should be_equal(:test)
    uri.should eql("http://test.com")
  end

end

describe SemanticResource,"resource_mapping" do

  it "should allow to specify and retrieve a mapping of attributes and URIs" do
    TestActiveRecord.resource_mapping.keys.first.should eql(:foo)
    TestActiveRecord.resource_mapping.values.first[:optional].should eql(true)
    TestActiveRecord.resource_mapping.values.first[:uri].should eql([:test, "#foo"])
  end

end

describe SemanticResource,"to_service_description" do

  it "should return a Turtle/RDF description of the service" do

    SemanticResourceTestHelper.with_routing_stubs

    rdf_n3 = TestActiveRecord.to_service_description
    puts "::::::Service description::::::::"
    puts rdf_n3
    puts ":::::::::::::::::::::::::::::::::"

    rdf_n3.index("http://http://").should be_nil

    p = Reddy::N3Parser.new(rdf_n3,"http://test.com/")
    p.graph.should have(63).triples
  end

  it "should return a XML/RDF description of the service" do

    SemanticResourceTestHelper.with_routing_stubs

    xml = TestActiveRecord.to_service_description(:xml)
    puts "::::::Service description::::::::"
    puts xml
    puts ":::::::::::::::::::::::::::::::::"

    lambda{
      Hpricot.parse(xml)
    }.should_not raise_error

  end

end

describe SemanticResource,"::to_rdf" do
  it "should return a rdfs definition of the class of the model with each property in the mapping included" do
    SemanticResourceTestHelper.with_routing_stubs

    mock_column = mock(:column)
    mock_column.stub!(:name).and_return("foo")

    TestActiveRecord.stub!(:columns).and_return([mock_column])
    rdf_n3 = TestActiveRecord.to_rdf
    puts ":::::::Resource Model RDF::::::::::::"
    puts rdf_n3
    puts ":::::::::::::::::::::::::::::::::::::"

    rdf_n3.index("http://http://").should be_nil

    p = Reddy::N3Parser.new(rdf_n3,"http://test.com/")
    p.graph.should have(7).triples
  end
end

describe SemanticResource,".to_rdf" do
  it "should return a rdf document describing the rdfs instance for the model instance" do
    SemanticResourceTestHelper.with_routing_stubs

    mock_column = mock(:column)
    mock_column.stub!(:name).and_return("foo")

    TestActiveRecord.stub!(:columns).and_return([mock_column])
    TestActiveRecord.stub!(:url_for).and_return("http://test.com/tests/1")

    rdf_n3 = TestActiveRecord.new.to_rdf(:controller => 'tests', :action => 'show', :id => '1')
    puts ":::::::Resource model Instance RDF::::::::::::"
    puts rdf_n3
    puts "::::::::::::::::::::::::::::::::::::::::::::::"

    rdf_n3.index("http://http://").should be_nil

    p = Reddy::N3Parser.new(rdf_n3,"http://test.com/")
    p.graph.should have(3).triples
  end

  it "should return a xml/rdf document describing the rdfs instance for the model instance" do
    SemanticResourceTestHelper.with_routing_stubs

    mock_column = mock(:column)
    mock_column.stub!(:name).and_return("foo")

    TestActiveRecord.stub!(:columns).and_return([mock_column])
    TestActiveRecord.stub!(:url_for).and_return("http://test.com/tests/1")

    rdf_xml = TestActiveRecord.new.to_rdf(:controller => 'tests', :action => 'show', :id => '1', :format => :xml)
    puts ":::::::Resource model Instance RDF::::::::::::"
    puts rdf_xml
    puts "::::::::::::::::::::::::::::::::::::::::::::::"

    rdf_xml.index("http://http://").should be_nil

    lambda{
      Hpricot.parse(rdf_xml)
    }.should_not raise_error
  end
end

describe SemanticResource,".with_service_uri_prefix" do
  it "should concatenate the arguments in the schemas/services route" do
    SemanticResource::Configuration.stub!(:resources_host).and_return("test.com")
    TestActiveRecord.with_service_uri_prefix("a","b","c").should be_eql("<http://test.com/schemas/services/TestActiveRecordabc>")
  end

  it "should concatenate the arguments in the schemas/services route using the last one as a mime type (.mime) if it is\
  provided as a symbol" do
    SemanticResource::Configuration.stub!(:resources_host).and_return("test.com")
    TestActiveRecord.with_service_uri_prefix("a","b","c",:txt).should be_eql("<http://test.com/schemas/services/TestActiveRecordabc.txt>")
  end
end

describe SemanticResource,".build_uri_for_property" do

  it "should correctly generate the URLs for the properties of the model" do

    class TestActiveRecordFoo2 < ActiveRecord::Base

      include SemanticResource

      set_resource_namespace :test, "http://test.com"

      set_resource_mapping do |resource|
        resource[:foo_a] = {:uri =>  [:test, "#foo_a"],
                            :optional => true}

        resource[:foo_b] = {:uri =>  [:test, "#foo_b"]}
        resource[:foo_c] = {:uri =>  "http://test.com#foo_c"}
      end

      define_create_operation(:controller => 'tests', :action => 'create')
      define_show_operation(:controller => 'tests', :action => 'show')

      def initialize
      end

      def self.connection(refresh=false)
        return nil
      end

      def self.columns
      end

      def id
        1
      end

      def foo_a
        2
      end

      def foo_b
        2
      end

      def foo_c
        2
      end

      def foo_d
        2
      end
    end

    TestActiveRecordFoo2.build_uri_for_property(:foo_a).should be_eql("http://test.com#foo_a")
    TestActiveRecordFoo2.build_uri_for_property(:foo_b).should be_eql("http://test.com#foo_b")
    TestActiveRecordFoo2.build_uri_for_property(:foo_c).should be_eql("http://test.com#foo_c")
    TestActiveRecordFoo2.build_uri_for_property(:foo_d).should be_eql("http://test.com#foo_d")

  end

end

describe SemanticResource::Configuration do

  it "should retrieve :rdfa as the default serialization of the HTML resources" do
    SemanticResource::Configuration.default_html_serialization.should be_eql(:rdfa)
  end

  it "should allow to specify a different HTML serialization fo the HTML resources" do
    SemanticResource::Configuration.default_html_serialization.should be_eql(:rdfa)
    SemanticResource::Configuration.set_default_html_serialization(:microformat)
    SemanticResource::Configuration.default_html_serialization.should be_eql(:microformat)
  end

  it "should raise an exception if a bad serialization for HTML is provided" do
    lambda{
      SemanticResource::Configuration.set_default_html_serialization(:nonexistant)
    }.should raise_error
  end
end

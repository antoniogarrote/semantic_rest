require File.dirname(__FILE__) + '/../../spec_helper'
require File.dirname(__FILE__) + '/../../../lib/semantic_resource'
require 'ostruct'

SemanticResource::Configuration.set_resources_host("http://localhost")

describe SemanticResource::ViewHelpers do

  before do
    class TestActiveRecordForController < ActiveRecord::Base

      include SemanticResource

      set_resource_namespace :test, "http://test.com"

      set_resource_mapping do |resource|
        resource[:foo] = [:test, "#foo"]
      end

      define_create_operation(:controller => 'test_semantic', :action => 'create')
      define_show_operation(:controller => 'test_semantic', :action => 'show')

      def initialize
      end

      def self.connection(refresh=false)
        return nil
      end

      def self.columns
        column_foo = OpenStruct.new
        column_foo.name = "foo"

        column_id = OpenStruct.new
        column_id.name = "id"

        [column_foo, column_id]
      end

      def id
        1
      end

      def foo
        2
      end
    end

  end

  it "should generate a string RDFa description of the resource" do
    resource =  TestActiveRecordForController.new
    result = resource.rdfa_description("test.com/1.html")
    puts ":::::::::::::::::::::::::::::::::::     RDFa description     :::::::::::::::::::::::::::::::::::::::::::::::::::"
    puts result
    puts "::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"
    result.should be_eql("<span typeof='http://localhost/schemas/models/TestActiveRecordForController' about='test.com/1.html'  />")
    resource.rdfa_description("test.com/1.html",:tag => 'div').should be_eql("<div typeof='http://localhost/schemas/models/TestActiveRecordForController' about='test.com/1.html'  />")
    resource.rdfa_description("test.com/1.html",:typeof => 'otherthing').should be_eql("<span typeof='otherthing' about='test.com/1.html'  />")
    resource.rdfa_description("test.com/1.html",:typeof => 'type', :tag => 'div', :something => 'great').should be_eql("<div typeof='type' about='test.com/1.html' something='great'  />")
    result = resource.rdfa_description("test.com/1.html") do
      "inside"
    end
    result.should be_eql("<span typeof='http://localhost/schemas/models/TestActiveRecordForController' about='test.com/1.html' >inside</span>")
  end

  it "should generate a string RDFa property description" do
    resource =  TestActiveRecordForController.new
    resource.rdfa_property(:foo,'span').should be_eql("<span property='http://test.com#foo' />")
    resource.rdfa_property(:foo,'span'){ resource.foo }.should be_eql("<span property='http://test.com#foo'>2</span>")
    resource.rdfa_property(:foo,'span', :content => true).should be_eql("<span property='http://test.com#foo' content='2' />")
  end
end

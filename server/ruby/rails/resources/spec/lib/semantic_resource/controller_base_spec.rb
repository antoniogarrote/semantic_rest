require File.dirname(__FILE__) + '/../../spec_helper'
require File.dirname(__FILE__) + '/../../../lib/semantic_resource'
require 'ostruct'

SemanticResource::Configuration.set_resources_host("http://localhost")

describe SemanticResource::ControllerBase do

  before do
    class TestActiveRecordForController < ActiveRecord::Base

      def initialize
      end

      def self.connection(refresh=false)
        return nil
      end

      def self.columns
        column_foo = OpenStruct.new
        column_foo.name = "foo"
        column_foo.datatype = :string

        column_id = OpenStruct.new
        column_id.name = "id"
        column_id.datatype = :integer

        [column_foo, column_id]
      end

      def id
        1
      end

      def foo
        2
      end

      include SemanticResource

      set_resource_namespace :test, "http://test.com"

      set_resource_mapping do |resource|
        resource[:foo] = { :uri =>  [:test, "#foo"],
                           :datatype => :string }

      end

      define_create_operation(:controller => 'test_semantic', :action => 'create')
      define_show_operation(:controller => 'test_semantic', :action => 'show')
    end

    class TestSemanticController < ApplicationController
      include SemanticResource::ControllerBase
    end

  end

  it "should retrieve the semantic resource associated to this controller from the manager" do
    TestSemanticController.semantic_resource.name.should be_eql(TestActiveRecordForController.name)
  end

  it "should generate a finder default method for the instance retrieval" do
    instance = TestSemanticController.new
    instance.should_receive(:params).and_return({:id => "1"})
    TestActiveRecordForController.should_receive(:find).with("1")

    instance.send(:semantic_find)
  end

  it "should generate a default_semantic_show method that retrieve the instance and render its contents"
=begin
do
    instance = TestSemanticController.new
    request = mock(:request)
    request.should_receive(:parameters).twice.and_return({:id => "1", :controller => 'test_semantic', :action => 'show'})
    instance.should_receive(:request).and_return(request)
    model = mock(:null => true)

    TestActiveRecordForController.should_receive(:find).with("1").and_return(model)
    instance.should_receive(:render)

    instance.send(:default_semantic_show)
  end
=end

  it "should generate a default show method for the controller" do
    instance = TestSemanticController.new
    instance.should respond_to(:show)
    instance.should_receive(:default_semantic_show)

    instance.show
  end
end

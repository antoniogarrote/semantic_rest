require File.dirname(__FILE__) + '/../../spec_helper'
require File.dirname(__FILE__) + '/../../../lib/semantic_resource'


describe SemanticResource::Manager, "#resources" do

  it "should be created with the value of an empty array" do
    SemanticResource::Manager.resources.should be_instance_of(Array)
  end

end

describe SemanticResource::Manager, "#register_resource" do

  it "should register a new Class in the resources array" do

    class TestBaseToFind < ActiveRecord::Base

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
        resource[:foo] = { :uri => [:test, "#foo"],
                           :datatype => :string }
      end

      define_create_operation(:controller => 'test_semantic_to_find', :action => 'create')
      define_show_operation(:controller => 'test_semantic_to_find', :action => 'show')
    end

    SemanticResource::Manager.register_resource TestBaseToFind
    SemanticResource::Manager.resources.should include(TestBaseToFind)
  end

end

describe SemanticResource::Manager, "#models" do

  it "should be created with the value of an empty hash" do
    SemanticResource::Manager.models.should be_instance_of(Hash)
  end

end

describe SemanticResource::Manager, "#register_model" do

  it "should register a new Class in the models array" do

    class TestBaseToFind < ActiveRecord::Base

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
        resource[:foo] = { :uri => [:test, "#foo"],
                           :datatype => :integer }
      end

      define_create_operation(:controller => 'test_semantic_to_find', :action => 'create')
      define_show_operation(:controller => 'test_semantic_to_find', :action => 'show')
    end

    SemanticResource::Manager.register_model TestBaseToFind.name,TestBaseToFind
    SemanticResource::Manager.models.keys.should include(TestBaseToFind.name)
  end

end

describe SemanticResource::Manager, "#services" do

  it "should be created with the value of an empty hash" do
    SemanticResource::Manager.services.should be_instance_of(Hash)
  end

end

describe SemanticResource::Manager, "#register_service" do

  it "should register a new Class in the services array" do

    class TestBaseToFind < ActiveRecord::Base

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
        resource[:foo] = { :uri => [:test, "#foo"],
                           :datatype => :integer }
      end

      define_create_operation(:controller => 'test_semantic_to_find', :action => 'create')
      define_show_operation(:controller => 'test_semantic_to_find', :action => 'show')

    end

    SemanticResource::Manager.register_service TestBaseToFind.name,TestBaseToFind
    SemanticResource::Manager.services.keys.should include(TestBaseToFind.name)
  end

end

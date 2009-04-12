require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")

require 'yaml'

require "#{APP_ROOT}/lib/parser/yaml"
require "#{MODELS_PATH}/service_description"
require "#{MODELS_PATH}/operation"
require "#{MODELS_PATH}/message"


describe Parser::Yaml,".load" do
  it "should be able to load a yaml file and transform it into a data structure" do
    parser = Parser::Yaml.new
    hotel_hash = parser.load(path_for_sample("hotel","yaml"))
    hotel_hash.should be_instance_of(Hash)
  end
end

describe Parser::Yaml,".data" do
  it "should allow the client to access the loaded YAML data through 'data' messages" do
    parser = Parser::Yaml.new
    res = parser.load(path_for_sample("hotel","yaml"))
    parser.data.should be_eql(res)
  end
end

describe Parser::Yaml,".parse_services" do
  before(:each) do
    @parser = Parser::Yaml.new

    service_yaml = YAML::load_file(path_for_sample("hotel","yaml"))
    @services = @parser.parse_services service_yaml
  end

  it "should be able to parse a service description read from a YAML file and build a new ServiceDescription object" do

    @services.should be_instance_of(Array)
    @services.should have(1).service
    @services.first.should be_instance_of(ServiceDescription)

    @services.first.identifier.should be_eql("svc")
    @services.first.label.should be_eql("ACME hotels")
  end

  it "should parse all the operations included in the YAML file and add them as Operation objects in the ServiceDescription" do
    @services.first.operations.should have(1).operation
  end

end

describe Parser::Yaml,".parse_operation" do
  before(:each) do
    @parser = Parser::Yaml.new

    operation_yaml = YAML::load_file(path_for_sample("hotel","yaml"))["service"]["operations"].first
    @operation = @parser.parse_operation operation_yaml
  end

  it "should be able to parse an operation description read from a YAML file and build a new Operation object" do
    @operation.should be_instance_of(Operation)

    @operation.identifier.should be_eql("op1")
    @operation.label.should be_eql("getHotelDetails")
    @operation.method.should be_eql(:get)
  end

  it "should add all the input messages read from the YAML file to the Operation object" do
    @operation.input_messages.should have(1).message
  end

  it "should add all the output messages read from the YAML file to the Operation object" do
    @operation.output_messages.should have(1).message
  end

end

describe Parser::Yaml,".parse_message" do
  it "should be able to parse a message description read from a YAML file and build a new Message object" do
    @parser = Parser::Yaml.new

    message_yaml = YAML::load_file(path_for_sample("hotel","yaml"))["service"]["operations"].first["input_messages"].first
    @message = @parser.parse_message message_yaml

    @message.should be_instance_of(Message)

    @message.name.should be_eql("id")
    @message.description.should_not be_nil
    @message.model.should be_eql("http://example.com/data/onto.owl#Hotel")
    @message.transformation.should be_eql("http://example.com/data/hotel.xsparql")
  end

end

describe Parser::Yaml,".parse (class)" do
  it "should be able load a YAML file parse it and return the list of ServiceDescription objects parsed" do
    services = Parser::Yaml.parse(path_for_sample("hotel","yaml"))
    services.should have(1).service
    services.first.should be_instance_of(ServiceDescription)
  end
end

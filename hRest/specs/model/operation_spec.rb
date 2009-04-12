require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")

require "#{MODELS_PATH}/operation"
require "#{MODELS_PATH}/message"

describe Operation,"accessors" do

  include Fixtures

  before(:all) do
    with_valid_operation
  end

  it "should have an identifier" do
    @operation.identifier.should be_eql("op1")
  end

  it "should have a label" do
    @operation.label.should be_eql("getHotelDetails")
  end

  it "should have a method" do
    @operation.method.should be_eql(:get)
  end

  it "should only allow valid HTTP methods: GET,POST,PUT,DELETE,OPTIONS and HEAD" do
    lambda {
      Operation.new(:method => :get)
    }.should_not raise_error

    lambda {
      Operation.new(:method => :post)
    }.should_not raise_error

    lambda {
      Operation.new(:method => :put)
    }.should_not raise_error

    lambda {
      Operation.new(:method => :delete)
    }.should_not raise_error

    lambda {
      Operation.new(:method => :head)
    }.should_not raise_error

    lambda {
      Operation.new(:method => :options)
    }.should_not raise_error

    lambda {
      Operation.new(:method => :foo)
    }.should raise_error
  end

  it "should transform the value passed as method to a downcased symbol" do
    op = Operation.new(:method => "GET")
    op.method.should be_eql(:get)
  end

  it "should have an address" do
    @operation.address.should_not be_nil
  end
end

describe Operation,"input_messages" do

  include Fixtures

  before(:all) do
    with_valid_operation
  end

  it "should allow to retrieve the collection of input messages associated to this operation" do
    @operation.input_messages.should_not be_nil
    @operation.input_messages.should be_instance_of(Array)
  end

  it "should allow to add new messages to the input messages collection" do
    lambda {
      @operation.add_input_message Message.new(:model => 'test',
                                               :transformation => 'test',
                                               :name => 'test',
                                               :description => 'test')
    }.should change(@operation.input_messages,:size).by(1)
  end

end

describe Operation,"output_messages" do

  include Fixtures

  before(:all) do
    with_valid_operation
  end

  it "should allow to retrieve the collection of output messages associated to this operation" do
    @operation.output_messages.should_not be_nil
    @operation.output_messages.should be_instance_of(Array)
  end

  it "should allow to add new messages to the output messages collection" do
    lambda {
      @operation.add_output_message Message.new(:model => 'test',
                                               :transformation => 'test',
                                               :name => 'test',
                                               :description => 'test')
    }.should change(@operation.output_messages,:size).by(1)
  end

end

describe Operation,".to_html" do

  include Fixtures

  before(:all) do
    with_valid_operation
  end

  it "should generate HTML microformated description of the operation with a div tag of class 'operation' and id with the given identifier" do
    html = @operation.to_html
    Hpricot(html).at("/div[@class='operation'][@id='op1']/h2/code[@class='label']").should_not be_nil
  end

  it "should generate HTML microformated for all the input messages contained in the operation" do
    @operation.input_messages.size.should have_at_least(1).message
    html = @operation.to_html
    Hpricot(html).at("/div[@class='operation'][@id='op1']//li[@class='input']").should_not be_nil
  end

  it "should generate HTML microformated for the output response of the operation" do
    @operation.output_messages.size.should have_at_least(1).message
    html = @operation.to_html
    Hpricot(html).at("/div[@class='operation'][@id='op1']//li[@class='output']").should_not be_nil
  end
end

describe Operation,".to_rdfa" do

  include Fixtures

  before(:all) do
    with_valid_operation
  end

  it "should generate a RDFA XHTML description of the service with 'typeOf', 'about' and 'property' annotated attributes" do
    html = @operation.to_rdfa
    Hpricot(html).at("/span[@about='#op1']/h2/code[@property='rdfs:label']").should_not be_nil
  end


  it "should generate RDFA XHTML descriptions for all the input messages contained in the operation" do
    @operation.input_messages.size.should have_at_least(1).message
    html = @operation.to_rdfa
    html.index("wsl:hasInputMessage").should_not be_nil
  end

  it "should generate RDFA XHTML descriptions for all the output messages contained in the operation" do
    @operation.input_messages.size.should have_at_least(1).message
    html = @operation.to_rdfa
    html.index("wsl:hasOutputMessage").should_not be_nil
  end

end

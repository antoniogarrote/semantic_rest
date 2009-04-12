require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")

require "#{MODELS_PATH}/message"

describe Message,"accessors" do

  include Fixtures

  before(:all) do
    with_valid_message
  end

  it "should have a model URI" do
    @valid_message.model.should be_eql("http://example.com/data/onto.owl#Hotel")
  end

  it "should have a transformation URI" do
    @valid_message.transformation.should be_eql("http://example.com/data/hotel.xsparql")
  end

  it "should have a message name" do
    @valid_message.name.should be_eql("id")
  end

  it "should have a description" do
    @valid_message.description.should_not be_nil
  end

end


describe ServiceDescription,".to_html" do

  include Fixtures

  before(:all) do
    with_valid_message
  end

  it "should generate a HTML microformated description of the message with a microformated anchor" do
    html = @valid_message.to_html(:mode => :input)
    Hpricot(html).at("/li[@class='input']/a[@rel='model'][@href='http://example.com/data/onto.owl#Hotel']/code").should_not be_nil
  end

  it "should generate a HTML microformated description of the message with a microformated anchor and class equal the kind of message (input or output)" do
    html = @valid_message.to_html(:mode => :input)
    Hpricot(html).at("/li[@class='input']/a[@rel='model'][@href='http://example.com/data/onto.owl#Hotel']/code").should_not be_nil

    html = @valid_message.to_html(:mode => :output)
    Hpricot(html).at("/li[@class='output']/a[@rel='model'][@href='http://example.com/data/onto.owl#Hotel']/code").should_not be_nil
  end

end


describe ServiceDescription,".to_rdfa" do

  include Fixtures

  before(:all) do
    with_valid_message
  end

  it "should generate a RDFA XHTML description of the message with 'typeOf', 'about' and 'property' annotated attributes" do
    html = @valid_message.to_rdfa(:mode => :input)
    html.index("typeOf=\"wsl:Message\"").should_not be_nil
  end

end


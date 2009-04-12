require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")

require "#{MODELS_PATH}/service_description"

describe ServiceDescription,"accessors" do

  include Fixtures

  before(:all) do
    with_valid_service
  end

  it "should have a service identifier" do
    @service_description.identifier.should be_eql("svc")
  end

  it "should have a service name label" do
    @service_description.label.should be_eql("ACME hotels")
  end

end

describe ServiceDescription,".operations" do

  include Fixtures

  before(:all) do
    with_valid_service
    with_valid_operation
  end

  it "should allow to retrieve operations froma service" do
    @service_description.operations.should have(1).operations
    @service_description.operations.first.identifier.should be_eql(@operation.identifier)
  end

  it "should allow to add operations to the service" do
    @service_description.operations.should have(1).operations
    @service_description.add_operation Operation.new(:identifier => 'test',
                                               :label => 'test',
                                               :method => :get)
    @service_description.operations.should have(2).operations
  end
end

describe ServiceDescription,".to_html" do

  include Fixtures

  before(:all) do
    with_valid_service
  end

  it "should generate a HTML microformated description of the service with a div tag of class 'service' and id with the given identifier" do
    html = @service_description.to_html
    Hpricot(html).search("/div[@class='service'][@id='svc']/span[@class='label']").should_not be_nil
  end

  it "should generate a HTML description of the service containing the HTML microformated descriptions of its operations" do
    html = @service_description.to_html
    Hpricot(html).at("/div[@class='service'][@id='svc']/div[@id='op1'][@class='operation']").should_not be_nil
  end

end

describe ServiceDescription,".to_rdfa" do

  include Fixtures

  before(:all) do
    with_valid_service
  end

  it "should generate a RDFA XHTML description of the service with 'typeOf', 'about' and 'property' annotated attributes" do
    html = @service_description.to_rdfa
    Hpricot(html).at("/div[@about='#svc']/h1/span[@property='rdfs:label']").should_not be_nil
  end

  it "should generate a RDFA XHTML description of the service containing the annotated attributes of the contained operations" do
    html = @service_description.to_rdfa
    Hpricot(html).at("/div[@about='#svc']/div/span[@about='#op1']").should_not be_nil
  end

end

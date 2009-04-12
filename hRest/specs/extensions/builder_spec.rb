require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")

require "#{APP_ROOT}/lib/extensions/builder"

describe Builder::XmlBase,".next_blank_node" do
  it "should generate increasing anonymous node identifiers" do
    ids = []

    builder = Builder::XmlMarkup.new

    (0..3000).each do |i|
      next_id = builder.next_blank_node
      ids.push next_id
    end

    ids.should be_eql(ids.uniq)
  end
end

describe Builder::XmlBase,".reset_blank_node_generator" do
  it "should reset the generation of new blank nodes" do

    builder = Builder::XmlMarkup.new

    builder.reset_blank_node_generator

    orig_id = builder.next_blank_node
    builder.next_blank_node.should_not be_eql(orig_id)

    builder.reset_blank_node_generator
    builder.next_blank_node.should be_eql(orig_id)
  end
end

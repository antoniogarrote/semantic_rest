require File.expand_path(File.dirname(__FILE__) + "/spec_helper")

require "#{MODELS_PATH}/service_description"
require "#{MODELS_PATH}/operation"
require "#{MODELS_PATH}/message"

module Fixtures

  def with_valid_message
    @valid_message = Message.new(:model => "http://example.com/data/onto.owl#Hotel",
                                 :transformation => "http://example.com/data/hotel.xsparql",
                                 :name => "id",
                                 :description => "the identifier of the particular hotel")
    return @valid_message
  end

  def with_valid_operation
    @operation = Operation.new(:identifier => "op1",
                               :address => "http://example.com/h/{id}",
                               :label => "getHotelDetails",
                               :method => :get)

    @operation.add_input_message with_valid_message
    @operation.add_output_message with_valid_message

    return @operation
  end

  def with_valid_service
    @service_description = ServiceDescription.new(:identifier => "svc",
                                                  :label => "ACME hotels")

    op = with_valid_operation
    @service_description.add_operation op
    return @service_description
  end

end

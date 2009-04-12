require 'yaml'

require "#{MODELS_PATH}/service_description"
require "#{MODELS_PATH}/operation"
require "#{MODELS_PATH}/message"

module Parser

  class Yaml

    attr_accessor :data

    def self.parse(path)
      parser = Yaml.new
      parser.load(path)
      parser.parse_services parser.data
    end

    def load(path)
      @data = YAML::load_file(path)
    end

    def parse_services data
      if data.instance_of? Array
        data.collect{|service| self.parser_services(service).first}
      else
        service_yaml = data[:service] || data["service"]
        raise Exception.new("Invalid structure, service key not found") if service_yaml.nil?

        service = ServiceDescription.new(:identifier => service_yaml[:identifier] || service_yaml["identifier"],
                                         :label => service_yaml[:label] || service_yaml["label"])
        operations_yaml = service_yaml[:operations] || service_yaml["operations"]

        operations_yaml.each do |op_yaml|
          service.add_operation parse_operation(op_yaml)
        end

        [service]
      end
    end

    def parse_operation data
      operation = Operation.new(:identifier => data["identifier"] || data[:identifier],
                                :label => data["label"] || data[:label],
                                :method => data["method"] || data[:method],
                                :address => data["address"] || data[:address])

      input_msgs_yaml = data["input_messages"] || data[:input_messages]
      input_msgs_yaml.each do |im|
        operation.add_input_message parse_message(im)
      end

      output_msgs_yaml = data["output_messages"] || data[:output_messages]
      output_msgs_yaml.each do |im|
        operation.add_output_message parse_message(im)
      end

      operation
    end

    def parse_message data
      message = Message.new(:model => data["model"] || data[:model],
                            :transformation => data["lowering"] || data[:lowering] || data["lifting"] || data[:lifting],
                            :name => data[:name] || data["name"],
                            :description => data[:description] || data["description"])
      message
    end
  end

end

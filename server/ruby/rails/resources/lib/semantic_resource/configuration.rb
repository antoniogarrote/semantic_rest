require 'action_controller'
require File.join(File.dirname(__FILE__), 'restful_jsonp_middleware')

module SemanticResource

  class Configuration

    extend ActionController::UrlWriter

    SIESTA_NAMESPACE = "http://semantic_rest/siesta#"
    SIESTA_ID = "#{SIESTA_NAMESPACE}id"

    # sets the host used in the generation of
    # resources URIs
    def self.set_resources_host(host)
      @@resources_host = host.gsub("http://","")
    end

    # Retrieves the host set as the host used
    # in the generation of resource's URIs
    def self.resources_host
      @@resources_host
    end

    def self.define_creation_operation(res,options,params=nil)
      params = res.resource_mapping.keys if params.nil?
      res_name = res.class.name.downcase
      params = params.inject(Hash.new){|h,p| h["#{res_name}[#{p}]"] = "{#{p}}"; h}
      url_for(options.merge(params).merge(:host => SemanticResource::Configuration.resources_host))
    end

    def self.namespaces_map
      begin
        @@namespaces_map
      rescue NameError
        @@namespaces_map = {}
        retry
      end
    end

    def self.setup_middleware(rails_configuration)
      rails_configuration.middleware.insert_before(Rack::MethodOverride,SemanticResource::RestfulJsonpMiddleware)
    end

  end
end

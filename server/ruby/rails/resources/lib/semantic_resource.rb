# we must be sure that all the models has been loaded before proceeding
Dir["#{RAILS_ROOT}/app/models**/*.rb"].each do |f|
  require f
end

=begin
module Rack
  class MethodOverride
    def call(env)
      #if env["REQUEST_METHOD"] == "POST"
        req = Request.new(env)
        method = req.POST[METHOD_OVERRIDE_PARAM_KEY] ||
          env[HTTP_METHOD_OVERRIDE_HEADER] || req.params[METHOD_OVERRIDE_PARAM_KEY]
        method = method.to_s.upcase
        if HTTP_METHODS.include?(method)
          env["rack.methodoverride.original_method"] = env["REQUEST_METHOD"]
          env["REQUEST_METHOD"] = method
        end
      #end

      @app.call(env)
    end
  end
end
=end

require File.dirname(__FILE__) + '/semantic_resource/controller_common'
require File.dirname(__FILE__) + '/semantic_resource/manager'
require File.dirname(__FILE__) + '/semantic_resource/view_helpers'
require File.dirname(__FILE__) + '/semantic_resource/base'
require File.dirname(__FILE__) + '/semantic_resource/controller_base'
require File.dirname(__FILE__) + '/semantic_resource/configuration'
require File.dirname(__FILE__) + '/semantic_resource/schemas_controller'

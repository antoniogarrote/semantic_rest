module SemanticResource

  # Allows overwriting of HTTP method also in
  # GET HTTP requests in order to allow
  # RESTful JSONP calls
  class RestfulJsonpMiddleware

    HTTP_METHODS = %w(GET HEAD PUT POST DELETE OPTIONS)

    METHOD_OVERRIDE_PARAM_KEY = "_method".freeze
    HTTP_METHOD_OVERRIDE_HEADER = "HTTP_X_HTTP_METHOD_OVERRIDE".freeze

    attr_accessor :method_parameter_name

    def initialize(app)
      @app = app
      @method_parameter_name = METHOD_OVERRIDE_PARAM_KEY
    end

    # We check if the method parameter is in the request
    # and set up the request to allow the execution of the
    # overwritten HTTP method
    def call(env)
      req = ActionController::Request.new(env)
      method = req.params[@method_parameter_name]
      method = method.to_s.upcase
      if HTTP_METHODS.include?(method)
        env["rack.methodoverride.original_method"] = env["REQUEST_METHOD"]
        env["REQUEST_METHOD"] = "POST"
        env[HTTP_METHOD_OVERRIDE_HEADER] = method
      end
      @app.call(env)
    end
  end
end

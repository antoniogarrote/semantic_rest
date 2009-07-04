module SemanticResource

  # Base module for the controllers of semantic resources
  module ControllerBase

    def self.included(base)

      # we retrieve the semantic resource associated
      # to this semantic controller
      base.instance_eval do
        def semantic_resource
          return @semantic_resource if defined?(@semantic_resource) && !@semantic_resource.nil?
          controller_key = self.name.underscore.gsub("_controller","")
          SemanticResource::Manager.resources.each do |resource|
            resource.semantic_operations.each_pair do |op,args|
              if args[:controller] == controller_key
                @semantic_resource = resource
                return @semantic_resource
              end
            end
          end

          raise Exception.new("Cannot find semantic resource for controller #{self.name}")
        end
      end
      base.send(:include,SemanticResource::ControllerCommon)
      base.send(:include,InstanceMethods)
    end


    # This module includes default implementations for the
    # operations in the semantic service.
    module InstanceMethods

      def create
        default_semantic_create
      end

      def update
      end

      def destroy
      end

      # Show method is generated with a simple invocation to default_semantic_show
      def show
        default_semantic_show
      end

      # we don't want this operations to be called as actions.
      # The user should redefine the methods in order to change the behaviour.
      protected

      # generates the response
      def default_semantic_show
        resource = self.class.semantic_resource

        format = params[:format] || :n3
        format = format.to_sym

        base_response = semantic_find.to_rdf(request.parameters.symbolize_keys,format)
        base_response,content_type = check_jsonp_response(base_response)

        if(format == :n3 || format == :rdf)
          if(content_type.nil?)
            content_type = "text/rdf+n3"
          end
        elsif(format == :xml)
          if(content_type.nil?)
            content_type = "application/rdf+xml"
          end
        end

        render(:text => base_response,
               :content_type => content_type,
               :status => 200)
      end

      def default_semantic_create
        resource = self.class.semantic_resource

        format = params[:format] || :n3
        format = format.to_sym

        created_resource = semantic_create
        base_response = created_resource.to_rdf(request.parameters.merge(:id => created_resource.id).symbolize_keys,format)
        base_response,content_type = check_jsonp_response(base_response)

        if(format == :n3 || format == :rdf)
          if(content_type.nil?)
            content_type = "text/rdf+n3"
          end
        elsif(format == :xml)
          if(content_type.nil?)
            content_type = "application/rdf+xml"
          end
        end

        render(:text => base_response,
               :content_type => content_type,
               :status => 201)
      end

      # retrieves the semantic resource
      def semantic_find
        self.class.semantic_resource.find(params[:id])
      end

      # creates the semantic resource
      def semantic_create
        creation_params = {}
        params.each_pair{|k,v| creation_params[k]=v unless(k.to_sym==:_method || k.to_sym==:callback || k.to_sym==:controller || k.to_sym==:action || k.to_sym==:format || v.nil?)}
        self.class.semantic_resource.create(creation_params)
      end
    end

  end

end

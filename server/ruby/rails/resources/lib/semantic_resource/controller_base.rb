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
        default_semantic_update
      end

      def destroy
        default_semantic_destroy
      end

      # Show method is generated with a simple invocation to default_semantic_show
      def show
        default_semantic_show
      end

      def index
        default_semantic_index
      end

      # we don't want this operations to be called as actions.
      # The user should redefine the methods in order to change the behaviour.
      protected

      # generates the response
      def default_semantic_index
        resource = self.class.semantic_resource

        format = params[:format] || :n3
        format = format.to_sym

        base_response = StringIO.new
        base_response << resource.to_instance_rdf_upper_partial(format)
        semantic_find_all.each do |r|
          base_response << r.to_rdf(request.parameters.merge(:id => r.id).symbolize_keys,format,true)
        end
        base_response << resource.to_instance_rdf_lower_partial(format)
        base_response,content_type = check_jsonp_response(base_response.string)

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

      def default_semantic_update
        resource = self.class.semantic_resource

        format = params[:format] || :n3
        format = format.to_sym

        updated_resource = semantic_update
        base_response = updated_resource.to_rdf(request.parameters.symbolize_keys,format)
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

      # retrieves the semantic resource
      def semantic_find_all
        attributes = self.class.semantic_resource.columns.collect{|c| c.name.to_sym }
        conditions = { }
        params.keys.each{|p|  conditions[p] = params[p] if attributes.include?(p.to_sym) }
        self.class.semantic_resource.find(:all, :conditions =>  conditions)
      end

      # retrieves the semantic resources for an index action
      def semantic_find
        self.class.semantic_resource.find(params[:id])
      end

      # destroys the semantic resource
      def semantic_destroy(resource)
        resource.destroy
      end

      # creates the semantic resource
      def semantic_create
        creation_params = {}
        params.each_pair{|k,v| creation_params[k]=v unless(k.to_sym==:_method || k.to_sym==:callback || k.to_sym==:controller || k.to_sym==:action || k.to_sym==:format || v.nil?)}
        self.class.semantic_resource.create(creation_params)
      end

      # creates the semantic resource
      def semantic_update
        update_params = {}
        to_update = semantic_find
        params.each_pair{|k,v| update_params[k]=v if(k.to_s != "id" &&
                                                     to_update.attribute_names.include?(k)) }

        to_update.update_attributes(update_params.symbolize_keys)
        to_update
      end
    end

    def default_semantic_destroy
        resource = self.class.semantic_resource

        format = params[:format] || :n3
        format = format.to_sym

        to_destroy = semantic_find
        base_response = to_destroy.to_rdf(request.parameters.symbolize_keys,format)
        base_response,content_type = check_jsonp_response(base_response)

        semantic_destroy(to_destroy)

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


  end

end

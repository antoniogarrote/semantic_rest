require 'semantic_resource/xsd_datatypes'

module SemanticResource


  def self.included(base)
    base.send(:unloadable)
    base.extend(ClassMethods)
    base.send(:include,SemanticResource::ViewHelpers)
    base.send(:extend,SemanticResource::ViewHelpers)

    # The resource is registered
    base.register_semantic_resource
  end

    def uri_for_resource(parent,params,show_extension = false)
      unless(parent.nil?)
        params[:controller] = self.class.semantic_operations[:show][:controller]
        self.class.resource_mapping.each_pair do |key,value|
          if(value[:relation] == parent)
            params = params.merge(value[:relation_key].to_sym => params[:id])
          end
        end
      end

      params[:id] = self.id

      params[:action] = 'show' if params[:action] == 'create' || params[:action] == 'index'
      params[:format] = params[:format].to_sym if params[:format]

      res_name = self.class.url_for(params.merge(:host => SemanticResource::Configuration.resources_host))

      res_name = res_name.split("?").first;
      res_name = res_name.split(".")[0] unless show_extension
      res_name
    end

  # Methods to be included
  def to_rdf(params,format = :n3,partial = false)
    res_name = if params.instance_of?(String)
      # we have received a URL for the resource, for instance,
      # with the result of the calling to a resource_path or resource_url function
      "http://#{SemanticResource::Configuration.resources_host}#{params}"
    else
      self.uri_for_resource(nil,params)
    end
    res_name = res_name.split("?").first;
    res_name = res_name.split(".")[0]

    format = format.to_sym
    if(format == :n3 || format == :rdf)

      rdf = StringIO.new

      unless(partial)
        rdf << "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
        rdf << "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
        rdf << "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"
      end

      rdf << "<#{res_name}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <#{self.class.resource_model_uri}> .\n"
      rdf << "<#{res_name}> <#{SemanticResource::Configuration::SIESTA_ID}> \"#{self.id}\" .\n"

      self.class.resource_mapping.each_pair do |key,value|
        value_of_property = self.send(key)
        if !value[:relation].nil?
          if value_of_property.respond_to?(:each)
            value_of_property.each do |v|
              rdf << "<#{res_name}> #{instance_build_mapping_rdf_description(res_name,key,value,params,v,format)}"
            end
          else
            rdf << "<#{res_name}> #{instance_build_mapping_rdf_description(res_name,key,value,params,value_of_property,format)}"
          end
        else
          rdf << "<#{res_name}> #{instance_build_mapping_rdf_description(res_name,key,value,params,nil,format)}" unless value_of_property.nil?
        end
      end

      rdf.string

    elsif(format == :xml)
      xml = StringIO.new
      unless(partial)
        xml << "<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'"
        self.class.namespaces_for_resource.each_pair do |ns,uri|
          uri = "#{uri}#" unless uri[-1..-1] == "#" ||  uri[-1..-1] == "/"
          xml << " xmlns:#{ns}='#{uri}'"
        end
        xml << " xmlns:siesta='#{SemanticResource::Configuration::SIESTA_NAMESPACE}'>"
      end
      xml << "<rdf:Description rdf:about='#{res_name}'>"
      xml << "<rdf:type rdf:resource='<#{self.class.resource_model_uri}>'/>"
      xml << "<siesta:id>#{self.id}</siesta:id>"

      self.class.resource_mapping.each_pair do |key,value|
        value_of_property = self.send(key)
        if !value[:relation].nil?
          if value_of_property.instance_of?(Array)
            value_of_property.each do |v|
              xml << instance_build_mapping_rdf_description(res_name,key,value,params,v,format)
            end
          else
            xml << instance_build_mapping_rdf_description(res_name,key,value,params,value_of_property,format)
          end
        else
          xml << instance_build_mapping_rdf_description(res_name,key,value,params,nil,format)
        end
      end

      xml << "</rdf:Description>"
      unless(partial)
      xml << "</rdf:RDF>"
      end
      xml.string

    elsif(format == :html)
      model_ref = self.class.resource_model_uri
      html = StringIO.new
      unless(partial)
        html << "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
        html << "<html xmlns='http://www.w3.org/1999/xhtml' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'>"
        html << "<head><title>#{res_name}</title></head>"
        html << "<body>"
      end
      html << "<h1>#{res_name}</h1>"

      html << "<p><b>Type:</b> <code>"
      html << rdfa_relation("rdfs:type", :a, model_ref) do
        "#{model_ref}"
      end
      html << "</code></p>"
      html << "<b>Properties</b>"
      html << "<ul>"
      html << rdfa_property("#{SemanticResource::Configuration::SIESTA_NAMESPACE}id", :li,:content => self.id) do
        "id: #{self.id}"
      end
      self.class.resource_mapping.each_pair do |key,value|
        value_of_property = self.send(key)
        if !value[:relation].nil?
          if value_of_property.instance_of?(Array)
            value_of_property.each do |v|
              html << rdfa_property(key, :li, :rel => v.uri_for_resource(self.class,params)) do
                "#{key}: <a href='#{v.uri_for_resource(self.class,params,true)}'>#{v.id}</a>"
              end
            end
          else
            html << rdfa_property(key, :li, :rel => value_of_property.uri_for_resource(self.class,params)) do
              "#{key}: <a href='#{value_of_property.uri_for_resource(self.class,params,true)}'>#{value_of_property.id}</a>"
            end
          end
        else
          unless value_of_property.nil?
            html << rdfa_property(key, :li, :content => value_of_property) do
              "#{key}: #{value_of_property}"
            end
          end
        end
      end
      html << "</ul>"
      unless(partial)
        html << "</body>"
        html << "</html>"
      end
      html.string
    end
  end

  def instance_build_mapping_rdf_description(res_name,key,value,params,object = nil,format = :n3)
    if(format == :n3 || format == :rdf)
      rdf = StringIO.new
      if self.class.columns.detect{|column| column.name.to_sym == key.to_sym}
        res_value = self.send(key)
        return "" if res_value.nil?
        rdf << "<#{self.class.build_uri_for_property(key)}> \"#{res_value}\".\n"
      elsif !value[:relation].nil?
        rdf << "<#{self.class.build_uri_for_property(key)}> <#{object.uri_for_resource(self.class,params)}> .\n"
      elsif association = self.class.reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
        #TODO: rdf << "#{self.class.with_service_uri_prefix(res_name)} <#{SemanticResource::Configuration.namespaces_map[value.first]}#{value.last}>  .\n"
      end
      rdf.string
    elsif(format == :xml)
      xml = StringIO.new
      if self.class.columns.detect{|column| column.name.to_sym == key.to_sym}
        prop = self.class.build_uri_for_property(key,format)
        xml << "<#{prop}>#{res_value}</#{prop}>"
      elsif !value[:relation].nil?
        xml << "<#{self.class.build_uri_for_property(key)} rdf:resource=\"#{object.uri_for_resource(self.class,params)}\" /> "
      elsif association = self.class.reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
        #TODO:
      end
      xml.string
    end
  end

  # Methods to be extended
  module ClassMethods

    def build_uri_for_property(value,format = :n3)
      if(format == :n3)
        if resource_mapping[value].nil? || resource_mapping[value][:uri].nil?
          #no mapping? we use the default registerd namespace and the value
          "#{resource_namespace.second}##{value.to_s}"
        else
          uri_mapping = resource_mapping[value][:uri]
          if uri_mapping.instance_of? String
            uri_mapping
          else
            "#{SemanticResource::Configuration.namespaces_map[uri_mapping.first]}#{uri_mapping.last}"
          end
        end
      elsif(format == :xml)
        if resource_mapping[value].nil? || resource_mapping[value][:uri].nil?
          #no mapping? we use the default registerd namespace and the value
          "#{resource_namespace.first}##{value.to_s}"
        else
          uri_mapping = resource_mapping[value][:uri]
          if uri_mapping.instance_of? String
            uri_mapping
          else
            "#{uri_mapping.first}:#{uri_mapping.second.split("#").second}"
          end
        end
      end
    end

    def register_semantic_resource
      SemanticResource::Manager.register_resource(self)
      SemanticResource::Manager.register_model(self.name, self)
      SemanticResource::Manager.register_service("#{self.name}Service", self)
      lowering_operations = Hash.new
      lowering_operations["index"] = "sparql_lowering_index"
      lowering_operations["show"] = "sparql_lowering_show"
      lowering_operations["create"] = "sparql_lowering_create"
      lowering_operations["destroy"] = "sparql_lowering_destroy"
      lowering_operations["update"] = "sparql_lowering_update"
      SemanticResource::Manager.register_lowering_operation(self.name, lowering_operations)
    end

    # A hash where the defined operations parameters for this resource will be stored
    def semantic_operations
      @semantic_operations = Hash.new unless defined? @semantic_operations
      @semantic_operations
    end

  def to_instance_rdf_upper_partial(format = :n3)

    if(format == :n3 || format == :rdf)

      rdf = StringIO.new

      rdf << "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
      rdf << "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
      rdf << "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"

      rdf.string

    elsif(format == :xml)

      xml = StringIO.new
      xml << "<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'"
      namespaces_for_resource.each_pair do |ns,uri|
        uri = "#{uri}#" unless uri[-1..-1] == "#" ||  uri[-1..-1] == "/"
        xml << " xmlns:#{ns}='#{uri}'"
      end
      xml << " xmlns:siesta='#{SemanticResource::Configuration::SIESTA_NAMESPACE}'>"

      xml.string

    elsif(format == :html)

      html = StringIO.new
      html << "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
      html << "<html xmlns='http://www.w3.org/1999/xhtml' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'>"
      html << "<head><title>#{self} resources</title></head>"
      html << "<body>"

      html.string

    end
  end

  def to_instance_rdf_lower_partial(format = :n3)
    if(format == :n3 || format == :rdf)
      ""
    elsif(format == :xml)
      "</rdf:RDF>"
    elsif(format == :html)
      "</body></html>"
    end
  end

    def to_rdf(format = :n3)
      if(format == :n3 || format == :rdf)

        rdf = StringIO.new

        rdf << "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
        rdf << "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
        rdf << "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"

        rdf << "<#{resource_model_uri}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Class .\n"
        rdf << "<#{SemanticResource::Configuration::SIESTA_ID}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property .\n"
        rdf << "<#{SemanticResource::Configuration::SIESTA_ID}> rdfs:domain <#{resource_model_uri}> .\n"
        rdf << "<#{SemanticResource::Configuration::SIESTA_ID}> rdfs:range rdfs:Datatype .\n"

        @mapping.each_pair do |key,value|
          rdf << build_mapping_rdf_description(key,value,format)
        end

        rdf.string

      elsif(format == :xml)
        model_ref = "http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}"
        xml = StringIO.new
        xml << "<?xml version='1.0'?>"
        xml << "<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'>"
        xml << "<rdf:Description rdf:about='#{model_ref}'> <rdf:type rdf:resource='http://www.w3.org/2000/01/rdf-schema#Class'/> </rdf:Description>"
        xml << "<rdf:Description rdf:about='http://semantic_rest/siesta#id'>"
        xml << "<rdf:type rdf:resource='http://www.w3.org/2000/01/rdf-schema#Property'/>"
        xml << "<rdfs:domain rdf:resource='#{model_ref}'/>"
        xml << "<rdfs:range rdf:resource='http://www.w3.org/2000/01/rdf-schema#Datatype'/>"
        xml << "</rdf:Description>"

        @mapping.each_pair do |key,value|
          xml << build_mapping_rdf_description(key,value,format)
        end
        xml << "</rdf:RDF>"
        xml.string.gsub("&","&amp;")
        xml.string

      elsif(format == :html)
        model_ref = "http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}"
        html = StringIO.new
        html << "<?xml version='1.0' encoding='UTF-8'?>"
        html << "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML+RDFa 1.0//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd'>"
        html << "<html xmlns='http://www.w3.org/1999/xhtml' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'>"
        html << "<head><title>#{model_ref}</title></head>"
        html << "<body>"
        html << rdfa_description(model_ref,:typeof => "rdfs:Class", :tag => 'h1') do
          "model <code>#{model_ref}</code>"
        end
        html << "<h2>Properties</h2>"
        html << rdfa_description("http://semantic_rest/siesta#id", :tag => :div, :typeof => 'rdfs:Property') do
          property_html = StringIO.new
          property_html << "<b>id</b>"
          property_html << "<ul>"
          property_html << "<li>domain: <code>"
          property_html << rdfa_relation("rdfs:domain",:a, model_ref) do
            "#{model_ref}"
          end
          property_html << "</code></li>"
          property_html << rdfa_relation("rdfs:range",:li,"http://www.w3.org/2000/01/rdf-schema#Datatype") do
            "range: <code>http://www.w3.org/2000/01/rdf-schema#Datatype</code>"
          end
          property_html << "</ul>"
          property_html.string
        end
        @mapping.each_pair do |key,value|
          if self.columns.detect{|column| column.name.to_sym == key.to_sym}

            html << rdfa_description(build_uri_for_property(key), :tag => :div, :typeof => 'rdfs:Property') do
              property_html = StringIO.new
              property_html << "<b>#{key}</b>"
              property_html << "<ul>"
              property_html << "<li>domain: <code>"
              property_html << rdfa_relation("rdfs:domain",:a, model_ref) do
                "#{model_ref}"
              end
              property_html << "</code></li>"
              property_html << rdfa_relation("rdfs:range",:li, value[:datatype]) do
                "range: <code>#{value[:datatype]}</code>"
              end
              property_html << "</ul>"
              property_html.string
            end

          elsif !value[:relation].nil?
            html << rdfa_description(build_uri_for_property(key), :tag => :div, :typeof => 'rdfs:Property') do
              property_html = StringIO.new
              property_html << "<b>#{key}</b>"
              property_html << "<ul>"
              property_html << "<li>domain: <code>"
              property_html << rdfa_relation("rdfs:domain",:a, model_ref) do
                "#{model_ref}"
              end
              property_html << "</code></li>"
              property_html << rdfa_relation("rdfs:range",:li, value[:relation].resource_model_uri) do
                "range: <code><a href='#{value[:relation].resource_model_uri}.html'>#{value[:relation].resource_model_uri}</a></code>"
              end
              property_html.string
            end
          elsif association = self.reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
            html << rdfa_description(build_uri_for_property(key), :tag => :div, :typeof => 'rdfs:Property') do
              property_html = StringIO.new
              property_html << "<b>#{key}</b>"
              property_html << "<ul>"
              property_html << "<li>domain: <code>"
              property_html << rdfa_relation("rdfs:domain",:a, model_ref) do
                "#{model_ref}"
              end
              property_html << "</code></li>"
              property_html << rdfa_relation("rdfs:range",:li, association.active_record.resource_model_uri) do
                "range: <code><a href='#{association.active_record.resource_model_uri}.html'>#{association.active_record.resource_model_uri}</a></code>"
              end
              property_html.string
            end
          end

        end

        html << "</body>"
        html << "</html>"
        html.string
      end
    end

    def set_resource_namespace(name,uri=nil)
      @siesta_base_namespace_name = name
      @siesta_base_namespace_uri = uri
      SemanticResource::Configuration.namespaces_map[name] = uri
    end

    def resource_namespace
      return @siesta_base_namespace_name, @siesta_base_namespace_uri
    end

    def set_resource_path(*resources)
      @resource_path = resources
    end

    def resource_path
      if @resource_path
        return @resource_path
      else
        return []
      end
    end

    def set_resource_mapping
      @mapping = Hash.new
      yield @mapping
      @mapping.each_pair do |key,value|
        if reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
          if @mapping[key][:relation].nil?
            @mapping[key][:relation] = reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}.klass
          elsif @mapping[key][:relation].instance_of?(Symbol)
            @mapping[key][:relation] = reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}.klass
          end
          if @mapping[key][:arity].nil?
            @mapping[key][:arity] = reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}.macro
          end
          @mapping[key][:relation_key] = reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}.association_foreign_key
        else
          column = self.columns.detect{|column| column.name.to_sym == key.to_sym}
          if @mapping[key][:datatype].nil?
            @mapping[key][:datatype] = SemanticResource::XSD.send(column.type)
          elsif @mapping[key][:datatype].instance_of? Symbol
            @mapping[key][:datatype] = SemanticResource::XSD.send(@mapping[key][:datatype])
          end
        end
      end
    end

    def resource_mapping
      @mapping
    end

    def namespaces_for_resource
      namespaces = []
      resource_mapping.each_pair do |k,m|
        ns = m[:uri].first if m.keys.include?(:uri) || nil
        namespaces.push(ns) if ns && !namespaces.include?(ns)
      end
      namespaces.inject({}) do |acum,elem|
        acum[elem] = SemanticResource::Configuration.namespaces_map[elem]
        acum
      end
    end

    def with_service_uri_prefix(*args)
      args = (args[0..-2]).push(".#{args[-1].to_s}") if args[-1].instance_of?(Symbol) # mime type last arg?
      "<http://#{SemanticResource::Configuration.resources_host}/schemas/services/#{self.name}#{args.join('')}>"
    end

    def with_service_uri_prefix_xml(*args)
      args = (args[0..-2]).push(".#{args[-1].to_s}") if args[-1].instance_of?(Symbol) # mime type last arg?
      "http://#{SemanticResource::Configuration.resources_host}/schemas/services/#{self.name}#{args.join('')}"
    end

    def resource_model_uri
      "http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}"
    end

    def to_service_description(format=:n3)

      if(format == :n3)
        rdf = StringIO.new

        # namespaces
        rdf << "@prefix hr: <http://www.wsmo.org/ns/hrests#> .\n"
        rdf << "@prefix hrjs: <http://semantic_rest.org/ns/hrests_js#> .\n"
        rdf << "@prefix wsl: <http://www.wsmo.org/ns/wsmo-lite#> .\n"
        rdf << "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
        rdf << "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
        rdf << "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"
        rdf << "@prefix sawsdl: <http://www.w3.org/ns/sawsdl#> .\n"

        # service
        rdf << "#{with_service_uri_prefix('Service')} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Service ;\n"
        rdf << "  rdfs:isDefinedBy #{with_service_uri_prefix('Service')} ;\n"
        rdf << "  sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> .\n"

        # [:create_operation, :show_operation, :index_operation, :update_operation, :destroy_operation].each do |op|
        # TODO: fill all the operations

        operations = StringIO.new
        [:index_operation, :show_operation, :create_operation, :destroy_operation, :update_operation].each do |op|
          desc = self.send(op)
          unless desc.nil?
            operation_name = if(op == :create_operation)
                               with_service_uri_prefix "#create#{self.name}"
                             elsif(op == :show_operation)
                               with_service_uri_prefix "#show#{self.name}"
                             elsif(op == :destroy_operation)
                               with_service_uri_prefix "#destroy#{self.name}"
                             elsif(op == :update_operation)
                               with_service_uri_prefix "#update#{self.name}"
                             elsif(op == :index_operation)
                               with_service_uri_prefix "#index#{self.name}"
                             end
            rdf << "#{with_service_uri_prefix('Service')} wsl:hasOperation #{operation_name} .\n"
            operations << desc.call(:n3)
          end
        end

        rdf << operations.string
        rdf.string
      elsif(format == :html)
        html = StringIO.new

        if(SemanticResource::Configuration.default_html_serialization == :microformat)
          html << "<div class='service' id='svc'><h1><span class='label'>#{self.name} Service</span></h1>"
          [:create_operation, :show_operation, :destroy_operation, :update_operation].each do |op|
            desc = self.send(op)
            unless desc.nil?
              operation_name = if(op == :create_operation)
                                 "#create#{self.name}"
                               elsif(op == :show_operation)
                                 "#show#{self.name}"
                               elsif(op == :update_operation)
                                 "#update#{self.name}"
                               elsif(op == :destroy_operation)
                                 "#destroy#{self.name}"
                               elsif(op == :index_operation)
                                 "#index#{self.name}"
                               end
              html << "<div class='operation' id='#{operation_name}'>"
              html << "<h2> Operation <code class='label'>#{operation_name}</code></h2>"
              html << desc.call(:html)
              html << "</div>"
            end
          end
          html << "</div>"
          html.string
        elsif(SemanticResource::Configuration.default_html_serialization == :rdfa )
          html << "<div xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'
          xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#' xmlns:sawsdl='http://www.w3.org/ns/sawsdl#'
          xmlns:wsl='http://www.wsmo.org/ns/wsmo-lite#' xmlns:hr='http://www.wsmo.org/ns/hrests#' typeOf='wsl:Service' about='#{with_service_uri_prefix_xml('Service')}'><h1><span property='rdfs:label'>#{self.name} Service</span></h1>"
          [:create_operation, :show_operation, :destroy_operation, :update_operation].each do |op|
            desc = self.send(op)
            unless desc.nil?
              operation_name = if(op == :create_operation)
                                 "#create#{self.name}"
                               elsif(op == :show_operation)
                                 "#show#{self.name}"
                               elsif(op == :update_operation)
                                 "#update#{self.name}"
                               elsif(op == :destroy_operation)
                                 "#destroy#{self.name}"
                               elsif(op == :index_operation)
                                 "#index#{self.name}"
                               end
              html << "<div rel='wsl:hasOperation'><span typeOf='wsl:Operation' about='##{operation_name}'>"
              html << "<h2> Operation <code property='rdfs:label'>#{operation_name}</code></h2>"
              html << desc.call(:html)
              html << "</div>"
            end
          end
          html << "</div>"
          html.string
        end
      elsif(format == :xml)
        xml = StringIO.new
        xml << "<?xml version='1.0'?>"
        xml << "<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#' xmlns:sawsdl='http://www.w3.org/ns/sawsdl#' xmlns:wsl='http://www.wsmo.org/ns/wsmo-lite#' xmlns:hr='http://www.wsmo.org/ns/hrests#'>"
        xml << "<rdf:Description rdf:about='#{with_service_uri_prefix_xml('Service')}'>"
        xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Service'/>"
        xml << "<rdfs:isDefinedBy rdf:resource='#{with_service_uri_prefix_xml('Service')}'/>"
        xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"

        xml << "</rdf:Description>"

        ops_xml = StringIO.new

        [:create_operation, :show_operation, :destroy_operation, :update_operation].each do |op|
          desc = self.send(op)
          unless desc.nil?
            operation_name = if(op == :create_operation)
                               "#create#{self.name}"
                             elsif(op == :show_operation)
                               "#show#{self.name}"
                             elsif(op == :update_operation)
                               "#update#{self.name}"
                             elsif(op == :destroy_operation)
                               "#destroy#{self.name}"
                             elsif(op == :index_operation)
                               "#index#{self.name}"
                             end

            ops_xml << "<rdf:Description rdf:about='#{operation_name}'>"
            ops_xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Operation'/>"
            ops_xml << "<rdfs:label>#{operation_name}</rdfs:label>"
            ops_xml << desc.call(:xml)
            ops_xml << "</rdf:Description>"
          end
        end
        xml << ops_xml.string
        xml << "</rdf:RDF>"
        xml.string.gsub("&","&amp;")
      end
    end

    def define_create_operation(options,params=nil)
      res_name, encoded = parse_operation_definition(:create,options)

      @create_operation = Proc.new do |format|
        if(format == :n3)
          rdf = StringIO.new
          rdf<< "#{with_service_uri_prefix('#create',self.name)} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;\n"
          rdf<< "  rdfs:label \"creates a new #{self.name} resource\" ;\n"
          rdf<< "  hr:hasMethod  \"POST\" ;\n"
          rdf<< "  hr:hasAddress \"#{encoded}\"^^<hr:URITemplate> ;\n"
=begin
          params.each do |p|
            rdf<< "  wsl:hasInputMessage [\n"
            rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
            rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> ; \n"
            rdf<< "    sawsdl:loweringSchemaMapping <http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql>\n"
            rdf<< "  ] ;\n"
          end
=end
          rdf<< "  wsl:hasInputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> ; \n"
          rdf<< "    sawsdl:loweringSchemaMapping <http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql>\n"
          rdf<< "  ] ;\n"
          rdf<< "  hr:hasInputParameter [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ; \n"
          rdf<< "    hr:parameterName \"callback\"\n"
          rdf<< "  ] ;\n"
          rdf<< "  wsl:hasOutputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ; \n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}>\n"
          rdf<< "  ] .\n"

          rdf.string
        elsif(format == :html)
          if(SemanticResource::Configuration.default_html_serialization == :microformat)
            html = StringIO.new
            html << "<p> Invoked using <span class='method'>POST</span> at <code class='address'>#{encoded}</code></p>"
            html << "<strong>Input Messages</strong>"
            html << "<ul>"
            params.each do |p|
              if(@mapping[p]['relation'].nil?)
                html << "<li class='input'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'><code>#{p}</code></a>"
                html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql'>lowering</a>)</li>"
              else
                html << "<li class='input'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{@mapping[p][:relation].name}' rel='model'><code>#{p}</code></a>"
                html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql'>lowering</a>)</li>"
              end
            end
            html << "</ul>"

            html << "<strong>Output Response</strong>"
            html << "<ul>"
            html << "<li class='output'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'>the new #{self.name}</a></li>"
            html << "</ul>"

            html.string
          elsif(SemanticResource::Configuration.default_html_serialization == :rdfa)
            html = StringIO.new
            html << "<p> Invoked using <span property='wsl:hasMethod'>POST</span> at <code datatype='hr:URITemplate' property='hr:hasAddress'>#{encoded}</code></p>"
            html << "<strong>Input Messages</strong>"
            html << "<ul>"
            params.each do |p|
              html << "<span rel='wsl:hasInputMessage'>"
              if(@mapping[p]['relation'].nil?)
                html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='sawsdl:modelReference'><code>#{p}</code></a>"
                html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql' rel='sawsdl:loweringSchemaMapping'>lowering</a>)</li>"
              else
                html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{@mapping[p][:relation].name}' rel='sawsdl:modelReference'><code>#{p}</code></a>"
                html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql' rel='sawsdl:loweringSchemaMapping'>lowering</a>)</li>"
              end
              html << "</span>"
            end
            html << "</ul>"

            html << "<strong>Output Response</strong>"
            html << "<ul>"
            html << "<span rel='wsl:hasOutputMessage'>"
            html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='sawsdl:modelReference'>the new #{self.name}</a></li>"
            html << "</span>"
            html << "</ul>"

            html.string
          else
            raise Exception.new("Unknown serialization format for html #{SemanticResource::Configuration.default_html_serialization}")
          end
        elsif(format == :xml)
          xml = StringIO.new

          xml << "<hr:hasAddress>#{encoded}</hr:hasAddress>"
          xml << "<hr:hasInputParameter rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://semantic_rest.org/ns/hrests_js#JSONPCallback'/>"
          xml << "<hr:parameterName>callback</hr:parameterName>"
          xml << "</hr:hasInputParameter>"
          xml << "<hr:hasMethod>GET</hr:hasMethod>"
          xml << "<wsl:hasInputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:loweringSchemaMapping rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/show.sparql'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasInputMessage>"
          xml << "<wsl:hasOutputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasOutputMessage>"

          xml.string
        end
      end
    end

    def define_index_operation(options)
      res_name, encoded = parse_operation_definition(:index,options)
      @index_operation = Proc.new do |format|
        if(format == :n3)

          rdf = StringIO.new
          rdf<< "#{with_service_uri_prefix('#index',self.name)} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;\n"
          rdf<< "  rdfs:label \"retrieves #{self.name} resources.\" ;\n"
          rdf<< "  hr:hasMethod  \"GET\" ;\n"
          rdf<< "  hr:hasAddress \"#{encoded}\"^^<hr:URITemplate> ;\n"
          rdf<< "  wsl:hasInputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> ;\n"
          rdf<< "    sawsdl:loweringSchemaMapping <http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/index.sparql>\n"
          rdf<< "  ] ;\n"
          rdf<< "  hr:hasInputParameter [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;\n"
          rdf<< "    hr:parameterName \"callback\"\n"
          rdf<< "  ] ;\n"
          rdf<< "  wsl:hasOutputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}>"
          rdf<< "  ] .\n"
          rdf.string

        elsif(format == :html)

          html = StringIO.new
          html << "<p> Invoked using <span class='method'>GET</span> at <code class='address'>#{encoded}</code></p>"
          html << "<strong>Input Messages</strong>"
          html << "<ul>"
          html << "<li class='input'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'><code>id</code></a>"
          html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/index.sparql'>lowering</a>)</li>"
          html << "</ul>"
          html << "<strong>Output Response</strong>"
          html << "<ul>"
          html << "<li class='output'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'>the #{self.name}</a></li>"
          html << "</ul>"
          html.string

        elsif(format == :xml)

          xml = StringIO.new
          xml << "<hr:hasAddress>#{encoded}</hr:hasAddress>"
          xml << "<hr:hasInputParameter rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://semantic_rest.org/ns/hrests_js#JSONPCallback'/>"
          xml << "<hr:parameterName>callback</hr:parameterName>"
          xml << "</hr:hasInputParameter>"
          xml << "<hr:hasMethod>GET</hr:hasMethod>"
          xml << "<wsl:hasInputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:loweringSchemaMapping rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/index.sparql'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasInputMessage>"
          xml << "<wsl:hasOutputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasOutputMessage>"
          xml.string

        end

      end
    end

    def define_show_operation(options)
      res_name, encoded = parse_operation_definition(:show,options)
      @show_operation = Proc.new do |format|

        if(format == :n3)

          rdf = StringIO.new
          rdf<< "#{with_service_uri_prefix('#show',self.name)} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;\n"
          rdf<< "  rdfs:label \"retrieves #{self.name} resource with id {id}\" ;\n"
          rdf<< "  hr:hasMethod  \"GET\" ;\n"
          rdf<< "  hr:hasAddress \"#{encoded}\"^^<hr:URITemplate> ;\n"
          rdf<< "  wsl:hasInputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> ;\n"
          rdf<< "    sawsdl:loweringSchemaMapping <http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/show.sparql>\n"
          rdf<< "  ] ;\n"
          rdf<< "  hr:hasInputParameter [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;\n"
          rdf<< "    hr:parameterName \"callback\"\n"
          rdf<< "  ] ;\n"
          rdf<< "  wsl:hasOutputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}>"
          rdf<< "  ] .\n"
          rdf.string

        elsif(format == :html)

          html = StringIO.new
          html << "<p> Invoked using <span class='method'>GET</span> at <code class='address'>#{encoded}</code></p>"
          html << "<strong>Input Messages</strong>"
          html << "<ul>"
          html << "<li class='input'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'><code>id</code></a>"
          html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/show.sparql'>lowering</a>)</li>"
          html << "</ul>"
          html << "<strong>Output Response</strong>"
          html << "<ul>"
          html << "<li class='output'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'>the #{self.name}</a></li>"
          html << "</ul>"
          html.string

        elsif(format == :xml)

          xml = StringIO.new
          xml << "<hr:hasAddress>#{encoded}</hr:hasAddress>"
          xml << "<hr:hasInputParameter rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://semantic_rest.org/ns/hrests_js#JSONPCallback'/>"
          xml << "<hr:parameterName>callback</hr:parameterName>"
          xml << "</hr:hasInputParameter>"
          xml << "<hr:hasMethod>GET</hr:hasMethod>"
          xml << "<wsl:hasInputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:loweringSchemaMapping rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/show.sparql'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasInputMessage>"
          xml << "<wsl:hasOutputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasOutputMessage>"
          xml.string

        end

      end
    end

    def define_destroy_operation(options)
      res_name, encoded = parse_operation_definition(:destroy,options)
      @destroy_operation = Proc.new do |format|
        if(format == :n3)

          rdf = StringIO.new
          rdf<< "#{with_service_uri_prefix('#destroy',self.name)} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;\n"
          rdf<< "  rdfs:label \"destroys the #{self.name} resource with id {id}\" ;\n"
          rdf<< "  hr:hasMethod  \"DELETE\" ;\n"
          rdf<< "  hr:hasAddress \"#{encoded}\"^^<hr:URITemplate> ;\n"
          rdf<< "  wsl:hasInputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> ;\n"
          rdf<< "    sawsdl:loweringSchemaMapping <http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/destroy.sparql>\n"
          rdf<< "  ] ;\n"
          rdf<< "  hr:hasInputParameter [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ;\n"
          rdf<< "    hr:parameterName \"callback\"\n"
          rdf<< "  ] ;\n"
          rdf<< "  wsl:hasOutputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}>"
          rdf<< "  ] .\n"
          rdf.string

        elsif(format == :html)

          html = StringIO.new
          html << "<p> Invoked using <span class='method'>DELETE</span> at <code class='address'>#{encoded}</code></p>"
          html << "<strong>Input Messages</strong>"
          html << "<ul>"
          html << "<li class='input'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'><code>id</code></a>"
          html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/destroy.sparql'>lowering</a>)</li>"
          html << "</ul>"
          html << "<strong>Output Response</strong>"
          html << "<ul>"
          html << "<li class='output'> <a
          href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'>the destroyed #{self.name}</a></li>"
          html << "</ul>"
          html.string

        elsif(format == :xml)

          xml = StringIO.new
          xml << "<hr:hasAddress>#{encoded}</hr:hasAddress>"
          xml << "<hr:hasInputParameter rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://semantic_rest.org/ns/hrests_js#JSONPCallback'/>"
          xml << "<hr:parameterName>callback</hr:parameterName>"
          xml << "</hr:hasInputParameter>"
          xml << "<hr:hasMethod>DELETE</hr:hasMethod>"
          xml << "<wsl:hasInputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:loweringSchemaMapping rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/destroy.sparql'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasInputMessage>"
          xml << "<wsl:hasOutputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasOutputMessage>"
          xml.string

        end

      end
    end

    def define_update_operation(options,params=nil)
      res_name, encoded = parse_operation_definition(:update,options)

      @update_operation = Proc.new do |format|
        if(format == :n3)
          rdf = StringIO.new
          rdf<< "#{with_service_uri_prefix('#update',self.name)} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Operation ;\n"
          rdf<< "  rdfs:label \"updates a  #{self.name} resource\" ;\n"
          rdf<< "  hr:hasMethod  \"PUT\" ;\n"
          rdf<< "  hr:hasAddress \"#{encoded}\"^^<hr:URITemplate> ;\n"
          rdf<< "  wsl:hasInputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ;\n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}> ; \n"
          rdf<< "    sawsdl:loweringSchemaMapping <http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/update.sparql>\n"
          rdf<< "  ] ;\n"
          rdf<< "  hr:hasInputParameter [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> hrjs:JSONPCallback ; \n"
          rdf<< "    hr:parameterName \"callback\"\n"
          rdf<< "  ] ;\n"
          rdf<< "  wsl:hasOutputMessage [\n"
          rdf<< "    <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> wsl:Message ; \n"
          rdf<< "    sawsdl:modelReference <http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}>\n"
          rdf<< "  ] .\n"

          rdf.string
        elsif(format == :html)
          if(SemanticResource::Configuration.default_html_serialization == :microformat)
            html = StringIO.new
            html << "<p> Invoked using <span class='method'>PUT</span> at <code class='address'>#{encoded}</code></p>"
            html << "<strong>Input Messages</strong>"
            html << "<ul>"
            params.each do |p|
              html << "<span rel='wsl:hasInputMessage'>"
              if(@mapping[p]['relation'].nil?)
                html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='sawsdl:modelReference'><code>#{p}</code></a>"
                html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql' rel='sawsdl:loweringSchemaMapping'>lowering</a>)</li>"
              else
                html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{@mapping[p][:relation].name}' rel='sawsdl:modelReference'><code>#{p}</code></a>"
                html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql' rel='sawsdl:loweringSchemaMapping'>lowering</a>)</li>"
              end
              html << "</span>"
            end
            html << "</ul>"

            html << "<strong>Output Response</strong>"
            html << "<ul>"
            html << "<li class='output'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'>the updated #{self.name}</a></li>"
            html << "</ul>"

            html.string
          elsif(SemanticResource::Configuration.default_html_serialization == :rdfa)
            html = StringIO.new
            html << "<p> Invoked using <span property='wsl:hasMethod'>PUT</span> at <code datatype='hr:URITemplate' property='hr:hasAddress'>#{encoded}</code></p>"
            html << "<strong>Input Messages</strong>"
            html << "<ul>"
            params.each do |p|
              html << "<span rel='wsl:hasInputMessage'>"
              html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='sawsdl:modelReference'><code>#{p}</code></a>"
              html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/update.sparql' rel='sawsdl:loweringSchemaMapping'>lowering</a>)</li>"
              html << "</span>"
            end
            html << "</ul>"

            html << "<strong>Output Response</strong>"
            html << "<ul>"
            html << "<span rel='wsl:hasOutputMessage'>"
            html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='sawsdl:modelReference'>the updated #{self.name}</a></li>"
            html << "</span>"
            html << "</ul>"

            html.string
          else
            raise Exception.new("Unknown serialization format for html #{SemanticResource::Configuration.default_html_serialization}")
          end
        elsif(format == :xml)
          xml = StringIO.new

          xml << "<hr:hasAddress>#{encoded}</hr:hasAddress>"
          xml << "<hr:hasInputParameter rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://semantic_rest.org/ns/hrests_js#JSONPCallback'/>"
          xml << "<hr:parameterName>callback</hr:parameterName>"
          xml << "</hr:hasInputParameter>"
          xml << "<hr:hasMethod>PUT</hr:hasMethod>"
          xml << "<wsl:hasInputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:loweringSchemaMapping rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/update.sparql'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasInputMessage>"
          xml << "<wsl:hasOutputMessage rdf:parseType='Resource'>"
          xml << "<rdf:type rdf:resource='http://www.wsmo.org/ns/wsmo-lite#Message'/>"
          xml << "<sawsdl:modelReference rdf:resource='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}'/>"
          xml << "</wsl:hasOutputMessage>"

          xml.string
        end
      end
    end


    def show_operation
      begin
      @show_operation
      rescue NameError
        throw Exception.new("the show operation has not been defined, use #define_show_operation in the model")
      end
    end

    def create_operation
      begin
        @create_operation
      rescue NameError
        throw Exception.new("the create operation has not been defined, use #define_create_operation in the model")
      end
    end

    def index_operation
      begin
        @index_operation
      rescue NameError
        throw Exception.new("the index operation has not been defined, use #define_create_operation in the model")
      end
    end

    def update_operation
      begin
        @update_operation
      rescue NameError
        throw Exception.new("the update operation has not been defined, use #define_create_operation in the model")
      end
    end

    def destroy_operation
      begin
        @destroy_operation
      rescue NameError
        throw Exception.new("the destroy operation has not been defined, use #define_show_operation in the model")
      end
    end

    # private methods

    #TODO:
    # subustitute all of tis by method in  ActionController::Routing::Routes
    # as:  ActionController::Routing::Routes.generate(params)
    # or:  ActionController::Routing::Routes.generate_with_extras(params)
    def url_for(options)
      url = ''

      unless options.delete(:only_path)
        url << (options.delete(:protocol) || 'http')
        url << '://' unless url.match("://")

        raise "Missing host to link to! Please provide :host parameter or set default_url_options[:host]" unless options[:host]

        url << options.delete(:host)
        url << ":#{options.delete(:port)}" if options.key?(:port)
      else
        # Delete the unused options to prevent their appearance in the query string.
        [:protocol, :host, :port, :skip_relative_url_root].each { |k| options.delete(k) }
      end
      trailing_slash = options.delete(:trailing_slash) if options.key?(:trailing_slash)
      url << ActionController::Base.relative_url_root.to_s unless options[:skip_relative_url_root]
      anchor = "##{CGI.escape options.delete(:anchor).to_param.to_s}" if options[:anchor]
      generated = ActionController::Routing::Routes.generate(options, {})
      url << (trailing_slash ? generated.sub(/\?|\z/) { "/" + $& } : generated)
      url << anchor if anchor

      url
    end

    def build_mapping_rdf_description(key,value, format = :n3)
      if(format == :n3 || format == :rdf)

        rdf = StringIO.new
        if self.columns.detect{|column| column.name.to_sym == key.to_sym}
          rdf << "<#{build_uri_for_property(key)}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property .\n"
          rdf << "<#{build_uri_for_property(key)}> rdfs:domain <#{resource_model_uri}> .\n"
          if(value[:datatype].index('http://').nil?)
            rdf << "<#{build_uri_for_property(key)}> rdfs:range #{value[:datatype]} .\n"
          else
            rdf << "<#{build_uri_for_property(key)}> rdfs:range <#{value[:datatype]}> .\n"
          end
        elsif !value[:relation].nil?
          rdf << "<#{build_uri_for_property(key)}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property .\n"
          rdf << "<#{build_uri_for_property(key)}> rdfs:domain <#{resource_model_uri}> .\n"
          debugger
          rdf << "<#{build_uri_for_property(key)}> rdfs:range <#{value[:relation].resource_model_uri}> .\n"
        elsif association = self.reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
          rdf << "<#{build_uri_for_property(key)}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> rdfs:Property .\n"
          rdf << "<#{build_uri_for_property(key)}> rdfs:domain <#{resource_model_uri}> .\n"
          rdf << "<#{build_uri_for_property(key)}> rdfs:range <#{association.active_record.resource_model_uri}> .\n"
        end
        rdf.string

      elsif(format == :xml)
        resource_model_uri_xml = "http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}"
        xml = StringIO.new
        if self.columns.detect{|column| column.name.to_sym == key.to_sym}
          xml << "<rdf:Description rdf:about='#{build_uri_for_property(key)}'>"
          xml << "<rdf:type rdf:resource='http://www.w3.org/2000/01/rdf-schema#Property'/>"
          xml << "<rdfs:domain rdf:resource='#{resource_model_uri_xml}'/>"
          xml << "<rdfs:range rdf:resource='#{value[:datatype]}'/>"
          xml << "</rdf:Description>"
        elsif !value[:relation].nil?
          xml << "<rdf:Description rdf:about='#{build_uri_for_property(key)}'>"
          xml << "<rdf:type rdf:resource='http://www.w3.org/2000/01/rdf-schema#Property'/>"
          xml << "<rdfs:domain rdf:resource='#{resource_model_uri_xml}'/>"
          xml << "<rdfs:range rdf:resource='#{value[:relation].resource_model_uri}'/>"
          xml << "</rdf:Description>"
        elsif association = self.reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
          xml << "<rdf:Description rdf:about='#{build_uri_for_property(key)}'>"
          xml << "<rdf:type rdf:resource='http://www.w3.org/2000/01/rdf-schema#Property'/>"
          xml << "<rdfs:domain rdf:resource='#{resource_model_uri_xml}'/>"
          xml << "<rdfs:range rdf:resource='#{association.active_record.resource_model_uri}'/>"
          xml << "</rdf:Description>"
        end
        xml.string

      end
    end

    def parse_operation_definition(kind_of_operation,options)
      original_options = { }
      options.each_pair do |k,v|
        original_options[k] = v
      end

      url_parameters = options[:url_parameters] ||  []
      mapped_params = { }
      if(kind_of_operation == :show || kind_of_operation == :destroy || kind_of_operation == :update)
        if(options[:show_id].nil?)
          options[:show_id] = true
        end
      else
        if(options[:show_id].nil?)
          options[:show_id] = false
        end
        # properties encoded for create and update
        # TODO: check if property is already mapped into URL parameters
        params = @mapping.keys
        params = params.reject{ |k| @mapping[k] && @mapping[k][:relation] != nil }
        mapped_params = params.inject(Hash.new){|h,p| h["#{p}".to_sym] = "___#{p}___"; h}
        options = options.merge(mapped_params)
      end
      show_id = options[:show_id]

      # we clean from the options the keys no related to the generation of the URL
      options = options.reject{ |k,v| k == :url_parameters || k == :show_id }

      # we store the show operation parameters
      semantic_operations[kind_of_operation] = original_options

      res_name = self.class.name.downcase

      # building the path to the resource
      resource_path.each do |identifier|
        options = options.merge(identifier => "___#{identifier}___")
      end
      # including URL parameters
      url_parameters.each do |identifier|
        options = options.merge(identifier => "___#{identifier}___")
      end

      if(show_id)
        options= options.merge({:id => "___id___"})
      end

      encoded = url_for(options.merge(:host => SemanticResource::Configuration.resources_host))

      # building the path to the resource
      resource_path.each do |identifier|
        encoded = encoded.gsub(CGI.escape("___#{identifier}___"),"{#{identifier}}")
      end
      url_parameters.each do |identifier|
        encoded = encoded.gsub(CGI.escape("___#{identifier}___"),"{#{identifier}}")
      end
      if(show_id)
        encoded = encoded.gsub(CGI.escape("___id___"),"{id}")
      end
      unless(kind_of_operation == :show || kind_of_operation == :destroy || kind_of_operation == :update)
        mapped_params.each_pair do |k,identifier|
          encoded = encoded.gsub(CGI.escape(identifier),"{#{k}}")
        end
      end

      return res_name,encoded
    end

    # SPARQL generators
    def sparql_lowering_show semantic_model

      sparql = StringIO.new
      sparql_where_clause = StringIO.new

      sparql << "SELECT "

      if(!resource_mapping.keys.include?(:id) &&
         ((!semantic_operations[:show][:show_id].nil? && semantic_operations[:show][:show_id] = true) ||
          (semantic_operations[:show][:show_id].nil?)))
        sparql << "?id "
        sparql_where_clause << "?x <#{SemanticResource::Configuration::SIESTA_ID}> ?id . "
      end
      #nested resources
      resource_mapping.each_pair do |key,value|
        if(!value[:relation].nil? && resource_path.include?(value[:relation_key].to_sym))
          sparql << "?#{value[:relation_key]} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{value[:relation_key]}_url . "
          sparql_where_clause << "?#{value[:relation_key]}_url <#{SemanticResource::Configuration::SIESTA_ID}> ?#{value[:relation_key]} . "
        end
      end

      #extra URL parameters
      unless(semantic_operations[:show][:url_parameters].nil?)
        semantic_operations[:show][:url_parameters].each do |param|
          value = resource_mapping[param]
          raise Exception.new("URL parameter #{param} has no mapped property") if value.nil?

          sparql << "?#{param} "
          sparql_where_clause << "?x <#{build_uri_for_property(param)}> ?#{param} . "
        end
      end

      return "#{sparql.string} WHERE { #{sparql_where_clause.string} }"
    end


    def sparql_lowering_index semantic_model

      sparql = StringIO.new
      sparql_where_clause = StringIO.new

      sparql << "SELECT "

      # TODO
      # this should never appera here is to fix problems for not nested resources
      if(resource_path.empty?)
        unless(resource_mapping.keys.include?(:id))
          sparql << "?id "
          sparql_where_clause << "?x <#{SemanticResource::Configuration::SIESTA_ID}> ?id . "
        end
      end

      resource_mapping.each_pair do |key,value|
        if(!value[:relation].nil? && resource_path.include?(value[:relation_key].to_sym))
          sparql << "?#{value[:relation_key]} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{value[:relation_key]}_url . "
          sparql_where_clause << "?#{value[:relation_key]}_url <#{SemanticResource::Configuration::SIESTA_ID}> ?#{value[:relation_key]} . "
        end
      end

      return "#{sparql.string} WHERE { #{sparql_where_clause.string} }"
    end


    def sparql_lowering_create semantic_model
      sparql = StringIO.new
      sparql_where_clause = StringIO.new

      sparql << "SELECT "

      resource_mapping.each_pair do |key,value|
        #TODO: revert to the OPTIONAL CLAUSE
        #sparql_where_clause << "OPTIONAL { " if value[:optional] && value[:optional] == true
        if(!value[:relation].nil? && resource_path.include?(value[:relation_key].to_sym))
          sparql << "?#{value[:relation_key]} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{value[:relation_key]}_url . "
          sparql_where_clause << "?#{value[:relation_key]}_url <#{SemanticResource::Configuration::SIESTA_ID}> ?#{value[:relation_key]} . "
         elsif(value[:relation].nil?)
          sparql << "?#{key.to_s} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{key.to_s} . "
        end
        #sparql_where_clause << " } " if value[:optional] && value[:optional] == true
      end

      return "#{sparql.string} WHERE { #{sparql_where_clause.string} }"
    end


    def sparql_lowering_destroy semantic_model
      #"SELECT ?id WHERE { ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <#{semantic_model.resource_model_uri}>. ?x <http://semantic_rest/siesta#id> ?id. }"
      sparql = StringIO.new
      sparql_where_clause = StringIO.new

      sparql << "SELECT "

      unless(resource_mapping.keys.include?(:id))
        sparql << "?id "
        sparql_where_clause << "?x <#{SemanticResource::Configuration::SIESTA_ID}> ?id . "
      end

      resource_mapping.each_pair do |key,value|
        #TODO: revert to the OPTIONAL CLAUSE
        #sparql_where_clause << "OPTIONAL { " if value[:optional] && value[:optional] == true
        if(!value[:relation].nil? && resource_path.include?(value[:relation_key].to_sym))
          sparql << "?#{value[:relation_key]} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{value[:relation_key]}_url . "
          sparql_where_clause << "?#{value[:relation_key]}_url <#{SemanticResource::Configuration::SIESTA_ID}> ?#{value[:relation_key]} . "
        end
        #sparql_where_clause << " } " if value[:optional] && value[:optional] == true
      end

      return "#{sparql.string} WHERE { #{sparql_where_clause.string} }"
    end


    def sparql_lowering_update semantic_model
      sparql = StringIO.new
      sparql_where_clause = StringIO.new

      sparql << "SELECT "

      unless(resource_mapping.keys.include?(:id))
        sparql << "?id "
        sparql_where_clause << "?x <#{SemanticResource::Configuration::SIESTA_ID}> ?id . "
      end

      resource_mapping.each_pair do |key,value|
        #TODO: revert to the OPTIONAL CLAUSE
        #sparql_where_clause << "OPTIONAL { " if value[:optional] && value[:optional] == true
        if(!value[:relation].nil? && resource_path.include?(value[:relation_key].to_sym))
          sparql << "?#{value[:relation_key]} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{value[:relation_key]}_url . "
          sparql_where_clause << "?#{value[:relation_key]}_url <#{SemanticResource::Configuration::SIESTA_ID}> ?#{value[:relation_key]} . "
         elsif(value[:relation].nil?)
          sparql << "?#{key.to_s} "
          sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{key.to_s} . "
        end
        #sparql_where_clause << " } " if value[:optional] && value[:optional] == true
      end

      return "#{sparql.string} WHERE { #{sparql_where_clause.string} }"
    end
  end

end

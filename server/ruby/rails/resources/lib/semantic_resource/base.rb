module SemanticResource


  def self.included(base)
    base.extend(ClassMethods)
    base.send(:include,SemanticResource::ViewHelpers)
    base.send(:extend,SemanticResource::ViewHelpers)

    # The resource is registered
    base.register_semantic_resource
  end

  # Methods to be included
  def to_rdf(params,format = :n3)
    res_name = if params.instance_of?(String)
      # we have received a URL for the resource, for instance,
      # with the result of the calling to a resource_path or resource_url function
      "http://#{SemanticResource::Configuration.resources_host}#{params}"
    else
      format = params[:format] || format
      self.class.url_for(params.merge(:host => SemanticResource::Configuration.resources_host))
    end
    res_name = res_name.split("?").first;
    res_name = res_name.split(".")[0]

    format = format.to_sym
    if(format == :n3 || format == :rdf)

      rdf = StringIO.new

      rdf << "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
      rdf << "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
      rdf << "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"

      rdf << "<#{res_name}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <#{self.class.resource_model_uri}> .\n"
      rdf << "<#{res_name}> <#{SemanticResource::Configuration::SIESTA_ID}> \"#{self.id}\" .\n"

      self.class.resource_mapping.each_pair do |key,value|
        rdf << "<#{res_name}> #{instance_build_mapping_rdf_description(res_name,key,value,format)}" unless self.send(key).nil?
      end

      rdf.string

    elsif(format == :xml)

      xml = StringIO.new
      xml << "<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'"
      self.class.namespaces_for_resource.each_pair do |ns,uri|
        uri = "#{uri}#" unless uri[-1..-1] == "#" ||  uri[-1..-1] == "/"
        xml << " xmlns:#{ns}='#{uri}'"
      end
      xml << " xmlns:siesta='#{SemanticResource::Configuration::SIESTA_NAMESPACE}'>"
      xml << "<rdf:Description rdf:about='#{res_name}'>"
      xml << "<rdf:type rdf:resource='<#{self.class.resource_model_uri}>'/>"
      xml << "<siesta:id>#{self.id}</siesta:id>"
      self.class.resource_mapping.each_pair do |key,value|
        xml << instance_build_mapping_rdf_description(res_name,key,value,format) unless self.send(key).nil?
      end
      xml << "</rdf:Description>"
      xml << "</rdf:RDF>"
      xml.string

    end
  end

  def instance_build_mapping_rdf_description(res_name,key,value,format = :n3)
    res_value = self.send(key)

    return "" if res_value.nil?
    if(format == :n3 || format == :rdf)
      rdf = StringIO.new
      if self.class.columns.detect{|column| column.name.to_sym == key.to_sym}
        rdf << "<#{self.class.build_uri_for_property(key)}> \"#{res_value}\".\n"
      elsif association = self.class.reflect_on_all_associations.detect{|association| association.name.to_sym == key.to_sym}
        #TODO: rdf << "#{self.class.with_service_uri_prefix(res_name)} <#{SemanticResource::Configuration.namespaces_map[value.first]}#{value.last}>  .\n"
      end
      rdf.string
    elsif(format == :xml)
      xml = StringIO.new
      if self.class.columns.detect{|column| column.name.to_sym == key.to_sym}
        prop = self.class.build_uri_for_property(key,format)
        xml << "<#{prop}>#{res_value}</#{prop}>"
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
      lowering_operations["show"] = "sparql_lowering_show"
      lowering_operations["create"] = "sparql_lowering_create"
      SemanticResource::Manager.register_lowering_operation(self.name, lowering_operations)
    end

    # A hash where the defined operations parameters for this resource will be stored
    def semantic_operations
      @semantic_operations = Hash.new unless defined? @semantic_operations
      @semantic_operations
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
        html << "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
        html << "<html xmlns='http://www.w3.org/1999/xhtml' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#'>"
        html << "<head><title>#{model_ref}</title></head>"
        html << "<body>"
        html << rdfa_description(model_ref,:typeof => "rdfs:Class", :tag => 'h1') do
          "model <code>#{model_ref}</code>"
        end
        html << "<h2>Properties</h2>"
        html << rdfa_description("http://semantic_rest/siesta#id", :tag => :span, :typeof => 'rdfs:Property') do
          property_html = StringIO.new
          property_html << "<b>id</b>"
          property_html << "<ul>"
          property_html << "<li>domain: <code>"
          property_html << rdfa_relation("rdfs:domain",:a, model_ref) do
            "#{model_ref}"
          end
          property_html << rdfa_relation("rdfs:range",:li,"http://www.w3.org/2000/01/rdf-schema#Datatype") do
            "range: <code>http://www.w3.org/2000/01/rdf-schema#Datatype</code>"
          end
          property_html << "</ul>"
          property_html.string
        end
        @mapping.keys.each do |key|
          html << rdfa_description(build_uri_for_property(key), :tag => :span, :typeof => 'rdfs:Property') do
            property_html = StringIO.new
            property_html << "<b>#{key}</b>"
            property_html << "<ul>"
            property_html << "<li>domain: <code>"
            property_html << rdfa_relation("rdfs:domain",:a, model_ref) do
              "#{model_ref}"
            end
            property_html << "</code></li>"
            property_html << rdfa_relation("rdfs:range",:li, "http://www.w3.org/2000/01/rdf-schema#Datatype") do
              "range: <code>http://www.w3.org/2000/01/rdf-schema#Datatype</code>"
            end
            property_html << "</ul>"
            property_html.string
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

    def set_resource_mapping
      @mapping = Hash.new
      yield @mapping
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
        [:create_operation, :show_operation].each do |op|
          desc = self.send(op)
          unless desc.nil?
            operation_name = if(op == :create_operation)
                               with_service_uri_prefix "#create#{self.name}"
                             elsif(op == :show_operation)
                               with_service_uri_prefix "#show#{self.name}"
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
          [:create_operation, :show_operation].each do |op|
            desc = self.send(op)
            unless desc.nil?
              operation_name = if(op == :create_operation)
                                 "#create#{self.name}"
                               elsif(op == :show_operation)
                                 "#show#{self.name}"
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
          [:create_operation, :show_operation].each do |op|
            desc = self.send(op)
            unless desc.nil?
              operation_name = if(op == :create_operation)
                                 "#create#{self.name}"
                               elsif(op == :show_operation)
                                 "#show#{self.name}"
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

        [:create_operation, :show_operation].each do |op|
          desc = self.send(op)
          unless desc.nil?
            operation_name = if(op == :create_operation)
                               "#create#{self.name}"
                             elsif(op == :show_operation)
                               "#show#{self.name}"
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

    def create_operation
      begin
        @create_operation
      rescue NameError
        throw Exception.new("the create operation has not been defined, use #define_create_operation in the model")
      end
    end

    def define_create_operation(options,params=nil)

      # we store the definition parameters
      semantic_operations[:create] = options

      # we register the create lowering mechanism
      #SemanticResource::Manager.lowering_operations[self.name]["create"] = "sparql_lowering_create"

      params = @mapping.keys if params.nil?
      res_name = self.class.name.downcase
      mapped_params = params.inject(Hash.new){|h,p| h["#{p}".to_sym] = "_#{p}_"; h}
      encoded = url_for(options.merge(mapped_params).merge(:host => SemanticResource::Configuration.resources_host))

      params.each do |p|
        encoded = encoded.gsub(CGI.escape("_#{p}_"),"{#{p}}")
      end

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
              html << "<li class='input'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='model'><code>#{p}</code></a>"
              html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql'>lowering</a>)</li>"
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
              html << "<li typeOf='wsl:Message'> <a href='http://#{SemanticResource::Configuration.resources_host}/schemas/models/#{self.name}' rel='sawsdl:modelReference'><code>#{p}</code></a>"
              html << "(<a href='http://#{SemanticResource::Configuration.resources_host}/schemas/lowering/#{self.name}/create.sparql' rel='sawsdl:loweringSchemaMapping'>lowering</a>)</li>"
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

    def define_show_operation(options)

      # we store the show operation parameters
      semantic_operations[:show] = options

      # we register the show lowering mechanism
      #SemanticResource::Manager.lowering_operations[self.name]["show"] = "sparql_lowering_show"

      res_name = self.class.name.downcase
      @show_operation = Proc.new do |format|

        encoded = url_for(options.merge({:id => "_id_"}).merge(:host => SemanticResource::Configuration.resources_host))
        encoded = encoded.gsub(CGI.escape("_id_"),"{id}")

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

    def show_operation
      begin
      @show_operation
      rescue NameError
        throw Exception.new("the show operation has not been defined, use #define_show_operation in the model")
      end
    end

    def define_index_operation
      @index_operation = nil
    end

    def index_operation
      @index_operation
    end

    def define_update_operation
      @update_operation = nil
    end

    def update_operation
      @update_operation
    end

    def define_destroy_operation
      @destroy_operation = nil
    end

    def destroy_operation
      @destroy_operation
    end

    # private methods

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
          rdf << "<#{build_uri_for_property(key)}> rdfs:range rdfs:Datatype .\n"
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
          xml << "<rdfs:range rdf:resource='http://www.w3.org/2000/01/rdf-schema#Datatype'/>"
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

    # SPARQL generators
    def sparql_lowering_show semantic_model
      "SELECT ?id WHERE { ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <#{semantic_model.resource_model_uri}>. ?x <http://semantic_rest/siesta#id> ?id. }"
    end

    def sparql_lowering_create semantic_model
      sparql = StringIO.new
      sparql_where_clause = StringIO.new

      sparql << "SELECT "
      resource_mapping.each_pair do |key,value|
        sparql << "?#{key.to_s} "
        #TODO: revert to the OPTIONAL CLAUSE
        #sparql_where_clause << "OPTIONAL { " if value[:optional] && value[:optional] == true
        sparql_where_clause << "?x <#{build_uri_for_property(key)}> ?#{key.to_s} . "
        #sparql_where_clause << " } " if value[:optional] && value[:optional] == true
      end

      return "#{sparql.string} WHERE { #{sparql_where_clause.string} }"
    end
  end

end

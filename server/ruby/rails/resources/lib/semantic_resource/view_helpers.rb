module SemanticResource
  module ViewHelpers

    # Begins a new RDFa description of the resource.
    # - about: the URI of the resource, this value is required
    # - options:
    #    - tag: the tag where the description will be inserted, span by default
    #    - typeof: URI the type of the resource
    def rdfa_description(about,options={})
      tag = options[:tag] || 'span'
      typeof = options[:typeof] || self.class.resource_model_uri

      options.delete(:tag)
      options.delete(:typeof)

      rdfa = StringIO.new
      rdfa << "<#{tag} typeof='#{typeof}' about='#{about}' "
      options.each_pair do |k,v|
        rdfa << "#{k}='#{v}' "
      end
      if(block_given?)
        rdfa << ">"
        rdfa << yield
        rdfa << "</#{tag}>"
      else
        rdfa << " />"
      end

      rdfa.string
    end

    # returns a hash of options that can be used to create a
    # RDFa description in other view helpers
    def rdfa_description_hash(about,options={})
      options[:typeof] ||= self.class.resource_model_uri
      options[:about] = about

      options
    end

    # Builds the description of a RDFa property (predicate and object)
    # - name: name of the property, symbol with a property name or string with an URI
    # - tag: the tat where the property description will be inserted
    # - options:
    #    - content: a string value, true, false or nil. If false or nil is passed the content will not be inserted
    #               if a string is passed that value will be inserted, if true passed, the value will be retrieved from
    #               the object
    #    - datatype: datatype of the property
    def rdfa_property(name,tag,options={})
      property_value = options[:content] || false
      property_uri = name
      property_datatype = options[:datatype]
      if(name.instance_of?(Symbol))
        key = self.class.resource_mapping.keys.detect do |k|
          k == name
        end
        raise Exception.new("Unknown rdfa property #{name} for object #{self}") if key.nil?
        property_value = options[:content] || false
        property_value = self.send(name) if property_value == true
        property_uri = "#{SemanticResource::Configuration.namespaces_map[self.class.resource_mapping[key].first]}#{self.class.resource_mapping[key].last}"
      end
      options.delete(:content)
      options.delete(:datatype)

      rdfa = StringIO.new

      rdfa << "<#{tag} property='#{property_uri}'"
      if(property_value != false)
        rdfa << " content='#{property_value}'"
      end
      if(property_datatype)
        rdfa << " datatype='#{property_datatype}'"
      end

      options.each_pair do |k,v|
        rdfa << "#{k}='#{v}' "
      end
      if(block_given?)
        rdfa << ">"
        rdfa << yield if block_given?
        rdfa << "</#{tag}>"
      else
        rdfa << " />"
      end

      rdfa.string
    end

    # Returns a hash with the attributes for the RDFa property description that can be
    # passed to other view helpers
    def rdfa_property_hash(name,options)
      if(name.instance_of?(Symbol))
        key = self.class.resource_mapping.keys.detect do |k|
          k == name
        end
        raise Exception.new("Unknown rdfa property #{name} for object #{self}") if key.nil?
        property_value = options[:content] || false
        options[:content] = self.send(name) if property_value == true
        options[:property] = "#{SemanticResource::Configuration.namespaces_map[self.class.resource_mapping[key].first]}#{self.class.resource_mapping[key].last}"
      end
      return options
    end

    # Builds the description of a RDFa relation (predicate and object)
    # - name: name of the property, symbol with a property name or string with an URI
    # - tag: the tat where the property description will be inserted
    # - options:
    #    - content: a string value, true, false or nil. If false or nil is passed the content will not be inserted
    #               if a string is passed that value will be inserted, if true passed, the value will be retrieved from
    #               the object
    #    - datatype: datatype of the property
    def rdfa_relation(name,tag,relation,options={})
      property_value = relation
      property_uri = name
      property_datatype = options[:datatype]
      if(name.instance_of?(Symbol))
        key = self.class.resource_mapping.keys.detect do |k|
          k == name
        end
        raise Exception.new("Unknown rdfa property #{name} for object #{self}") if key.nil?
        property_uri = "#{SemanticResource::Configuration.namespaces_map[self.class.resource_mapping[key].first]}#{self.class.resource_mapping[key].last}"
      end
      options.delete(:datatype)

      rdfa = StringIO.new

      rdfa << "<#{tag} rel='#{property_uri}'"
      rdfa << " href='#{property_value}'"

      options.each_pair do |k,v|
        rdfa << "#{k}='#{v}' "
      end
      if(block_given?)
        rdfa << ">"
        rdfa << yield if block_given?
        rdfa << "</#{tag}>"
      else
        rdfa << " />"
      end

      rdfa.string
    end

  end
end

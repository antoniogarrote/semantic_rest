module SemanticResource

  # This class is intended to store information about all
  # the semantic resources in an application so it can be
  # queried for different uses

  class Manager

     # All the resources classes will be stored here
    def self.resources
      @@resources = Array.new unless defined? @@resources
      self.refresh_models if @@resources.empty?
      @@resources
    end

    def self.resources=(resources)
      @@resources = resources
    end

    def self.register_resource resource_class
      @@resources = Array.new unless defined? @@resources
      @@resources.push resource_class unless @@resources.include? resource_class
    end

     # All the resources model classes will be stored here
    def self.models
      @@models = Hash.new unless defined? @@models
      self.refresh_models if @@models.keys.empty?
      @@models
    end

    def self.models=(models)
      @@models = models
    end

    def self.register_model model_name, model_class
      @@models = Hash.new unless defined? @@models
      @@models[model_name] = model_class
    end

     # All the resources services classes will be stored here
    def self.services
      @@services = Hash.new unless defined? @@services
      self.refresh_models if @@services.keys.empty?
      @@services
    end

    def self.services=(services)
      @@services = services
    end

    def self.register_service service_name, model_class
      @@services = Hash.new unless defined? @@services
      @@services[service_name] = model_class
    end

     # All the resources lowring generators will be stored here
    def self.lowering_operations
      @@lowering_operations = Hash.new unless defined? @@lowering_operations
      self.refresh_models if @@lowering_operations.keys.empty?
      @@lowering_operations
    end

    def self.lowering_operations=(lowering_operations)
      @@lowering_operations = lowering_operations
    end

    def self.register_lowering_operation service_name, lowering_hash
      @@lowering_operations = Hash.new unless defined? @@lowering_operations
      @@lowering_operations[service_name] = lowering_hash
    end

    private

    def self.refresh_models
      Dir["#{RAILS_ROOT}/app/models**/*.rb"].each do |f|
        require f.split(".rb").first
        filename = File.basename(f, '.rb')
        model = filename.camelize.constantize
        model.register_semantic_resource if model.respond_to?(:register_semantic_resource)
      end
    end

  end
end

# we must be sure that all the models has been loaded before proceeding
Dir["#{RAILS_ROOT}/app/models**/*.rb"].each do |f|
  require f
end

require File.dirname(__FILE__) + '/semantic_resource/controller_common'
require File.dirname(__FILE__) + '/semantic_resource/manager'
require File.dirname(__FILE__) + '/semantic_resource/base'
require File.dirname(__FILE__) + '/semantic_resource/controller_base'
require File.dirname(__FILE__) + '/semantic_resource/configuration'
require File.dirname(__FILE__) + '/semantic_resource/schemas_controller'

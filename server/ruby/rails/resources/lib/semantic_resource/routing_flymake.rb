
module SemanticResource

  def self.draw_routes_to_semantic_controller(map,controller_name)
    map.connect 'schemas/models/:model_name.:format', :controller => controller_name, :action => 'models'
    map.connect 'schemas/services/:service_name.:format', :controller => controller_name, :action => 'services'
    map.connect 'schemas/lowering/:model_name/:operation.:format', :controller => controller_name, :action => 'lowering'
    map.connect 'schemas/lifting/:model_name/:operation.:format', :controller => controller_name, :action => 'lifting'
  end

end

module SemanticResource

  # Common functionality for all the semantic controllers
  module ControllerCommon
    def check_jsonp_response(response,name_of_callback = :callback)
      base_response = response
      content_type = nil

      if(params[name_of_callback])
        base_response = "#{params[:callback]}('#{response.gsub('\'','"').gsub("\n"," ")}');" if base_response
        content_type = "text/javascript"
      end

      return base_response,content_type
    end
  end

end

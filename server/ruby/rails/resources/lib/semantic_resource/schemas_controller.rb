module SemanticResource

  class SchemasController < ApplicationController

    def models
      rdf = ""
      status = 404

      format = (params[:format] || :n3).to_sym

      SemanticResource::Manager.models.each_pair do |model,resource|
        if model == params[:model_name]
          rdf = resource.to_rdf(format)
          status = 200
        end
      end

      if(format == :n3 || format == :rdf)
        render(:text => rdf,
               :content_type => "text/rdf+n3",
               :status => status)
      elsif(format == :xml)
        render(:text => rdf,
               :content_type => "application/rdf+xml",
               :status => status)
      end
    end

    def lowering
      sparql = ""
      status = 404

      SemanticResource::Manager.lowering_operations.each_pair do |model_name,lowering|
        if model_name == params[:model_name]
          resource = SemanticResource::Manager.models[model_name]
          if( params[:operation] && resource.respond_to?(lowering[params[:operation]]))
            sparql = resource.send(lowering[params[:operation]].to_sym,resource)
            status = 200
          end
        end
      end
      render(:text => sparql,
             :content_type => "application/sparql-query",
             :status => status)
    end

    def lifting
    end

    def services
      rdf = nil
      status = 404

      SemanticResource::Manager.services.each_pair do |service,resource|

        if service == params[:service_name]
          format = params[:format] || :n3
          format = format.to_sym
          format = :n3 if format == :rdf  #temporal

          rdf = resource.to_service_description(format.to_sym)
          status = 200

          if(format == :n3)
            render(:text => rdf,
                   :content_type => "text/rdf+n3",
                   :status => status)
          elsif(format == :xml)
            render(:text => rdf,
                   :content_type => "application/rdf+xml",
                   :status => status)
          elsif(format == :html)
            render(:inline => rdf)
          end
        end

      end

      render(:text => "",
             :content_type => "text/rdf+n3",
             :status => status)  if rdf.nil?
    end # end of services

  end
end

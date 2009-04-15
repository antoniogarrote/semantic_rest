require 'builder'

class ServiceDescription
  attr_accessor :identifier
  attr_accessor :label
  attr_accessor :operations

  def initialize(opts)
    @identifier = opts[:identifier]
    @label = opts[:label]
    @operations = Array.new
  end

  def add_operation operation
    @operations.push operation
  end

  def to_html opts=nil
    out = StringIO.new

    builder = nil
    if opts && opts[:builder]
      builder = opts[:builder]
    else
      builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)
    end


    builder.div(:class => "service", :id => @identifier) do |div|
      div.h1 do |h1|
        h1.span(@label,:class => "label")
        h1 << "API"
      end
      operations.each do |op|
        if opts && opts[:builder]
          opts[:builder] = div
          op.to_html opts
        else
          div << op.to_html(opts)
        end
      end
    end

    out.string
  end

  def to_rdfa opts=nil
    out = StringIO.new

    builder = nil
    if opts && opts[:builder]
      builder = opts[:builder]
    else
      builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)
    end

    builder.div(:typeOf => "wsl:Service",
                :about => "##{@identifier}",
                :"xmlns.hr" => "http://www.wsmo.org/ns/hrests#",
                :"xmlns:wsl" => "http://www.wsmo.org/ns/wsmo−lite#",
                :"xmlns:rdfs" => "http://www.w3.org/2000/01/rdf−schema#") do |div|
      div.h1 do |h1|
        h1.span(@label,:property => "rdfs:label")
        h1 << "API"
      end
      operations.each do |op|
        div.div(:rel => "wsl:hasOperation") do |div_b|
         if opts && opts[:builder]
           opts[:builder] = div_b
           op.to_rdfa opts
         else
           div_b << op.to_rdfa(opts)
         end
        end
      end
    end

    out.string
  end

  def to_json
    out = StringIO.new
    builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)
    builder.reset_blank_node_generator

    out << "{ \"##{@identifier}\" : { \"http://www.w3.org/2000/01/rdf−schema#label\" : [ { \"value\" : \"#{@label}\", \"type\" : \"literal\" } ] "
    out <<                        ", \"http://www.w3.org/2000/01/rdf−schema#type\" : [ { \"value\" : \"http://www.wsmo.org/ns/wsmo−lite#Service\", \"type\" : \"uri\" } ] "
    ops_out = StringIO.new
    operations.each do |op|
      out <<                      ", \"http://www.wsmo.org/ns/wsmo−lite#hasOperation\" : [ { \"value\" : \"##{op.identifier}\", \"type\" : \"uri\" } ] "
      ops_out << op.to_json
    end
    out << " } "
    out << ops_out.string
    out << " }"
    out.string
  end
end

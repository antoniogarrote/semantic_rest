class Message

  attr_accessor :model
  attr_accessor :transformation
  attr_accessor :name
  attr_accessor :description

  def initialize(opts)
    @model = opts[:model] || nil
    @transformation = opts[:transformation] || nil
    @name = opts[:name]
    @description = opts[:description] || nil
  end

  def to_html(opts)
    out = StringIO.new

    builder = nil
    if opts && opts[:builder]
      builder = opts[:builder]
    else
      builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)
    end


    li_params = {}

    li_params = li_params.merge(:class => :input) if opts[:mode] == :input
    li_params = li_params.merge(:class => :output) if opts[:mode] == :output

    builder.li(li_params) do |li|
      a_params = {:rel => "model"}
      a_params = a_params.merge(:href => @model)
      li.a(a_params) do |a|
        a.code(@name)
      end
      li << @description if @description
      if @transformation
        li << " ("
        li.a("lowering",:rel => :lowering, :href => @transformation)
        li << ")"
      end
    end
    out.string
  end

  def to_rdfa opts
    out = StringIO.new

    builder = nil
    if opts && opts[:builder]
      builder = opts[:builder]
    else
      builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)
    end

    message_tag = ""
    if opts[:mode] == :input
      message_tag = "wsl:hasInputMessage"
      transformation_tag = "sawsdl:loweringSchemaMapping"
    else
      message_tag = "wsl:hasOutputMessage"
      transformation_tag = "sawsdl:liftingSchemaMapping"
    end

    builder.span(:rel => message_tag) do |span|
      span.li(:typeOf => "wsl:Message") do |li|
        a_params = {:rel => "sawsdl:modelReference", :href => @model}
        li.a(a_params) do |a|
          a.code(@name)
        end
        li << @description if @description
        if @transformation && opts[:mode] == :input
          li << " ("
          li.a("lowering",:rel => transformation_tag, :href => @transformation)
          li << ")"
        else
          li << " ("
          li.a("lifting",:rel => transformation_tag, :href => @transformation)
          li << ")"
        end
      end
    end


    out.string
  end

  def to_json bnode,mode
    transformation_tag = ""
    if mode == :input
      transformation_tag = "http://www.w3.org/ns/sawsdl#loweringSchemaMapping"
    else
      transformation_tag = "liftingSchemaMapping"
    end


    out = StringIO.new
    out <<                        " \"http://www.w3.org/2000/01/rdf−schema#type\" : [ { \"value\" : \"http://www.wsmo.org/ns/wsmo−lite#Message\", \"type\" : \"uri\" } ] "
    out <<                        ", \"http://www.w3.org/ns/sawsdl#modelReference\" : [ { \"value\" : \"#{@model}\", \"type\" : \"uri\" } ] "
    out <<                        ", \"#{transformation_tag}\" : [ { \"value\" : \"#{@transformation}\", \"type\" : \"uri\" } ]"

    out.string
  end
end

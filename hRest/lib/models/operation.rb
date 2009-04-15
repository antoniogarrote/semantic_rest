require "#{APP_ROOT}/lib/extensions/builder"

class Operation
  attr_accessor :label
  attr_accessor :method
  attr_accessor :identifier
  attr_accessor :input_messages
  attr_accessor :output_messages
  attr_accessor :address

  def initialize(opts)
    @identifier = opts[:identifier]

    @label = opts[:label]

    @method = opts[:method] if opts[:method].instance_of? Symbol
    @method = opts[:method].downcase.to_sym unless opts[:method].instance_of? Symbol

    @address = opts[:address]

    raise Exception.new("Invalid HTTP method: #{@labe}") if (@method != :get &&
                                                             @method != :post &&
                                                             @method != :put &&
                                                             @method != :delete &&
                                                             @method != :options &&
                                                             @method != :head)
    @input_messages = Array.new
    @output_messages = Array.new
  end

  def add_input_message message
    @input_messages.push message
  end

  def add_output_message message
    @output_messages.push message
  end

  def to_html opts=nil
    out = StringIO.new

    builder = nil
    if opts && opts[:builder]
      builder = opts[:builder]
    else
      builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)
    end

    builder.div(:class => "operation", :id => @identifier) do |div|
      div.h2 do |h2|
        h2 << "Operation "
        h2.code(@label,:class => "label")
      end
      div.p do |p|
        p << "Invoked using the "
        p.span(:class => "method") do |ip|
          ip << @method.to_s.upcase
        end
        p << " method at "
        p.code(:class => "address") do |ip|
          ip << @address
        end
      end
      div.strong("Input Parameters")
      div.ul do |ul|
        input_messages.each do |im|
          if opts && opts[:builder]
            opts[:builder] = ul
            im.to_html opts.merge(:mode => :input)
          else
            ul << im.to_html(:mode => :input)
          end
        end
      end
      div.strong("Output response")
      div.ul do |ul|
        output_messages.each do |im|
          if opts && opts[:builder]
            opts[:builder] = ul
            im.to_html opts.merge(:mode => :output)
          else
            ul << im.to_html(:mode => :output)
          end
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

    builder.span(:typeOf => "wsl:Operation",
                :about => "##{@identifier}") do |div|
      div.h2 do |h2|
        h2 << "Operation "
        h2.code(@label,:property => "rdfs:label")
      end
      div.p do |p|
        p << "Invoked using the "
        p.span(:property => "hr:hasMethod") do |ip|
          ip << @method.to_s.upcase
        end
        p << " method at "
        p.code(:property => "hr:hasAddress", :datatype => "hr:URITemplate") do |ip|
          ip << @address
        end
      end
      div.strong("Input Parameters")
      div.ul do |ul|
        input_messages.each do |im|
          if opts && opts[:builder]
            opts[:builder] = ul
            im.to_rdfa opts.merge(:mode => :input)
          else
            ul << im.to_rdfa(:mode => :input)
          end
        end
      end
      div.strong("Output response")
      div.ul do |ul|
        output_messages.each do |im|
          if opts && opts[:builder]
            opts[:builder] = ul
            im.to_rdfa opts.merge(:mode => :output)
          else
            ul << im.to_rdfa(:mode => :output)
          end
        end
      end
    end
    out.string
  end

  def to_json
    out = StringIO.new

    builder = Builder::XmlMarkup.new(:target=>out, :indent=>0)

    out << " , "
    out << "\"##{@identifier}\" : { \"http://www.w3.org/2000/01/rdf−schema#label\" : [ { \"value\" : \"#{@label}\", \"type\" : \"literal\" } ] "
    out <<                        ", \"http://www.w3.org/2000/01/rdf−schema#type\" : [ { \"value\" : \"http://www.wsmo.org/ns/wsmo−lite#Operation\", \"type\" : \"uri\" } ] "
    out <<                        ", \"http://www.wsmo.org/ns/hrests#hasMethod\" : [ { \"value\" : \"#{@method.to_s.upcase}\", \"type\" : \"literal\" } ] "
    out <<                        ", \"http://www.wsmo.org/ns/hrests#hasAddress\" : [ { \"value\" : \"#{@address}\", \"type\" : \"literal\", \"datatype\" : \"http://www.wsmo.org/ns/hrests#URITemplate\" } ] "
    im_out = StringIO.new
    om_out = StringIO.new
    input_messages.each do |im|
      identifier = builder.next_blank_node
      out <<                      ", \"http://www.wsmo.org/ns/wsmo−lite#hasInputMessage\" : [ { \"value\" : \"#{identifier}\", \"type\" : \"bnode\" } ] "
      im_out << " , \"#{identifier}\" : { "
      im_out << im.to_json(identifier,:input)
      im_out << " } "
    end
    output_messages.each do |om|
      identifier = builder.next_blank_node
      out <<                      ", \"http://www.wsmo.org/ns/wsmo−lite#hasOutputMessage\" : [ { \"value\" : \"#{identifier}\", \"type\" : \"bnode\" } ] "
      om_out << " , \"#{identifier}\" : { "
      om_out << om.to_json(identifier,:output)
      om_out << " } "
    end
    out << " } "
    out << im_out.string
    out << om_out.string
    out.string
  end
end

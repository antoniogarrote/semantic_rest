require 'builder'

require "#{MODELS_PATH}/service_description"
require "#{APP_ROOT}/lib/parser/yaml"

class Generator

  attr_accessor :service

  def initialize(path)
    @service = Parser::Yaml.parse(path).first
  end

  def full_html options = {:indent => 0}
    out = StringIO.new

    builder = Builder::XmlMarkup.new(options.merge(:target=>out))
    builder.comment! 'DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"'
    builder.instruct!
    builder.html(:xmlns => "http://www.w3.org/1999/xhtml") do |html|
      html.head do |h|
        h.title ""
      end
      html.body do |body|
        if options[:indent] != 0
          @service.to_html options.merge(:builder => builder)
        else
          body << @service.to_html
        end
      end
    end
    out.string
  end

  def fragment_html options = {:indent => 0}
    out = StringIO.new
    builder = Builder::XmlMarkup.new(options.merge(:target=>out))

    if options[:indent] != 0
      @service.to_html options.merge(:builder => builder)
    else
      @service.to_html
    end
    return out.string
  end

  def full_rdfa options = {:indent => 0}
    out = StringIO.new

    builder = Builder::XmlMarkup.new(options.merge(:target=>out))
    builder.comment! 'DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"'
    builder.instruct!
    builder.html(:xmlns => "http://www.w3.org/1999/xhtml",
                 :version => "XHTML+RDFa 1.0") do |html|
      html.head do |h|
        h.title ""
      end
      html.body do |body|
        if options[:indent] != 0
          @service.to_rdfa options.merge(:builder => builder)
        else
          body << @service.to_rdfa
        end
      end
    end
    out.string
  end

  def fragment_rdfa options = {:indent => 0}
    out = StringIO.new
    builder = Builder::XmlMarkup.new(options.merge(:target=>out))
    if options[:indent] != 0
      @service.to_rdfa options.merge(:builder => builder)
    else
      @service.to_rdfa
    end
    return out.string
  end

end

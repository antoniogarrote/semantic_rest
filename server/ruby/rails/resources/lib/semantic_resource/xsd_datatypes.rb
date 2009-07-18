module SemanticResource
  XSD_DATATYPES = {
    :string => "http://www.w3.org/2001/XMLSchema#string",
    :boolean => "http://www.w3.org/2001/XMLSchema#boolean",
    :decimal => "http://www.w3.org/2001/XMLSchema#decimal",
    :float => "http://www.w3.org/2001/XMLSchema#float",
    :double => "http://www.w3.org/2001/XMLSchema#double",
    :dateTime => "http://www.w3.org/2001/XMLSchema#dateTime",
    :time => "http://www.w3.org/2001/XMLSchema#time",
    :date => "http://www.w3.org/2001/XMLSchema#date",
    :gYearMonth => "http://www.w3.org/2001/XMLSchema#gYearMonth",
    :gYear => "http://www.w3.org/2001/XMLSchema#gYear",
    :gMonthDay => "http://www.w3.org/2001/XMLSchema#gMonthDay",
    :gDay => "http://www.w3.org/2001/XMLSchema#gDay",
    :gMonth => "http://www.w3.org/2001/XMLSchema#gMonth",
    :hexBinary => "http://www.w3.org/2001/XMLSchema#hexBinary",
    :base64Binary => "http://www.w3.org/2001/XMLSchema#base64Binary",
    :anyURI => "http://www.w3.org/2001/XMLSchema#anyURI",
    :normalizedString => "http://www.w3.org/2001/XMLSchema#normalizedString",
    :token => "http://www.w3.org/2001/XMLSchema#token",
    :language => "http://www.w3.org/2001/XMLSchema#language",
    :NMTOKEN => "http://www.w3.org/2001/XMLSchema#NMTOKEN",
    :Name => "http://www.w3.org/2001/XMLSchema#Name",
    :NCName => "http://www.w3.org/2001/XMLSchema#NCName",
    :integer => "http://www.w3.org/2001/XMLSchema#integer",
    :nonPositiveInteger => "http://www.w3.org/2001/XMLSchema#nonPositiveInteger",
    :negativeInteger => "http://www.w3.org/2001/XMLSchema#negativeInteger",
    :long => "http://www.w3.org/2001/XMLSchema#long",
    :int => "http://www.w3.org/2001/XMLSchema#int",
    :short => "http://www.w3.org/2001/XMLSchema#short",
    :byte => "http://www.w3.org/2001/XMLSchema#byte",
    :nonNegativeInteger => "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    :unsignedLong => "http://www.w3.org/2001/XMLSchema#unsignedLong",
    :unsignedInt => "http://www.w3.org/2001/XMLSchema#unsignedInt",
    :unsignedShort => "http://www.w3.org/2001/XMLSchema#unsignedShort",
    :unsignedByte => "http://www.w3.org/2001/XMLSchema#unsignedByte",
    :positiveInteger => "http://www.w3.org/2001/XMLSchema#positiveInteger" }.freeze

  class XSD
    class << self
      XSD_DATATYPES.each_pair do |k,v|
        define_method(k){ v }
      end

      def self.method_missing(datatype)
        "http://www.w3.org/2000/01/rdf-schema#Datatype"
      end
    end
  end
end

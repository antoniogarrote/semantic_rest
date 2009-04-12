require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")

require "#{APP_ROOT}/lib/script/generator"
require "#{MODELS_PATH}/service_description"

describe Generator do
  it "should be initialized with a YAML file path, parse it and store a single service object" do
    generator = Generator.new(path_for_sample("hotel","yaml"))
    generator.service.should be_instance_of(ServiceDescription)
  end

  it "should raise an exception if no YAML file is found at the provided path" do
    lambda {
      generator = Generator.new("/foo/path")
    }.should raise_error
  end

end

describe Generator,".full_html" do
  it "should generate a full html document with the description of the service" do
    generator = Generator.new(path_for_sample("hotel","yaml"))

    generator.full_html.index("<html").should_not be_nil
    generator.full_html.index("</html>").should_not be_nil
    generator.full_html.index("<body>").should_not be_nil
    generator.full_html.index("</body>").should_not be_nil
    generator.full_html.index("<head>").should_not be_nil
    generator.full_html.index("</head>").should_not be_nil
  end
end

describe Generator,".fragment_html" do
  it "should generate a fragment of a html document with the description of the service" do
    generator = Generator.new(path_for_sample("hotel","yaml"))

    generator.fragment_html.index("<html").should be_nil
    generator.fragment_html.index("</html>").should be_nil
    generator.fragment_html.index("<body>").should be_nil
    generator.fragment_html.index("</body>").should be_nil
    generator.fragment_html.index("<head>").should be_nil
    generator.fragment_html.index("</head>").should be_nil
  end
end

describe Generator,".full_rdfa" do
  it "should generate a full xhtml document with the description of the service" do
    generator = Generator.new(path_for_sample("hotel","yaml"))

    generator.full_rdfa.index("<html").should_not be_nil
    generator.full_rdfa.index("</html>").should_not be_nil
    generator.full_rdfa.index("<body>").should_not be_nil
    generator.full_rdfa.index("</body>").should_not be_nil
    generator.full_rdfa.index("<head>").should_not be_nil
    generator.full_rdfa.index("</head>").should_not be_nil
  end
end

describe Generator,".fragment_rdfa" do
  it "should generate a fragment of a xhtml document with the description of the service" do
    generator = Generator.new(path_for_sample("hotel","yaml"))

    generator.fragment_rdfa.index("<html").should be_nil
    generator.fragment_rdfa.index("</html>").should be_nil
    generator.fragment_rdfa.index("<body>").should be_nil
    generator.fragment_rdfa.index("</body>").should be_nil
    generator.fragment_rdfa.index("<head>").should be_nil
    generator.fragment_rdfa.index("</head>").should be_nil
  end
end

require File.expand_path(File.dirname(__FILE__) + "/../config/environment")
require File.expand_path(File.dirname(__FILE__) + "/fixtures")

require 'ruby-debug'
require 'hpricot'

SAMPLES_PATH = "#{APP_ROOT}/specs/samples"

def path_for_sample(name,extension)
  "#{SAMPLES_PATH}/#{name}.#{extension}"
end

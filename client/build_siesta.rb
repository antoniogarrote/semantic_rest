#!env ruby
require 'rubygems'
require 'sprockets'

if(ARGV.size == 0 || ARGV[0] == "javascript")
  @platform = :javascript
elsif(ARGV[0] == "java")
  @platform = :java
else
  raise Exception.new("Unknown platform #{ARGV[0]}, choose 'javascript' or 'java'")
end

@load_path = ["./**/*.js"]


if(@platform == :javascript)
  @source_files = ["libs/drivers/jquery/load.js","framework.js"]
  @source_files << "libs/drivers/hercules/load.js"
  @source_files << "libs/drivers/oat/load.js"
  @source_files << "libs/drivers/w3c/load.js"

  @source_files << "libs/drivers/hercules/sparql/query.js"
  @source_files << "libs/drivers/hercules/formats/turtle.js"
  @source_files << "libs/drivers/oat/formats/xml.js"
  @source_files << "libs/drivers/w3c/formats/rdfa.js"
  @source_files << "libs/drivers/jquery/network.js"
else
  # TODO: java here
  @source_files = ["framework.js"]
end

secretary = Sprockets::Secretary.new(
  :asset_root   => "./",
  :load_path    => @load_path,
  :source_files => @source_files
)

# Generate a Sprockets::Concatenation object from the source files
concatenation = secretary.concatenation

# Write the concatenation to disk
concatenation.save_to("siesta.js")

# Install provided assets into the asset root
# secretary.install_assets

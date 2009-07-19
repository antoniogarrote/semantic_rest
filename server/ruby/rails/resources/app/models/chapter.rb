require 'semantic_resource/base'

class Chapter < ActiveRecord::Base
  unloadable

  belongs_to :book

  include SemanticResource

  set_resource_namespace :test, "http://test.com"

  set_resource_path :book_id

  set_resource_mapping do |resource|
    resource[:title] = {:uri => [:test,"#title"],
                        :optional => true}

    resource[:number] = {:uri => [:test,"#number"],
                         :optional => true}

    resource[:start_page] = {:uri => [:test,"#startPage"],
                             :optional => true}

    resource[:end_page] = {:uri => [:test,"#endPage"],
                           :optional => true}

    resource[:book] = { :uri => [:test,"#fromBook"] }
  end

  define_show_operation(:controller => 'chapters', :action => 'show')
  define_create_operation(:controller => 'chapters', :action => 'create')
  define_destroy_operation(:controller => 'chapters', :action => 'destroy')
  define_update_operation(:controller => 'chapters', :action => 'update')
end

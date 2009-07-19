require 'semantic_resource/base'

class Book < ActiveRecord::Base
  unloadable
  has_many :chapters

  include SemanticResource

  set_resource_namespace :test, "http://test.com"

  set_resource_mapping do |resource|
    resource[:title] = {:uri => [:test,"#title"],
                        :optional => true }

    resource[:published] = {:uri => [:test,"#published"],
                            :optional => true}

    resource[:category] = {:uri => [:test,"#category"],
                           :optional => true}

    resource[:pages] = {:uri => [:test,"#numberOfPages"],
                        :optional => true}

    resource[:isbn] = {:uri => [:test,"#isbn"],
                       :optional => true}

    resource[:editorial] = {:uri => [:test,"#editorial"],
                            :optional => true}

    resource[:chapters] = { :uri => [:test,"#hasChapter"] }
  end

  define_show_operation(:controller => 'books', :action => 'show')
  define_create_operation(:controller => 'books', :action => 'create')
  define_destroy_operation(:controller => 'books', :action => 'destroy')
  define_update_operation(:controller => 'books', :action => 'update')
end

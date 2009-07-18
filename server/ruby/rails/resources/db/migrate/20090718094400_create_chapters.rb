class CreateChapters < ActiveRecord::Migration
  def self.up
    create_table :chapters do |t|
      t.string :title
      t.integer :number
      t.integer :start_page
      t.integer :end_page
      t.integer :book_id
      t.timestamps
    end
  end

  def self.down
    drop_table :chapters
  end
end

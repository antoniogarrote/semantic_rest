class CreateBooks < ActiveRecord::Migration
  def self.up
    create_table :books do |t|
      t.string :title
      t.date :published
      t.string :category
      t.integer :pages
      t.string :isbn
      t.string :editorial
      t.timestamps
    end
  end

  def self.down
    drop_table :books
  end
end

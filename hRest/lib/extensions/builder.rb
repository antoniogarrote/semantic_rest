require 'builder'

class Builder::XmlBase

  @@chars_ids_counter = 0

  def self.chars_ids_counter
    @@chars_ids_counter
  end

  def self.chars_ids_counter=(value)
    @@chars_ids_counter  = value
  end


  def next_blank_node
    @chars_ids = @chars_ids || "abcdefghijklmnopqrstuvwxyz"

    next_id = "_:"

    tmp = Builder::XmlBase.chars_ids_counter
    go_on = true
    while go_on
      pos = (tmp % @chars_ids.size)
      next_id << @chars_ids[pos .. pos]
      go_on =  (tmp / @chars_ids.size) > 0
      tmp = (tmp / @chars_ids.size) if go_on
    end

    Builder::XmlBase.chars_ids_counter += 1

    return next_id
  end

  def reset_blank_node_generator
    Builder::XmlBase.chars_ids_counter = 0
  end
end

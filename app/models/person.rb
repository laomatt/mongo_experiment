class Person
  include Mongoid::Document
  field :name, type: String
  field :show, type: String
  field :pic, type: String
  field :city, type: String
  field :state, type: String
end

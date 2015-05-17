# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require "mongo"
require "json"

seed_data = [
  {
    'name' => '1970s',
    'city' => 'Debby Boone',
    'state' => 'You Light Up My Life',
    'show' => '10'
  },
  {
    'name' => '1980s',
    'city' => 'Olivia Newton-John',
    'state' => 'Physical',
    'show' => '10'
  }]

  uri="mongodb://matt_lao:trouble@ds031822.mongolab.com:31822/characters"

  client= Mongo::MongoClient.from_uri(uri)

  db=client.db("characters")

  chars = db.collections("characters")

  chars.insert(seed_data)
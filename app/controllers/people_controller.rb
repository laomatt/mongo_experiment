require 'rubygems'
require 'mongo'
require 'bson'

class PeopleController < ApplicationController
  before_action :set_person, only: [:show, :edit, :update, :destroy]
  include Mongo
  include BSON

  def index
  end

  def index_all
    uri="mongodb://matt_lao:trouble@ds031822.mongolab.com:31822/characters"
    @client = Mongo::Client.new(uri)
    people = @client[:people].find({})
    render :json => people
  end

  def show
  end

  def new
    @person = Person.new
  end

  def edit
  end

  def create
    uri="mongodb://matt_lao:trouble@ds031822.mongolab.com:31822/characters"
    @client = Mongo::Client.new(uri)
    in_data={name:params[:name], city:params[:city], state: params[:state],pic:params[:pic],show:params[:show]}
    @client[:people].insert_one(in_data)

    render :json => @client[:people].find(in_data).first
  end

  def update
    new_info={name:params[:name],city:params[:city],state:params[:show],show:params[:show],pic:params[:pic]}
    uri="mongodb://matt_lao:trouble@ds031822.mongolab.com:31822/characters"
    @client = Mongo::Client.new(uri)
    per = @client[:people].find({:_id => BSON::ObjectId.from_string(params[:id])})
    per.update_one(new_info)

    render :json => per
  end

  def destroy
    uri="mongodb://matt_lao:trouble@ds031822.mongolab.com:31822/characters"
    @client = Mongo::Client.new(uri)
    per = @client[:people].find({:_id => BSON::ObjectId.from_string(params[:id])}).delete_many

    render :json => per
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_person
      # @person = Person.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def person_params
      p 'y'*90
      p params
      params.require(:person).permit(:name, :city, :state)
    end
  end

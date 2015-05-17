class PeopleController < ApplicationController
  before_action :set_person, only: [:show, :edit, :update, :destroy]

  # GET /people
  # GET /people.json
  def index
    @people = Person.all
  end

  def index_all
    # Mongo::Client.new('mongodb://matt_lao:trouble@ds031822.mongolab.com:31822/characters')
    people = Person.all
    render :json => people
  end

  # GET /people/1
  # GET /people/1.json
  def show
  end

  # GET /people/new
  def new
    @person = Person.new
  end

  # GET /people/1/edit
  def edit
  end

  # POST /people
  # POST /people.json
  def create
    # @person = Person.new(person_params)
    @person = Person.create(name:params[:name], city:params[:city], state: params[:state],pic:params[:pic],show:params[:show])

    render :json => @person
  end

  # PATCH/PUT /people/1
  # PATCH/PUT /people/1.json
  def update
    per = Person.find(params[:id])
    per.update_attributes(name:params[:name],city:params[:city],state:params[:show],show:params[:show],pic:params[:pic])
    render :json => per
  end

  # DELETE /people/1
  # DELETE /people/1.json
  def destroy
    per = Person.find(params[:id])
    Person.find(params[:id]).destroy
    render :json => per
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_person
      @person = Person.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def person_params
      p 'y'*90
      p params
      params.require(:person).permit(:name, :city, :state)
    end
  end

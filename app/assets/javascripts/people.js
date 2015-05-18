$(document).on("page:change", function(){


//my model for my person object
var Person = Backbone.Model.extend({
  defaults: {
    name:"empty spot",
    city:'nowhere',
    state:'nowhere',
    pic:'http://images.clipartpanda.com/sad-girl-stick-figure-image.png',
    show:'no show',
  },
  urlRoot: '/accounts',
  create:function(){
  },
  remove:function(){
    var id=this.get('_id').$oid
    $.ajax({
      url: 'people/'+this.get('_id').$oid,
      type: 'DELETE',
    }).done(function(data){
      console.log(data)
      setTimeout(function(){
        $("#"+id).fadeOut(1500);
      })



      // var divs_to_shake = $('#people-list').children()
      // setTimeout(slide_and_shake(divs_to_shake),100)

    })
  },
  save: function(){
    $.ajax({
      url: '/people/'+this.get('_id').$oid,
      type: 'PATCH',
      data: {name:this.get('name'),city:this.get('city'),state:this.get('state'),pic:this.get('pic'),show:this.get('show')},
    })
  }
})

//my view for a models view to DOM
var PersonView=Backbone.View.extend({
  template: _.template('<div id="<%= _id.$oid %>" class="person-box"><img class="avatar" src="<%=pic%>"><%= name %>   <div class="options-box" id="links_for<%= _id.$oid %>" >-<a class="remove-person" href="#"> Remove</a><a class="inspect-person" href="#">Inspect</a><br></div><br><div id="inspect-box<%= _id.$oid %>" class="inspect-box">Show: <%= show %><br>City: <%= city %><br>State: <%= state%><br><a class="edit-selection" href="#">Edit</a><a class="hide-inspect-box" href="#">Hide</a></div></div>'),
  events: {
    'click a.remove-person':'remove_data',
    'click a.inspect-person':'inspect',
    'click a.edit-selection':'edit',
    'click a.hide-inspect-box':'hide',
    'submit form.edit-form': 'dbsub'
  },
  render: function(){
    var html = this.model.toJSON()
    this.$el.html(this.template(html));
  },
  remove_data: function(){
    this.model.remove()
    // var divs_to_shake = $('#people-list').children()
    // setTimeout(slide_and_shake(divs_to_shake),100)

    // this.remove()

  },
  inspect: function(){
    // $("#inspect-box"+this.model.get('_id').$oid).css('display','block')
    var that=this;
    setTimeout(function(){
      $("#screen").css('display','block')
      $("#inspect-box"+that.model.get('_id').$oid).slideDown('400', function() {
        $("#inspect-box"+that.model.get('_id').$oid).css('display','block')
      });
    })

  },
  hide: function(){
    // $("#inspect-box"+this.model.get('_id').$oid).css('display','none')
    var that=this;
    setTimeout(function(){
      $("#inspect-box"+that.model.get('_id').$oid).slideUp('400', function() {
        $("#inspect-box"+that.model.get('_id').$oid).css('display','none')
        $("#screen").css('display','none')
      });
    })
  },
  edit: function(){
    var editform = '<form class="edit-form" action="#"><input type="text" name="new-name" value="'+this.model.get('name')+'"><input type="text" name="new-city" value="'+this.model.get('city')+'"><input type="text" name="new-state" value="'+this.model.get('state')+'"><input type="text" name="new-pic" placeholder="new picture"><input type="text" name="new-show" placeholder="show"><input type="submit"></form><a class="hide-inspect-box" href="#">Hide</a>'
    $("#inspect-box"+this.model.get('_id').$oid).html(editform)
  },
  dbsub: function(event){
    event.preventDefault();
    this.model.set({name: $('input[name="new-name"]').val(), city: $('input[name="new-city"]').val(), state: $('input[name="new-state"]').val(), pic: $('input[name="new-pic"]').val(), show: $('input[name="new-show"]').val()}
    );
    this.model.save();
    $(".edit-form").trigger('reset');
    this.hide();
    this.render();

  }

})


//Collection of all the people in the people collection
var PersonList = Backbone.Collection.extend({
  model: Person,
  url: '/peopleall'
});


//viewlist for in the people list
var PersonViewList=Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.addOne, this);
  },
  render: function(){
    this.collection.forEach(this.addOne, this)
  },
  addOne: function(person){
    var viewPerson= new PersonView({model:person, url: '/people'});
    this.$el.append(viewPerson.el);
    viewPerson.render()

    $('#people-list').append(viewPerson.el);
    viewPerson.model.create()
    $("#"+viewPerson.model.get('_id').$oid).css('display','none')
    setTimeout(function(){
      $("#"+viewPerson.model.get('_id').$oid).fadeIn(1500);
    })


  }
})

var list = new PersonList();

list.fetch()
var viewList = new PersonViewList({collection: list})
viewList.render()


$('body').on('submit', '.add-people-form', function(event) {
  event.preventDefault();
  $.ajax({
    url: '/people',
    type: 'POST',
    data: $(this).serialize(),
  }).done(function(data){
    viewList.addOne(new Person(data))
  })
  $(this).trigger('reset')
});

$('body').on('mouseover', '.person-box', function(event) {
  event.preventDefault();
  var id=$(this).attr('id')
  $("#links_for"+id).css('display','block')
});

$('body').on('mouseout', '.person-box', function(event) {
  event.preventDefault();
  var id=$(this).attr('id')
  $("#links_for"+id).css('display','none')
});

})


$(document).on("page:change", function(){
//my model for my person object
var firebase_chars = new Firebase("https://tvcharacters.firebaseIO.com")

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
    //remove the _id from the elements_in_DOM array
    // for(var t in elements_in_DOM){
    //   if(elements_in_DOM[t]==id){
    //     elements_in_DOM.remove(t);
    //   }
    // }
    //remove the elements in the DB, then remove it in the DOM
    $.ajax({
      url: 'people/'+this.get('_id').$oid,
      type: 'DELETE',
    }).done(function(data){
      firebase_chars.push({name:"", city:"", state:"", show:"", pic:""})
      setTimeout(function(){
        $("#"+id).fadeOut(1500);
      })
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
  },
  inspect: function(){
    var that=this;
    setTimeout(function(){
      $("#screen").css('display','block')
      $("#inspect-box"+that.model.get('_id').$oid).slideDown('400', function() {
        $("#inspect-box"+that.model.get('_id').$oid).css('display','block')
      });
    })

  },
  hide: function(){
    var that=this;
    setTimeout(function(){
      $("#inspect-box"+that.model.get('_id').$oid).slideUp('400', function() {
        $("#inspect-box"+that.model.get('_id').$oid).css('display','none')
        $("#screen").css('display','none')
      });
    })
  },
  edit: function(){
    var editform = '<form class="edit-form" action="#"><input type="text" name="new-name" value="'+this.model.get('name')+'"><input type="text" name="new-city" value="'+this.model.get('city')+'"><input type="text" name="new-state" value="'+this.model.get('state')+'"><input type="text" name="new-pic" value="'+this.model.get('pic')+'"><input type="text" name="new-show" value="'+this.model.get('show')+'"><input type="submit"></form><a class="hide-inspect-box" href="#">Hide</a>'
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

var elements_in_DOM=[]
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
    elements_in_DOM.push(viewPerson.model.get('_id').$oid)
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
  firebase_chars.push({name:"", city:"", state:"", show:"", pic:""})
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



var hit_noise=new Audio("http://laomatt.github.io/ding.wav")

firebase_chars.on('child_added', function(snapshot) {
  check_for_updates()
  // hit_noise.play();
});


function check_for_updates(){
  console.log("this is happening lksdajflksad")
  $.ajax({
    url: '/check'
  })
  .done(function(data){
    var elements_in_DATABASE=[]
    for(var r in data){
      elements_in_DATABASE.push(data[r].$oid)
    }
    //first we check if we have element _ids in the DB that are not in the DOM
    for(var g in elements_in_DATABASE){
      if(elements_in_DOM.indexOf(elements_in_DATABASE[g]) < 0){
        $.ajax({
          url: '/oneperson/'+elements_in_DATABASE[g],
        })
        .done(function(data) {
          viewList.addOne(new Person(data[0]))
        })
      }
    }
    //now we check if there are element _ids in the DOM that arn't in the DB
    for(var g in elements_in_DOM){
      if(elements_in_DATABASE.indexOf(elements_in_DOM[g]) < 0){
        $("#"+elements_in_DOM[g]).fadeOut(1500);
      }
    }
  // }
})
}



var myDataRef = new Firebase('https://intense-wildwood-8483.firebaseIO.com/');


$('body').on('submit', '.chat-message', function(event) {
  event.preventDefault();
  var text=$("#user-message").val()
  myDataRef.push({textlist:text})

  $("#messages").html('')
  myDataRef.on('child_added', function(snapshot) {
    var m = snapshot.val()
    $("#messages").append(m.textlist+"<br>")
  });
  var height = $("#messages")[0].scrollHeight
  $("#messages").scrollTop(height)
  $(this).trigger('reset')
});



// setInterval(check_for_updates, 7000)

})


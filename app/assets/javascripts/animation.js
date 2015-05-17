function slide_and_shake (array_of_divs) {
  var i=0
  shake_me()
  function shake_me(){
    if(i<array_of_divs.length)
    {
      var to_shake = array_of_divs[i].childNodes[0]
      shake(to_shake)
      i+=1
      shake_me()
    }
  }

}


//shakes a single div
var shake = function(indexID){
  // var id=indexID.id
  var initial=0
  var incre=0
  quibble()
  function quibble(){
    if(incre<20)
    {
      if(incre%2==0)
      {
        initial+=5
      }
      else
      {
        initial-=5
      }
      indexID.style.top=initial+"%"

      incre+=1
      setTimeout(quibble,20)
    }
  }
}
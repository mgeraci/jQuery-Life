$(function(){
  normalize();
})

// normalize an array of coordinates to 0,0
function normalize(){
  a = [[7,24],[8,22],[8,24],[9,12],[9,13],[9,20],[9,21],[9,28],[9,29],[10,11],[10,15],[10,20],[10,21],[10,28],[10,29],[11,0],[11,1],[11,10],[11,16],[11,20],[11,21],[12,0],[12,1],[12,10],[12,14],[12,16],[12,17],[12,22],[12,24],[13,10],[13,16],[13,24],[14,17],[14,21],[15,18],[15,19]]

  // add all the x's to a new array
  x = [];

  for (i=0; i < a.length; i++) {
    x.push(a[i][0]);
  }

  // add all the y's to a new array
  y = [];

  for (i=0; i < a.length; i++) {
    y.push(a[i][1]);
  }
  
  minX = Math.min.apply(Math, x);
  minY = Math.min.apply(Math, y);

  $('body').append('[');

  // set the new array
  for (i=0; i < a.length; i++) {
    a[i][0] = x[i] - minX;
    a[i][1] = y[i] - minY;
    
    $('body').append('[' + a[i][0] + ',' + a[i][1] + '],');
  }

  $('body').append(']');
}
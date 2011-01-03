$(function(){
  max();
  normalize();
});

a = patterns[6].data;

// normalize an array of coordinates to 0,0
function max(){
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
  
  maxX = Math.max.apply(Math, x) + 1;
  maxY = Math.max.apply(Math, y) + 1;

  $('body').append('width: ' + maxX + '<br>height: ' + maxY + '<br>');
}

// normalize an array of coordinates to 0,0
function normalize(){
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
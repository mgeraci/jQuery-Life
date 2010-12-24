var width = 50;
var height = 50;
var length = width * height;
var cellSize = 7;
var liveCount;
var state = [];

$(function(){
  // toggle();
  setContainer();
  makeGrid();
  render();
  // randomize();
  // createNext();
});

// swap step
function toggle(){
  $('#status').click(function(){
    if ($(this).html() == 'stop'){
      $(this).html('start');
    } else {
      $(this).html('stop');
    }
    $(this).toggleClass('active');
    
    createNext();
    
    return false;
  });
}

function setContainer(){
  $('#container').css({'width': width * cellSize, 'height': height * cellSize});
}

function makeGrid(){
  ih = 0;
  
  while (ih < height) {
    state[ih] = [];
  
    iw = 0;
  
    while (iw < width) {
      state[ih][iw] = Math.floor(Math.random() * 2)
  
      iw++;
    }
    ih++;
  }
  
  // print the hash
  // $('body').append(prettyPrint(state));
}

function render(){
  for (var i in state) {
    for (var val in state[i]) {
      $('#container').append('<div style="width: ' + cellSize + 'px; height: ' + cellSize + 'px;" class="cell' + state[i][val] + '"></div>');
    }
  }
}

function randomize(){
  $('#container div').each(function(){
    $(this).attr('class', 'cell' + Math.floor(Math.random() * 2));
  });
}

function createNext(){
  // zero out array for results
  nextStep = [];

  // for each cell, add whether it will live or die into the array
  $('#container div').each(function(){
    getSurroundings($(this).attr('id'));
  });

  // for each in the array, set the cell's class
  $.each(nextStep, function(index, value){
    $('#container div:eq(' + index + ')').attr('class', 'cell' + value);
  });

  // if the toggle is active, run again
  if ($('#status').hasClass('active')) {
    // pause for a ms to keep browser from freezing up
    setTimeout("createNext();", 1);
  }
}

// for each surrounding cell, increment liveCount, then push that into the array
function getSurroundings(id){
  thisClass = parseInt($('#' + id).attr('class').replace(/cell/, ''), 10);
  liveCount = 0;

  split = id.split('-');
  x = parseInt(split[0], 10);
  y = parseInt(split[1], 10);

  // next
  if (x + 1 >= width) {
    getVal($('#' + (width - 1 - x) + '-' + y));
  } else {
    getVal($('#' + (x + 1) + '-' + y));
  }
  
  // previous
  if (x <= 0) {
    getVal($('#' + (width - 1 - x) + '-' + y));
  } else {
    getVal($('#' + (x - 1) + '-' + y));
  }

  // above
  if (y - 1 < 0) {
    aboveY = height - 1;
  } else {
    aboveY = y - 1;
  }
  
  getVal($('#' + x + '-' + aboveY));

  // above left
  if (x <= 0) {
    getVal($('#' + (width - 1 - x) + '-' + aboveY));
  } else {
    getVal($('#' + (x - 1) + '-' + aboveY));
  }

  // above right
  if (x + 1 >= width) {
    getVal($('#' + (width - 1 - x) + '-' + aboveY));
  } else {
    getVal($('#' + (x + 1) + '-' + aboveY));
  }

  // below
  if (y + 1 == height) {
    belowY = 0
  } else {
    belowY = y + 1;
  }
  
  getVal($('#' + x + '-' + belowY));

  // below left
  if (x <= 0) {
    getVal($('#' + (width - 1 - x) + '-' + belowY));
  } else {
    getVal($('#' + (x - 1) + '-' + belowY));
  }

  // below right
  if (x + 1 >= width) {
    getVal($('#' + (width - 1 - x) + '-' + belowY));
  } else {
    getVal($('#' + (x + 1) + '-' + belowY));
  }
  
  nextStep.push(logic(thisClass, liveCount));
}

// increment the live count for the cell
function getVal(obj){
  liveCount += parseInt(obj.attr('class').replace(/cell/, ''), 10);
}

// should this cell live or die?
function logic(thisClass, liveCount) {
  if (thisClass == 0) {
    if (liveCount == 3) {
      return 1;
    } else {
      return 0;
    }
  } else {
    if (liveCount < 2) {
      return 0;
    }

    if (liveCount == 2 || liveCount == 3) {
      return 1;
    }

    if (liveCount > 3) {
      return 0;
    }
  }
}
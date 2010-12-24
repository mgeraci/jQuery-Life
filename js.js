var width = 50;
var height = 50;
var length = width * height;
var cellSize = 7;
var liveCount;
var initial = true;
var state = [];
var newStat = [];

$(function(){
  toggle();
  setContainer();
  makeGrid();
  render(state);
  createNext();
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

// sizes the container
function setContainer(){
  $('#container').css({'width': width * cellSize, 'height': height * cellSize});
}

// creates nested array structure filled randomly
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

// loop through the array and display it
function render(lifeArray){
  // master count - incremented for each cell
  count = 0;

  for (var x = 0; x < lifeArray.length; x++) {
    for (var y = 0; y < lifeArray[x].length; y++) {
      if (initial) {
        $('#container').append('<div style="width: ' + cellSize + 'px; height: ' + cellSize + 'px;" class="cell' + lifeArray[x][y] + '"></div>');
      } else {
        $('#container div:eq(' + count + ')').attr('class', 'cell' + lifeArray[x][y]);
      }

      count++;
    }
  }

  // turn off the initial flag so the divs don't get added next time
  initial = false;
}

function createNext(){
  // zero out array for results
  newState = [];

  // for each cell, add whether it will live or die into the array
  for (var x = 0; x < state.length; x++) {
    // add an array for this row
    newState[x] = [];
    for (var y = 0; y < state[x].length; y++) {
      newState[x][y] = logic(state[x][y], getSurroundings(x, y, state[x][y]));
    }
  }

  // print the hash
  // $('body').append(prettyPrint(newState));

  state = newState;

  // render the new state
  render(state);

  // if the toggle is active, run again
  if ($('#status').hasClass('active')) {
    // pause for a ms to keep browser from freezing up
    setTimeout("createNext();", 1);
  }
}

// for each surrounding cell, increment liveCount, then push that into the array
function getSurroundings(x, y, value){
  liveCount = 0;

  // next
  if (x + 1 >= width) {
    next = width - 1 - x;
  } else {
    next = x + 1;
  }

  liveCount += state[next][y];
  
  // previous
  if (x <= 0) {
    prev = width - 1 - x;
  } else {
    prev = x - 1;
  }

  liveCount += state[prev][y];

  // above
  if (y - 1 < 0) {
    aboveY = height - 1;
  } else {
    aboveY = y - 1;
  }

  liveCount += state[x][aboveY];

  // above left
  liveCount += state[prev][aboveY];

  // above right
  liveCount += state[next][aboveY];

  // below
  if (y + 1 == height) {
    belowY = 0
  } else {
    belowY = y + 1;
  }

  liveCount += state[x][belowY];

  // below left
  liveCount += state[prev][belowY];

  // below right
  liveCount += state[next][belowY];
  
  return liveCount;
}

// should this cell live or die?
function logic(current, liveCount) {
  if (current == 0) {
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
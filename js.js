var width = 80;// number of cells
var height = 80;// number of cells
var cellSize = 6;// size of each cell
var liveCount;// numer of cells alive around a cell, used in logic
var state = [];// holds the state of the game
var timer;// a settimeout for ticking to the next generation
var speed = 80;// speed in ms for the settimeout

// run these functions on load
$(function(){
  buttons();
  randomize();// initial randomization
  render(state);// initial render
});

// control the running of the game
function buttons(){
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
  
  $('#reset').click(function(){
    $('#status').removeClass('active').html('start');

    clearTimeout(timer);// stop the current iteration
    randomize();// randomize a new grid
    render(state);// render the new grid
  });
}

// creates nested array structure filled randomly
function randomize(){
  // height count
  ih = 0;
  
  // iterate through the heights
  while (ih < height) {
    // create a subarray for this row
    state[ih] = [];

    // width count (set to zero in each row)
    iw = 0;

    // iterate through the widths
    while (iw < width) {
      // random 0 or 1
      ran = Math.floor(Math.random() * 2);

      // if 1, set in state array
      // (ran == 1) ? state[ih][iw] = 1 : '';

      iw++;
    }
    ih++;
  }

  // make a glider to test wrapping
  state[20][20] = 1;
  state[20][21] = 1;
  state[20][22] = 1;
  state[19][22] = 1;
  state[18][21] = 1;
}

// loop through the array and display it
function render(lifeArray){
  // get the canvas (the html element, and set the 2-dimensional context)
  var c = $('#container');
  var canvas = c[0].getContext('2d');

  // set the canvas size
  c.width(width * cellSize);
  c.height(height * cellSize);

  // clear the canvas
  canvas.clearRect(0, 0, width * cellSize, height * cellSize);

  // height count
  ih = 0;

  // iterate through the heights
  while (ih < height) {
    // width count (set to zero in each row)
    iw = 0;

    // iterate through the widths
    while (iw < width) {
      // set the value
      if (lifeArray[ih][iw]) {
        canvas.fillRect(iw * cellSize, ih * cellSize, cellSize, cellSize);
      }

      iw++;
    }

    ih++;
  }
}

function createNext(){
  // zero out array for results
  newState = [];

  // height count
  ih = 0;
  
  // iterate through the heights
  while (ih < height) {
    // create a subarray for this row
    newState[ih] = [];
  
    // width count (set to zero in each row)
    iw = 0;
  
    // iterate through the widths
    while (iw < width) {
      newState[ih][iw] = logic(state[ih][iw], getSurroundings(ih, iw, state[ih][iw]));

      iw++;
    }
    ih++;
  }

  // print the hash
  // $('body').append(prettyPrint(newState));

  state = newState;

  // render the new state
  render(state);

  // if the toggle is active, run again
  if ($('#status').hasClass('active')) {
    // pause for a ms to keep browser from freezing up
    timer = setTimeout("createNext();", speed);
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

  if (state[next][y]) {
    liveCount += 1;
  }

  // previous
  if (x <= 0) {
    prev = width - 1 - x;
  } else {
    prev = x - 1;
  }

  if (state[prev][y]) {
    liveCount += 1;
  }

  // above
  if (y - 1 < 0) {
    aboveY = height - 1;
  } else {
    aboveY = y - 1;
  }

  if (state[x][aboveY]) {
    liveCount += 1;
  }

  // above left
  if (state[prev][aboveY]) {
    liveCount += 1;
  }

  // above right
  if (state[next][aboveY]) {
    liveCount += 1;
  }

  // below
  if (y + 1 == height) {
    belowY = 0
  } else {
    belowY = y + 1;
  }

  if (state[x][belowY]) {
    liveCount += 1;
  }

  // below left
  if (state[prev][belowY]) {
    liveCount += 1;
  }

  // below right
  if (state[next][belowY]) {
    liveCount += 1;
  }
  
  return liveCount;
}

// should this cell live or die?
function logic(current, liveCount) {
  if (current == 1) {
    if (liveCount < 2) {
      return 0;
    }

    if (liveCount == 2 || liveCount == 3) {
      return 1;
    }

    if (liveCount > 3) {
      return 0;
    }
  } else {
    if (liveCount == 3) {
      return 1;
    } else {
      return 0;
    }
  }
}
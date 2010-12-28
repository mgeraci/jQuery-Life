var width = 50;
var height = 50;
var length = width * height;
var cellSize = 7;
var liveCount;
var initial = true;
var state = [];

// run these functions on load
$(function(){
  toggle();
  setContainer();
  makeGrid();
  render(state);
});

// control the running of the game
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
      (ran == 1) ? state[ih][iw] = 1 : '';

      iw++;
    }
    ih++;
  }

// create a test glider
// state[10][10] = 1;
// state[11][11] = 1;
// state[12][9] = 1;
// state[12][10] = 1;
// state[12][11] = 1;

  // print the hash
  // $('body').append('<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>').append(prettyPrint(state));
}

// loop through the array and display it
function render(lifeArray){
  // master count - incremented for each cell
  count = 0;

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
        cell = '1';
      } else {
        cell = '0';
      }

      if (initial) {
        $('#container').append('<div id="' + count + '" style="width: ' + cellSize + 'px; height: ' + cellSize + 'px;" class="cell' + cell + '"></div>');
      } else {
        $('#' + count).attr('class', 'cell' + cell);
      }

      count++;
      iw++;
    }

    ih++;
  }

  // turn off the initial flag so the divs don't get added next time
  initial = false;
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
// global variables
var width = 100;// number of cells
var height = 80;// number of cells
var cellSize = 6;// size of each cell
var state = [];// holds the state of the game
var speed = 70;// speed in ms for the settimeout
var liveCount, timer, c, canvas, tool;// number of cells alive around a cell, settimeout for ticking to the next generation, the container, the canvas context, drawing or erasing

// coordinate variables
mvX = 0;
mvY = 0;
lastX = 0;
lastY = 0;

// run these functions on load
$(function(){
  buttons();
  randomize();// initial randomization
  render(state);// initial render
  drawHandler();
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
    // stop and reset button
    stopGame();

    randomize();// randomize a new grid
    render(state);// render the new grid
  });

  $('#clear').click(function(){
    stopGame();

    // remove everything from the canvas
    canvas.clearRect(0, 0, width * cellSize, height * cellSize);

    // make the grid
    makeGrid();

    // remove everything from state
    for (i = 0; i < height; i++){
      state[i] = [];
    }
  });

  $('#bounce').click(function(){
    $('body').append('[');
    ih = 0;

    // iterate through the heights
    while (ih < height) {
      // width count (set to zero in each row)
      iw = 0;

      // iterate through the widths
      while (iw < width) {
        if (state[ih][iw]) {
          $('body').append('[' + ih + ',' + iw + '],');
        }

        iw++;
      }
      ih++;
    }
    $('body').append(']');
  });
}

// stop the game
function stopGame(){
  $('#status').removeClass('active').html('start');
  $('#count').html(0);
  clearTimeout(timer);// stop the current iteration
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
      (ran == 1) ? state[ih][iw] = 1 : '';

      iw++;
    }
    ih++;
  }
}

// makes a background grid
function makeGrid(){
  // get the grid canvas
  grid = $('#grid');
  cGrid = grid[0].getContext('2d');

  grid[0].width = width * cellSize;
  grid[0].height = height * cellSize;

  // vertical lines
  for (var x = 0.5; x < width * cellSize; x += cellSize) {
    cGrid.moveTo(x, 0);
    cGrid.lineTo(x, height * cellSize);
  }

  // horizontal lines
  for (var y = 0.5; y < height * cellSize; y += cellSize) {
    cGrid.moveTo(0, y);
    cGrid.lineTo(width * cellSize, y);
  }

  cGrid.strokeStyle = "#ccc";
  cGrid.stroke();
}

// loop through the array and display it
function render(lifeArray){
  // get the drawing canvas (the html element, and set the 2-dimensional context)
  c = $('#container');
  canvas = c[0].getContext('2d');

  // size the two canvases
  c[0].width = width * cellSize;
  c[0].height = height * cellSize;

  // clear the canvas
  canvas.clearRect(0, 0, width * cellSize, height * cellSize);

  makeGrid();

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
      newState[ih][iw] = logic(state[ih][iw], getSurroundings(ih, iw));

      iw++;
    }
    ih++;
  }

  // print the hash
  // $('body').append(prettyPrint(newState));

  state = newState;

  // render the new state
  render(state);

  // increment the generation count
  $('#count').html(parseInt($('#count').html(), 10) + 1);

  // if the toggle is active, run again
  if ($('#status').hasClass('active')) {
    // pause for a set time to keep the speed in check
    timer = setTimeout("createNext();", speed);
  }
}

// for each surrounding cell, increment liveCount, then push that into the array
function getSurroundings(y, x){
  liveCount = 0;

  // next
  if (x + 1 >= width) {
    next = width - 1 - x;
  } else {
    next = x + 1;
  }

  if (state[y][next]) {
    liveCount += 1;
  }

  // previous
  if (x <= 0) {
    prev = width - 1 - x;
  } else {
    prev = x - 1;
  }

  if (state[y][prev]) {
    liveCount += 1;
  }

  // above
  if (y - 1 < 0) {
    aboveY = height - 1;
  } else {
    aboveY = y - 1;
  }

  if (state[aboveY][x]) {
    liveCount += 1;
  }
  
  // above left
  if (state[aboveY][prev]) {
    liveCount += 1;
  }
  
  // above right
  if (state[aboveY][next]) {
    liveCount += 1;
  }
  
  // below
  if (y + 1 == height) {
    belowY = 0
  } else {
    belowY = y + 1;
  }
  
  if (state[belowY][x]) {
    liveCount += 1;
  }
  
  // below left
  if (state[belowY][prev]) {
    liveCount += 1;
  }
  
  // below right
  if (state[belowY][next]) {
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

function drawHandler(){
  // are we currently dragging?
  clicked = false;

  // get the offset of the canvas element
  cOff = c.offset();

  // on mousemove check coordinates
  c.mousemove(function(e){
    checkCoords(e);
  });

  // on mousedown, check coordinates and set a clicked flag
  $('body').mousedown(function(ev){
    clicked = true;

    // get the initial coordinate
    getCoords(ev);

    // if it's within the range
    if (mvX < width && mvY < height && mvX > 0 && mvY > 0) {
      draw(mvX, mvY);
    }
  }).mouseup(function(){
    clicked = false;
  });
}

function checkCoords(ev){
  // get the current coordinates in the canvas
  getCoords(ev);

  // if it's within the range and different from the last coordinate
  if ( (mvX < width && mvY < height) && (mvX != lastX || mvY != lastY) ) {
    // set the "last" variables to the current
    lastX = mvX;
    lastY = mvY;

    if (clicked) {
      draw(mvX, mvY);
    }
  }
}

function getCoords(ev){
  mvX = Math.floor((ev.pageX - cOff.left) / cellSize);
  mvY = Math.floor((ev.pageY - cOff.top) / cellSize);
}

function draw(x, y){
  // set the current tool
  tool = $('input[name=tool]:checked').val();

  if (tool == 'draw') {
    // fill the current cell
    canvas.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

    // set it as filled in the state
    state[y][x] = 1;
  } else if (tool == 'erase') {
    // clear the current cell
    canvas.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);

    // set it as empty in the state
    delete state[y][x];
  }
}
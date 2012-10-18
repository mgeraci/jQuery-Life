# global variables
width = 150 # number of cells
height = 100 # number of cells
cellSize = 6 # size of each cell
cWidth = width * cellSize
cHeight = height * cellSize
state = [] # holds the state of the game
newState = [] # holds the state of the next generation
timer = ''
speed = 70 # speed in ms for the settimeout
liveCount = 0 # number of cells alive around a cell
clicked = false # are we currently clicking?
tool = '' # drawing or erasing
c = '' # the container
cOff = '' # offset of canvas element
canvas = '' # the canvas context
background = '#E4DD98'
gridColor = '#9B9365'
cell = '#383302'

# coordinate variables
mvX = 0
mvY = 0
lastX = 0
lastY = 0

# if the user's browser is not supported, display the upgrade message
badBrowser = ->
  isBad = false

  # ie
  isBad = true if $.browser.msie && $.browser.version.substr(0, 1) < '9'

  $('body').prepend('<div id="badBrowser" class="wrapWrap"><div class="wrap">Your browser is not supported, so jQuery Life will not work.<br>Please visit using Chrome or Firefox.<br><br><a href="http:#www.mozilla.com/en-US/firefox/firefox.html">Mozilla Firefox</a>&nbsp;|&nbsp;<a href="http:#www.google.com/chrome">Google Chrome</a></div></div>') if isBad

# control the running of the game
buttons = ->
  $('#status').click ->
    # current state is playing, pause
    if $(this).children('span').html() == 'pause'
      clearTimeout(timer)
      $(this).children('span').html('play')
    else
      $(this).children('span').html('pause')

    $(this).children('span').toggleClass('active')

    createNext()

    return false

  $('#reset').click ->
    # stop and reset button
    stopGame()

    # randomize a new grid
    randomize()

    # render the new grid
    render()

    # set the select to "load a pattern"
    $('#pattern').val('0')

    # change the selectmenu text to "load a pattern"
    $('.ui-selectmenu-status').text('load a pattern')

    # set all the dropdown's aria-selected to false
    $('.ui-selectmenu-menu').find('li').removeClass('ui-selectmenu-item-selected').removeClass('ui-state-active').removeClass('ui-selectmenu-item-focus').removeClass('ui-state-hover').find('a').attr('aria-selected', 'false')

    # set "load a pattern"'s aria-selected to true
    $('.ui-selectmenu-menu').find('li:eq(0)').addClass('ui-selectmenu-item-selected').addClass('ui-state-active').find('a').attr('aria-selected', 'true')

    return false

  $('#clear').click ->
    # stop and reset button
    stopGame()

    # remove everything from the canvas
    canvas.clearRect(0, 0, cWidth, cHeight)

    # make the grid
    makeGrid()

    # remove everything from state
    for i in [0..height]
      state[i] = []

    return false

# stop the game
stopGame = ->
  clearTimeout(timer) # stop the current iteration
  $('#status').children('span').removeClass('active').html('play')
  $('#count').html(0)

# populate patterns, handle pattern loading
patternsFunc = ->
  # populate the patters dropdown
  for i, pat of patterns
    $('#pattern').append('<option value="' + i + '">' + patterns[i].name + '</option>')

  # turn the dropdown into the fancy menu
  $('#pattern').selectmenu()

  # load up patterns on select change
  $('#pattern').change ->
    # if it's not pattern 0 (load a pattern)
    if $(this).val() > 0
      # stop and reset
      stopGame()

      # get the selected pattern object
      pattern = patterns[$(this).val()]

      # clear the state
      state = []

      # get the offset for centering
      offW = Math.round(width / 2 - pattern.width / 2)
      offH = Math.round(height / 2 - pattern.height / 2)

      # for each coordinate in the pattern's dataset
      $.each(pattern.data, (index, value) ->
        # set the values with offset
        x = value[0] + offH
        y = value[1] + offW

        # create a subarray for the row if it doesn't exist
        state[x] = [] if !state[x]

        # set the active value to 1
        state[x][y] = 1
      )

      # iterate through the heights and add any missing arrays (render breaks on empty lines)
      for ih in [0..height]
        state[ih] = [] if (!state[ih])

      # render the pattern
      render()

# creates nested array structure filled randomly
randomize = ->
  # iterate through the heights
  for ih in [0..height]
    # create a subarray for this row
    state[ih] = []

    # iterate through the widths
    for iw in [0..width]
      # random 0 or 1
      ran = Math.floor(Math.random() * 2)

      # if 1, set in state array
      state[ih][iw] = 1 if ran == 1

# makes a background grid
makeGrid = ->
  # get the grid canvas
  grid = $('#grid')
  cGrid = grid[0].getContext('2d')

  # set the canvas size
  grid[0].width = cWidth
  grid[0].height = cHeight

  # set the canvas wrapper size
  $('#canvases').css({'width': cWidth, 'height': cHeight})

  # fill the background color
  cGrid.fillStyle = background
  cGrid.fillRect(0, 0, cWidth, cHeight)

  # vertical lines
  x = 0.5
  while x < cWidth
    cGrid.moveTo(x, 0)
    cGrid.lineTo(x, cHeight)
    x += cellSize

  # horizontal lines
  y = 0.5
  while y < cHeight
    cGrid.moveTo(0, y)
    cGrid.lineTo(cWidth, y)
    y += cellSize

  cGrid.strokeStyle = gridColor
  cGrid.stroke()

# loop through the array and display it
render = ->
  # get the drawing canvas (the html element, and set the 2-dimensional context)
  c = $('#container')
  canvas = c[0].getContext('2d')

  # size the canvas
  c[0].width = cWidth
  c[0].height = cHeight

  # clear the canvas
  canvas.clearRect(0, 0, cWidth, cHeight)

  # set the fillstyle
  canvas.fillStyle = cell

  # create the grid
  makeGrid()

  # iterate through the heights
  for ih in [0..height]
    # iterate through the widths
    for iw in [0..width]
      # set the value
      canvas.fillRect(iw * cellSize, ih * cellSize, cellSize, cellSize) if state[ih][iw]

# make and render the next generation
createNext = ->
  # zero out array for results
  newState = []

  # iterate through the heights
  for ih in [0..height]
    # create a subarray for this row
    newState[ih] = []

    # iterate through the widths
    for iw in [0..width]
      newState[ih][iw] = 1 if survives(state[ih][iw], getLiveNeighbors(ih, iw))

  state = newState

  # render the new state
  render()

  # increment the generation count
  $('#count').html(commaFormat(parseInt($('#count').text().replace(/,/g, ''), 10) + 1))

  # if the toggle is active, run again
  if $('#status span').hasClass('active')
    # delay before the next generation
    timer = setTimeout('createNext()', speed)


# for each surrounding cell, increment liveCount, then push that into the array
getLiveNeighbors = (y, x)->
  liveCount = 0

  # get the next, previous, above, and below cells
  # (looping if out of bounds)
  next = (x + 1) % width
  prev = (x - 1 + width) % width
  above = (y - 1 + height) % height
  below = (y + 1) % height

  liveCount += 1 if state[y]? && state[y][next]? # next
  liveCount += 1 if state[y]? && state[y][prev]? # previous
  liveCount += 1 if state[above]? && state[above][x]? # above
  liveCount += 1 if state[above]? && state[above][prev]? # above left
  liveCount += 1 if state[above]? && state[above][next]? # above right
  liveCount += 1 if state[below]? && state[below][x]? # below
  liveCount += 1 if state[below]? && state[below][prev]? # below left
  liveCount += 1 if state[below]? && state[below][next]? # below right

  liveCount

# should this cell live or die?
survives = (current, liveCount) ->
  if current == 1
    return false if liveCount < 2
    return true if liveCount == 2 || liveCount == 3
    return false if liveCount > 3
  else
    liveCount == 3

# the main handler for drawing/erasing
drawHandler = ->
  # are we currently dragging?
  clicked = false

  # get the offset of the canvas element
  cOff = c.offset()

  # on mousedown, check coordinates and set a clicked flag
  $('body').mousedown((ev) ->
    clicked = true

    # get the initial coordinate
    getCoords(ev)

    # if it's within the range
    if mvX < width && mvY < height && mvX > 0 && mvY > 0
      # set the tool to match what you just clicked on
      # ie - if you clicked on a blank, you want to start drawing
      if state[mvY][mvX]
        tool = 'erase'
      else
        tool = 'draw'

      draw(mvX, mvY)
  ).mouseup( ->
    clicked = false
  )

  # on mousemove check coordinates
  c.mousemove (e) ->
    checkCoords(e)

# sees if the current coordinates are on the canvas
checkCoords = (e) ->
  # get the current coordinates in the canvas
  getCoords(e)

  # if it's within the range and different from the last coordinate
  if  (mvX < width && mvY < height) && (mvX != lastX || mvY != lastY)
    # set the "last" variables to the current
    lastX = mvX
    lastY = mvY

    draw(mvX, mvY) if clicked

# convert mouse position to cell number
getCoords = (ev) ->
  mvX = Math.floor((ev.pageX - cOff.left) / cellSize)
  mvY = Math.floor((ev.pageY - cOff.top) / cellSize)

draw = (x, y) ->
  if tool == 'draw'
    # fill the current cell
    canvas.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)

    # set it as filled in the state
    state[y][x] = 1
  else if tool == 'erase'
    # clear the current cell
    canvas.clearRect(x * cellSize, y * cellSize, cellSize, cellSize)

    # set it as empty in the state
    delete state[y][x]

# add a comma in a number for each thousand
commaFormat = (nStr) ->
  nStr += ''
  x = nStr.split('.')
  x1 = x[0]
  if x.length > 1
    x2 = '.' + x[1]
  else
    x2 = ''
  rgx = /(\d+)(\d{3})/
  while rgx.test(x1)
    x1 = x1.replace(rgx, '$1' + ',' + '$2')

  return x1 + x2


# run these functions on load
$( ->
  badBrowser()
  buttons()
  patternsFunc()
  randomize() # initial randomization
  render() # initial render
  drawHandler()
)

# bring the createNext method into the global scope for the timeout
this.createNext = createNext

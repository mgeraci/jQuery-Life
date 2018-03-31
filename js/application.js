// Generated by CoffeeScript 1.3.3
(function() {
  var background, badBrowser, buttons, c, cHeight, cOff, cWidth, canvas, cell, cellSize, checkCoords, commaFormat, convertCoords, createNext, draw, drawHandler, getLiveNeighbors, gridColor, height, lastX, lastY, liveCount, makeGrid, mvX, mvY, newState, patternsFunc, randomize, render, speed, state, stopGame, survives, timer, tool, width;

  width = 150;

  height = 100;

  cellSize = 6;

  cWidth = width * cellSize;

  cHeight = height * cellSize;

  state = [];

  newState = [];

  timer = '';

  speed = 70;

  liveCount = 0;

  tool = '';

  c = '';

  cOff = '';

  canvas = '';

  background = '#E4DD98';

  gridColor = '#9B9365';

  cell = '#383302';

  mvX = 0;

  mvY = 0;

  lastX = 0;

  lastY = 0;

  $(function() {
    randomize();
    render();
    buttons();
    patternsFunc();
    drawHandler();
    return badBrowser();
  });

  buttons = function() {
    $('#status').click(function() {
      if ($(this).children('span').html() === 'pause') {
        clearTimeout(timer);
        $(this).children('span').html('play');
      } else {
        $(this).children('span').html('pause');
      }
      $(this).children('span').toggleClass('active');
      createNext();
      return false;
    });
    $('#reset').click(function() {
      stopGame();
      randomize();
      render();
      $('#pattern').val('0');
      $('.ui-selectmenu-status').text('load a pattern');
      $('.ui-selectmenu-menu').find('li').removeClass('ui-selectmenu-item-selected').removeClass('ui-state-active').removeClass('ui-selectmenu-item-focus').removeClass('ui-state-hover').find('a').attr('aria-selected', 'false');
      $('.ui-selectmenu-menu').find('li:eq(0)').addClass('ui-selectmenu-item-selected').addClass('ui-state-active').find('a').attr('aria-selected', 'true');
      return false;
    });
    return $('#clear').click(function() {
      var i, _i;
      stopGame();
      canvas.clearRect(0, 0, cWidth, cHeight);
      makeGrid();
      for (i = _i = 0; 0 <= height ? _i <= height : _i >= height; i = 0 <= height ? ++_i : --_i) {
        state[i] = [];
      }
      return false;
    });
  };

  stopGame = function() {
    clearTimeout(timer);
    $('#status').children('span').removeClass('active').html('play');
    return $('#count').html(0);
  };

  patternsFunc = function() {
    var i, pat;
    for (i in patterns) {
      pat = patterns[i];
      $('#pattern').append('<option value="' + i + '">' + patterns[i].name + '</option>');
    }
    $('#pattern').selectmenu();
    return $('#pattern').change(function() {
      var ih, offH, offW, pattern, _i;
      if ($(this).val() > 0) {
        stopGame();
        pattern = patterns[$(this).val()];
        state = [];
        offW = Math.round(width / 2 - pattern.width / 2);
        offH = Math.round(height / 2 - pattern.height / 2);
        $.each(pattern.data, function(index, value) {
          var x, y;
          x = value[0] + offH;
          y = value[1] + offW;
          if (!state[x]) {
            state[x] = [];
          }
          return state[x][y] = 1;
        });
        for (ih = _i = 0; 0 <= height ? _i <= height : _i >= height; ih = 0 <= height ? ++_i : --_i) {
          if (!state[ih]) {
            state[ih] = [];
          }
        }
        return render();
      }
    });
  };

  randomize = function() {
    var ih, iw, ran, _i, _results;
    _results = [];
    for (ih = _i = 0; 0 <= height ? _i <= height : _i >= height; ih = 0 <= height ? ++_i : --_i) {
      state[ih] = [];
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (iw = _j = 0; 0 <= width ? _j <= width : _j >= width; iw = 0 <= width ? ++_j : --_j) {
          ran = Math.floor(Math.random() * 2);
          if (ran === 1) {
            _results1.push(state[ih][iw] = 1);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  makeGrid = function() {
    var cGrid, grid, x, y;
    grid = $('#grid');
    cGrid = grid[0].getContext('2d');
    grid[0].width = cWidth;
    grid[0].height = cHeight;
    $('#canvases').css({
      'width': cWidth,
      'height': cHeight
    });
    cGrid.fillStyle = background;
    cGrid.fillRect(0, 0, cWidth, cHeight);
    x = 0.5;
    while (x < cWidth) {
      cGrid.moveTo(x, 0);
      cGrid.lineTo(x, cHeight);
      x += cellSize;
    }
    y = 0.5;
    while (y < cHeight) {
      cGrid.moveTo(0, y);
      cGrid.lineTo(cWidth, y);
      y += cellSize;
    }
    cGrid.strokeStyle = gridColor;
    return cGrid.stroke();
  };

  render = function() {
    var ih, iw, _i, _results;
    c = $('#container');
    canvas = c[0].getContext('2d');
    c[0].width = cWidth;
    c[0].height = cHeight;
    canvas.clearRect(0, 0, cWidth, cHeight);
    canvas.fillStyle = cell;
    makeGrid();
    _results = [];
    for (ih = _i = 0; 0 <= height ? _i <= height : _i >= height; ih = 0 <= height ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (iw = _j = 0; 0 <= width ? _j <= width : _j >= width; iw = 0 <= width ? ++_j : --_j) {
          if (state[ih][iw]) {
            _results1.push(canvas.fillRect(iw * cellSize, ih * cellSize, cellSize, cellSize));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  createNext = function() {
    var ih, iw, _i, _j;
    newState = [];
    for (ih = _i = 0; 0 <= height ? _i <= height : _i >= height; ih = 0 <= height ? ++_i : --_i) {
      newState[ih] = [];
      for (iw = _j = 0; 0 <= width ? _j <= width : _j >= width; iw = 0 <= width ? ++_j : --_j) {
        if (survives(ih, iw)) {
          newState[ih][iw] = 1;
        }
      }
    }
    state = newState;
    render();
    $('#count').html(commaFormat(parseInt($('#count').text().replace(/,/g, ''), 10) + 1));
    if ($('#status span').hasClass('active')) {
      return timer = setTimeout('createNext()', speed);
    }
  };

  getLiveNeighbors = function(y, x) {
    var above, below, next, prev;
    liveCount = 0;
    next = (x + 1) % width;
    prev = (x - 1 + width) % width;
    above = (y - 1 + height) % height;
    below = (y + 1) % height;
    if ((state[y] != null) && (state[y][next] != null)) {
      liveCount += 1;
    }
    if ((state[y] != null) && (state[y][prev] != null)) {
      liveCount += 1;
    }
    if ((state[above] != null) && (state[above][x] != null)) {
      liveCount += 1;
    }
    if ((state[above] != null) && (state[above][prev] != null)) {
      liveCount += 1;
    }
    if ((state[above] != null) && (state[above][next] != null)) {
      liveCount += 1;
    }
    if ((state[below] != null) && (state[below][x] != null)) {
      liveCount += 1;
    }
    if ((state[below] != null) && (state[below][prev] != null)) {
      liveCount += 1;
    }
    if ((state[below] != null) && (state[below][next] != null)) {
      liveCount += 1;
    }
    return liveCount;
  };

  survives = function(y, x) {
    liveCount = getLiveNeighbors(y, x);
    if (state[y][x] === 1) {
      if (liveCount < 2) {
        return false;
      }
      if (liveCount === 2 || liveCount === 3) {
        return true;
      }
      if (liveCount > 3) {
        return false;
      }
    } else {
      return liveCount === 3;
    }
  };

  drawHandler = function() {
    var clicked;
    clicked = false;
    cOff = c.offset();
    c.mousedown(function(e) {
      clicked = true;
      convertCoords(e);
      if (mvX < width && mvY < height && mvX > 0 && mvY > 0) {
        tool = state[mvY][mvX] ? 'erase' : 'draw';
        return draw(mvX, mvY);
      }
    }).mouseup(function() {
      return clicked = false;
    });
    return c.mousemove(function(e) {
      if (clicked) {
        return checkCoords(e);
      }
    });
  };

  checkCoords = function(e) {
    convertCoords(e);
    if ((mvX < width && mvY < height) && (mvX !== lastX || mvY !== lastY)) {
      lastX = mvX;
      lastY = mvY;
      return draw(mvX, mvY);
    }
  };

  convertCoords = function(e) {
    mvX = Math.floor((e.pageX - cOff.left) / cellSize);
    return mvY = Math.floor((e.pageY - cOff.top) / cellSize);
  };

  draw = function(x, y) {
    if (tool === 'draw') {
      canvas.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      return state[y][x] = 1;
    } else if (tool === 'erase') {
      canvas.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
      return delete state[y][x];
    }
  };

  commaFormat = function(nStr) {
    var rgx, x, x1, x2;
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    if (x.length > 1) {
      x2 = '.' + x[1];
    } else {
      x2 = '';
    }
    rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  };

  badBrowser = function() {
    var isBad;
    isBad = false;
    if ($.browser.msie && $.browser.version.substr(0, 1) < '9') {
      isBad = true;
    }
    if (isBad) {
      return $('body').prepend('<div id="badBrowser" class="wrapWrap"><div class="wrap">Your browser is not supported, so jQuery Life will not work.<br>Please visit using Chrome or Firefox.<br><br><a href="http:#www.mozilla.com/en-US/firefox/firefox.html">Mozilla Firefox</a>&nbsp;|&nbsp;<a href="http:#www.google.com/chrome">Google Chrome</a></div></div>');
    }
  };

  this.createNext = createNext;

}).call(this);

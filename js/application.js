(function() {
  var background, badBrowser, buttons, c, cOff, canvas, cell, cellSize, checkCoords, clicked, commaFormat, createNext, draw, drawHandler, getCoords, getSurroundings, gridColor, height, lastX, lastY, liveCount, logic, makeGrid, mvX, mvY, newState, patternsFunc, randomize, render, speed, state, stopGame, timer, tool, width;
  width = 150;
  height = 100;
  cellSize = 6;
  state = [];
  newState = [];
  timer = '';
  speed = 70;
  liveCount = 0;
  c = '';
  clicked = '';
  cOff = '';
  canvas = '';
  tool = '';
  background = '#E4DD98';
  gridColor = '#9B9365';
  cell = '#383302';
  mvX = 0;
  mvY = 0;
  lastX = 0;
  lastY = 0;
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
      render(state);
      $('#pattern').val('0');
      $('.ui-selectmenu-status').text('load a pattern');
      $('.ui-selectmenu-menu').find('li').removeClass('ui-selectmenu-item-selected').removeClass('ui-state-active').removeClass('ui-selectmenu-item-focus').removeClass('ui-state-hover').find('a').attr('aria-selected', 'false');
      $('.ui-selectmenu-menu').find('li:eq(0)').addClass('ui-selectmenu-item-selected').addClass('ui-state-active').find('a').attr('aria-selected', 'true');
      return false;
    });
    return $('#clear').click(function() {
      var i;
      stopGame();
      canvas.clearRect(0, 0, width * cellSize, height * cellSize);
      makeGrid();
      for (i = 0; (0 <= height ? i <= height : i >= height); (0 <= height ? i += 1 : i -= 1)) {
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
      var ih, offH, offW, pattern;
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
        for (ih = 0; (0 <= height ? ih <= height : ih >= height); (0 <= height ? ih += 1 : ih -= 1)) {
          if (!state[ih]) {
            state[ih] = [];
          }
        }
        return render(state);
      }
    });
  };
  randomize = function() {
    var ih, iw, ran, _results;
    _results = [];
    for (ih = 0; (0 <= height ? ih <= height : ih >= height); (0 <= height ? ih += 1 : ih -= 1)) {
      state[ih] = [];
      _results.push((function() {
        var _results;
        _results = [];
        for (iw = 0; (0 <= width ? iw <= width : iw >= width); (0 <= width ? iw += 1 : iw -= 1)) {
          ran = Math.floor(Math.random() * 2);
          _results.push(ran === 1 ? state[ih][iw] = 1 : void 0);
        }
        return _results;
      })());
    }
    return _results;
  };
  makeGrid = function() {
    var cGrid, grid, x, y;
    grid = $('#grid');
    cGrid = grid[0].getContext('2d');
    grid[0].width = width * cellSize;
    grid[0].height = height * cellSize;
    $('#canvases').css({
      'width': width * cellSize,
      'height': height * cellSize
    });
    cGrid.fillStyle = background;
    cGrid.fillRect(0, 0, width * cellSize, height * cellSize);
    x = 0.5;
    while (x < width * cellSize) {
      cGrid.moveTo(x, 0);
      cGrid.lineTo(x, height * cellSize);
      x += cellSize;
    }
    y = 0.5;
    while (y < height * cellSize) {
      cGrid.moveTo(0, y);
      cGrid.lineTo(width * cellSize, y);
      y += cellSize;
    }
    cGrid.strokeStyle = gridColor;
    return cGrid.stroke();
  };
  render = function(lifeArray) {
    var ih, iw, _results;
    c = $('#container');
    canvas = c[0].getContext('2d');
    c[0].width = width * cellSize;
    c[0].height = height * cellSize;
    canvas.clearRect(0, 0, width * cellSize, height * cellSize);
    canvas.fillStyle = cell;
    makeGrid();
    _results = [];
    for (ih = 0; (0 <= height ? ih <= height : ih >= height); (0 <= height ? ih += 1 : ih -= 1)) {
      _results.push((function() {
        var _results;
        _results = [];
        for (iw = 0; (0 <= width ? iw <= width : iw >= width); (0 <= width ? iw += 1 : iw -= 1)) {
          _results.push(lifeArray[ih][iw] ? canvas.fillRect(iw * cellSize, ih * cellSize, cellSize, cellSize) : void 0);
        }
        return _results;
      })());
    }
    return _results;
  };
  createNext = function() {
    var ih, iw;
    newState = [];
    for (ih = 0; (0 <= height ? ih <= height : ih >= height); (0 <= height ? ih += 1 : ih -= 1)) {
      newState[ih] = [];
      for (iw = 0; (0 <= width ? iw <= width : iw >= width); (0 <= width ? iw += 1 : iw -= 1)) {
        if (logic(state[ih][iw], getSurroundings(ih, iw))) {
          newState[ih][iw] = 1;
        }
      }
    }
    state = newState;
    render(state);
    $('#count').html(commaFormat(parseInt($('#count').text().replace(/,/g, ''), 10) + 1));
    if ($('#status span').hasClass('active')) {
      return timer = setTimeout('createNext()', speed);
    }
  };
  getSurroundings = function(y, x) {
    var aboveY, belowY, next, prev;
    liveCount = 0;
    if (x + 1 >= width) {
      next = width - 1 - x;
    } else {
      next = x + 1;
    }
    if ((state[y] != null) && (state[y][next] != null)) {
      liveCount += 1;
    }
    if (x <= 0) {
      prev = width - 1 - x;
    } else {
      prev = x - 1;
    }
    if ((state[y] != null) && (state[y][prev] != null)) {
      liveCount += 1;
    }
    if (y - 1 < 0) {
      aboveY = height - 1;
    } else {
      aboveY = y - 1;
    }
    if ((state[aboveY] != null) && (state[aboveY][x] != null)) {
      liveCount += 1;
    }
    if ((state[aboveY] != null) && (state[aboveY][prev] != null)) {
      liveCount += 1;
    }
    if ((state[aboveY] != null) && (state[aboveY][next] != null)) {
      liveCount += 1;
    }
    if (y + 1 === height) {
      belowY = 0;
    } else {
      belowY = y + 1;
    }
    if ((state[belowY] != null) && (state[belowY][x] != null)) {
      liveCount += 1;
    }
    if ((state[belowY] != null) && (state[belowY][prev] != null)) {
      liveCount += 1;
    }
    if ((state[belowY] != null) && (state[belowY][next] != null)) {
      liveCount += 1;
    }
    return liveCount;
  };
  logic = function(current, liveCount) {
    if (current === 1) {
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
      if (liveCount === 3) {
        return true;
      } else {
        return false;
      }
    }
  };
  drawHandler = function() {
    clicked = false;
    cOff = c.offset();
    c.mousemove(function(e) {
      return checkCoords(e);
    });
    return $('body').mousedown(function(ev) {
      clicked = true;
      getCoords(ev);
      if (mvX < width && mvY < height && mvX > 0 && mvY > 0) {
        if (state[mvY][mvX]) {
          tool = 'erase';
        } else {
          tool = 'draw';
        }
        return draw(mvX, mvY);
      }
    }).mouseup(function() {
      return clicked = false;
    });
  };
  checkCoords = function(ev) {
    getCoords(ev);
    if ((mvX < width && mvY < height) && (mvX !== lastX || mvY !== lastY)) {
      lastX = mvX;
      lastY = mvY;
      if (clicked) {
        return draw(mvX, mvY);
      }
    }
  };
  getCoords = function(ev) {
    mvX = Math.floor((ev.pageX - cOff.left) / cellSize);
    return mvY = Math.floor((ev.pageY - cOff.top) / cellSize);
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
  $(function() {
    badBrowser();
    buttons();
    patternsFunc();
    randomize();
    render(state);
    return drawHandler();
  });
  this.createNext = createNext;
}).call(this);

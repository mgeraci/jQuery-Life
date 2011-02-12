<!DOCTYPE html>
<html>
  <head>
    <title>jQuery Life - Michael P. Geraci</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <?php
      if (preg_match('/michaelgeraci\.com/', $_SERVER['SERVER_NAME'] )) {
        echo '<link rel="stylesheet" type="text/css" href="/style/style.css">
        <script src="/js/lab.min.js" type="text/javascript"></script>
        <script type="text/javascript">$LAB.setOptions({AlwaysPreserveOrder:true}).script("//ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js").script("/js/pack.js")</script>';
      } else {
        echo '<link rel="stylesheet/less" href="/stylesheets/style.less" type="text/css" />
        <script src="/js/less.min.js"></script>
        <script type="text/javascript" charset="utf-8">
          less.env = "development";
          less.watch();
        </script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
        <script type="text/javascript" src="/js/json.js"></script>
        <script type="text/javascript" src="/js/jquery-ui.min.js"></script>
        <script type="text/javascript" src="/js/patternsData.js"></script>
        <script type="text/javascript" src="/js/application.js"></script>';
      }
    ?>
  </head>
  <body>
    <div id="background">
      <div class="centered">
        <img id="logo" width="623" height="310" src="/images/logo.png">
        <div id="tools">
          <a id="status" class="button" href="#"><span>play</span></a>&nbsp;&nbsp;&nbsp;
          <a id="reset" class="button" href="#"><span>randomize</span></a>&nbsp;&nbsp;&nbsp;
          <a id="clear" class="button" href="#"><span>clear</a></a>&nbsp;&nbsp;&nbsp;
          <select id="pattern"></select>
          <span id="countWrapper">
            <span id="count">0</span> generations&nbsp;&nbsp;&nbsp;
          </span>
          <span id="drawNote">click on the canvas to draw/erase</span>
        </div>
        <div id="canvases">
          <canvas id="grid" width="300" height="300"></canvas>
          <canvas id="container" width="300" height="300"></canvas>
        </div>
      </div>
    </div>
    <div id="footer">
      <div class="centered">
        Hey there, I'm Michael P. Geraci, a web designer and U/X guy. I made this for fun over New Year's 2011. It was created with jQuery and Canvas.
        <br>
        <br>You can contact me at <a href="mailto:mgeraci@gmail.com">&#109;&#103;&#101;&#114;&#97;&#99;&#105;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;</a>, <a href="http://www.michaelgeraci.com">see my other work</a>, or <a href="http://github.com/mgeraci/jQuery-Life">view the source at github</a>.
      </div>
      <div id="footerTrans">
        <div class="centered">
          What is Conway's Game of Life?
          <br>The game of life is a cellular automaton created by John Conway in 1970. It simulates the life of cells through generations based on a few simple rules:
          <ul>
            <li>If a cell has fewer than 2 neighbors, it dies (from starvation)</li>
            <li>If a cell has 2 or 3 neighbors, it lives on to the next generation</li>
            <li>If a cell has 4 or more neighbors, it dies (from overpopulation)</li>
            <li>If a dead cell has 3 living neighbors, it grows (birth)</li>
          </ul>
          Thanks for playing!
      </div>
    </div>
  </body>
</html>
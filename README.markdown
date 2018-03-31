# jQuery Life

Conway's game of life implemented in jQuery/Coffeescript and Canvas. See it at:
https://mgeraci.github.io/jQuery-Life/

## Overview:

All of the game logic and user interaction happens in file application.coffee, in the /js folder. patternsData.js stores pattern information for loading presets. jquery-ui (and selectmenu appended) handle the select a pattern. LAB handles loading in production.

The only file accessed by users is index.

Image PSDs are located in the images folder.

Thanks for playing!


## To compile the Less stylesheet

`npm run less`

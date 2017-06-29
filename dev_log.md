Aug 29, 2016
---
Error:
> Couldn't find preset "es2015" relative to directory "/Users/Matthew/Project/git/soil-db/node_modules/mapbox-gl-draw"

Fix:
  1. `cd` to `mapbox-gl-draw/node_modules/`
  2. `npm install babel-preset-es2015`

Aug 28, 2016
---
- move soil-db's business layers behind all labels of the planet background layer
- mouse move event
  - show coordinates
  - info panel added

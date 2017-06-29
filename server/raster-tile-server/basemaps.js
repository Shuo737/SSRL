var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();
var tilelive = require('tilelive');
require('tilelive-mapnik').registerProtocols(tilelive);

//============== Start Configuration ===============
// port defaults to 8084
var port = 8084;

// default url pattern: /{country}/{layer}/z/x/y
var url_pattern = /^\/(Nigeria|Benin|BurkinaFaso|Mali|Niger)\/(temp|prcp|elev)\/(\d+)\/(\d+)\/(\d+)$/;

// project code is 'basemaps'
var project = "basemaps";

var xml_pattern = "config/{project}_{country}_{layer}.xml";

//============== End of Configuration ===============

app.set('port', port);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get(url_pattern, function(req, res) {

  var country = req.params[0];
  var lyr = req.params[1];
  var z = req.params[2];
  var x = req.params[3];
  var y = req.params[4];
  var id = [project, country, lyr].join('_');
  var cache_path = path.join(__dirname, ['cache/', id, '/', z, '/', x, '/', y, '.png'].join(''));
  var xml = xml_pattern.replace('{project}', project)
    .replace('{country}', country)
    .replace('{layer}', lyr);

  if (fileExists(cache_path)) {
    console.log('\x1b[32m', ' [' + id + '] cached tile: ', z, x, y, '\x1b[0m');
    var stat = fs.statSync(cache_path);
    if (stat.size > 500) {
      res.header("Content-Type", "image/png");
      res.header("Content-Length", stat.size);
      res.sendFile(cache_path);
    } else {
      res.status(204);
      res.send();
    }
  }else{
    console.log('getting tile');

	var dir =  __dirname.toString().replace(/\\/g,'/');

    tilelive.load('mapnik://' + dir + '/' + xml, function(err, source) {
      if (err) { throw err; }

      source.getTile(z, x, y, function(err, tile, headers) {
        console.log('\x1b[31m', ' [' + id + '] fresh tile: ', z, x, y, '\x1b[0m');
        if (err) {
          res.status(204); // if we have an empty tile, we throw 204 status to pacify the front-end library
          res.send();
          console.log(' err:' + err.message);
          // cache this tile (status)
          // the empty tile will have filesize = 0
          ensureDirectoryExistence(cache_path);
          fs.writeFile(cache_path, '', function(err) {
            if (err) throw err;
            console.log(' Tile cached.');
          });
        } else {
          res.set(headers);
          res.send(tile);
          // cache this tile
          ensureDirectoryExistence(cache_path);
          fs.writeFile(cache_path, tile, function(err) {
            if (err) throw err;
            console.log(' Tile cached.');
          });
        }
      }); // end source.getTile
    }); // end tilelive.load
  }
}); // end app.get

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (directoryExists(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}
function fileExists(path) {
  try {
    fs.accessSync(path, fs.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

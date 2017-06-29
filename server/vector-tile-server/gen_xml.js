var fs = require('fs');
var XMLWriter = require('xml-writer');

var configJs = 'basemaps_config.js';
var outputPath = 'basemap.xml';


// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });

// get the name of the passed config.js
var configJs = process.argv[2];
if(configJs && /(basemaps|project1|project2)_config.js$/.test(configJs)){
  // valid params
}else{
  console.log('\nUsage: "node gen_xml.js {project}_config.js"\n');
  console.log('\tThe generated xml will be {project}.xml\n');
  console.log('\tPossible {project} values: basemaps, project1, project2\n');
  return;
}

var outputPath = configJs.replace('_config.js', '.xml');

var xw = new XMLWriter;
xw.startDocument();
xw.writeDocType('Map');
xw.startElement('Map');
xw.writeAttribute('srs', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over');

fs.readFile(configJs, 'utf8', function(err, text) {

  if(err){
    throw err;
  }
  configJs = JSON.parse(text);

  for (var i = 0; i < configJs.length; i++) {
    xw.startElement('Layer'); // start layer
    xw.writeAttribute('name', configJs[i].id);
    xw.writeAttribute('buffer-size', '32');
    xw.writeAttribute('srs', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
    xw.startElement('Datasource'); // start datasource
    xw.startElement('Parameter'); // start param #1
    xw.writeAttribute('name', 'file');
    xw.text(configJs[i].gdb);
    xw.endElement(); // end param #1
    xw.startElement('Parameter'); // start param #2
    xw.writeAttribute('name', 'type');
    xw.text('ogr');
    xw.endElement(); // end param #2
    xw.startElement('Parameter'); // start param #3

    if(configJs[i].countries){ // this layer has data for different countries
      xw.writeAttribute('name', 'layer_by_sql');

      var fields = [];

      var commonFields = 'SELECT ';
      for (var k = 0; k < configJs[i].fields.length; k++) {
        commonFields += configJs[i].fields[k] + ' AS ' + configJs[i].fieldNames[k] + ',';
      }

      for (var j = 0; j < configJs[i].countries.length; j++) {
        var country = configJs[i].countries[j];

        fields.push(commonFields + "'" + country + "' AS country FROM " + configJs[i].layers[j]);
      }

      var sql = fields.join(' UNION ALL ');
      xw.text(sql);
    }else{ // this layer doesn't have data for different countries
      if(configJs[i].spatial){ // this is a non-spatial layer, so it has 'spatial layer' to join with in order to make it spatial and being visualized
      xw.writeAttribute('name', 'layer_by_sql');
      var id = configJs.id;
      var fields = configJs[i].fields;
      var fieldNames = configJs[i].fieldNames;
      var self_layer = configJs[i].layers[0];
      var spatial_layer = configJs[i].spatial;
      var gdb = configJs[i].gdb;
      var sql = ['SELECT'];
      for (var j = 0; j < fields.length; j++) {
        sql.push(fields[j]);
        sql.push('AS');
        sql.push(fieldNames[j]);
        sql.push(',');
      }
      sql.pop();
      sql.push('FROM');
      sql.push(self_layer);
      sql.push('t2 LEFT JOIN');
      sql.push(spatial_layer);
      sql.push('t1 ON t2.Join_ID = t1.Join_ID');
      xw.text(sql.join(' '));
      
      }else{
        xw.writeAttribute('name', 'layer');
        if(configJs[i].layers){
          xw.text(configJs[i].layers[0]);
        }else if(configJs[i].layer){
          xw.text(configJs[i].layer);
        }else{
          throw "Layer '" + configJs[i] + "' lacks [Layer] or [Layers] property!";
        }
      }
    }

    xw.endElement(); // end param #3
    xw.endElement(); // end datasource
    xw.endElement(); // end layer
  }
  xw.endDocument();

  fs.writeFile(outputPath, xw.toString(), function (err,data) {
    if (err) {
      return console.log(err);
    }
  });
});

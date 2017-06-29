global.layer_broker = (function(){
  var _vectors = [];
  var _rasters = [];
  var _soils = [];
  var _ids = [];

  function _updateIds(){
    _ids = _vectors.concat(_rasters).map(function(v){return v.getId();});
    for (var i = 0; i < _soils.length; i++) {
      Array.prototype.push.apply(_ids, _soils[i].getIds());
    }
  }

  function _getLayerId(layer){
    return [layer.project, layer.country, layer.layer].join('_');
  }

  function _getLayerRenderType(layer){
    switch (layer.type) {
      case 'point':
        return 'symbol';
      case 'line':
        return 'line';
      case 'polygon':
        return 'fill';
      case 'raster':
        return 'raster';
      default:
        throw 'Unknown vector type!';
    }
  }

  function _addLayerToMap(layer){
    var _id = _getLayerId(layer);
    if(layer.type === 'raster'){
      map.addLayer({
        id: _id,
        type: _getLayerRenderType(layer),
        source: [layer.project, layer.country, layer.layer].join('_'),
      }, 'admin_level_2_maritime');
      map.setLayoutProperty(_id, 'visibility', 'none');
    }else{
      var _config = {
        id: _id,
        type: _getLayerRenderType(layer),
        source: layer.project
      };
      if(layer.layer.substr(0, 4) === 'soil'){
        _config['source-layer'] = 'soil';
        if(layer.country !== '_'){
          _config.filter = [ "all",
            [ "==", "Soil_Type", layer.layer.substr(5) ],
            [ "==", "country", layer.country]
          ];
        }else{
          _config.filter = ["==", "Soil_Type", soilType];
        }
      }else{
        _config['source-layer'] = layer.layer;
        if(layer.country !== '_'){
          _config.filter = ["==", "country", layer.country];
        }
      }

      map.addLayer(_config, 'admin_level_2_maritime');

      map.setLayoutProperty(_id, 'visibility', 'none');
    }
  }

  return{
    initLayers: function(){

      var layers = meta_broker.getStackOrder();
      var i = layers.length - 1;
      _addLayerToMap(layers[i]);
      // console.log('Added a layer.');

      for (i = layers.length - 2; i >= 0; i--) {
        _addLayerToMap(layers[i]);
        // console.log('Added a layer.');
      }
    },
    addLayer: function(lyr){
      if(lyr.getType() === 'raster'){
        _rasters.push(lyr);
      }else if(lyr.getType() === 'vector'){
        _vectors.push(lyr);
      }else if(lyr.getType() === 'soil'){
        _soils.push(lyr);
      }else{
        throw 'Unknown layer type!';
      }

      _updateIds();
    },
    removeLayer: function(lyr){
      if(lyr.getType() === 'raster'){
        _rasters.splice(_rasters.indexOf(lyr), 1);
      }else if(lyr.getType() === 'vector'){
        _vectors.splice(_vectors.indexOf(lyr), 1);
      }else if(lyr.getType() === 'soil'){
        _soils.splice(_soils.indexOf(lyr), 1);
      }else{
        throw 'Unknown layer type!';
      }

      _updateIds();
    },
    getLayerIds: function(){
      return _ids;
    }
  };
})();

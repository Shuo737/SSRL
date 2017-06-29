global.RasterLayer = function(config){
  this._on = 0;
  if(checkMustKeys(config, ['project', 'country', 'layer'])){
    this._config = config;
    this._id = [config.project, config.country, config.layer].join('_');
  }else {
    throw 'config lacking mandatory propeties.';
  }
};

global.RasterLayer.prototype.getId = function(){
  return this._id;
};

global.RasterLayer.prototype.getType = function(){
  return 'raster';
};

global.RasterLayer.prototype.show = function(){
  map.setLayoutProperty(this._id, 'visibility', 'visible');
  this._on = 1;
};

global.RasterLayer.prototype.hide = function(){
  map.setLayoutProperty(this._id, 'visibility', 'none');
  this._on = 0;
};

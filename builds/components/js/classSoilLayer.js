global.SoilLayer = function(config){
  this._on = 0;
  this._config = config;
  this._ids = [];
  this._lut = meta_broker.getSoilLUT();

  for(var soilType in this._lut){
    if(this._lut.hasOwnProperty(soilType)){
      var color = this._lut[soilType];
      var _id = [this._config.project, this._config.country, 'soil', soilType].join('_');
      this._ids.push(_id);
      map.setPaintProperty(_id, "fill-color", color);
      map.setPaintProperty(_id, "fill-opacity",  0.7);
      map.setPaintProperty(_id, "fill-outline-color",  "transparent");
    }
  } // end for
};

global.SoilLayer.prototype.getType = function(){
  return 'soil';
};

global.SoilLayer.prototype.getProject = function(){
  return this._config.project;
};

global.SoilLayer.prototype.getCountry = function(){
  return this._config.country;
};

global.SoilLayer.prototype.getLayer = function(){
  return 'soil-AC';
};

global.SoilLayer.prototype.getGeomType = function(){
  return this._config.type;
};

global.SoilLayer.prototype.getIds = function(){
  return this._ids;
};

global.SoilLayer.prototype.show = function(){
  for (var i = 0; i < this._ids.length; i++) {
    map.setLayoutProperty(this._ids[i], 'visibility', 'visible');
  }
  this._on = 1;
};

global.SoilLayer.prototype.hide = function(){
  for (var i = 0; i < this._ids.length; i++) {
    map.setLayoutProperty(this._ids[i], 'visibility', 'none');
  }
  this._on = 0;
};

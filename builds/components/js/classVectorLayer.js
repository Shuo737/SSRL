global.VectorLayer = function(config){
  this._on = 0;
  if(checkMustKeys(config, ['project', 'country', 'layer'])){
    this._config = config;
    this._id = [config.project, config.country, config.layer].join('_');

    switch (config.layer) {
      case 'railway':
        map.setPaintProperty(this._id, "line-color", "rgb(255, 0, 0)");
        map.setPaintProperty(this._id, "line-opacity", 0.5);
        break;
      case 'roads':
        map.setPaintProperty(this._id, "line-color", "rgb(255, 128, 0)");
        map.setPaintProperty(this._id, "line-opacity", 0.5);
        break;
      case 'adm0':
        map.setPaintProperty(this._id, "fill-outline-color", "white");
        map.setPaintProperty(this._id, "fill-opacity", 0.3);
        break;
      case 'adm1':
        map.setPaintProperty(this._id, "fill-outline-color", "white");
        map.setPaintProperty(this._id, "fill-opacity", 0.3);
        break;
      case 'adm2':
        map.setPaintProperty(this._id, "fill-outline-color", "white");
        map.setPaintProperty(this._id, "fill-opacity", 0.3);
        break;
      case 'rivers':
        map.setPaintProperty(this._id, "line-color", "#bcd6f1");
        // map.setPaintProperty(this._id, "line-opacity", 0.5);
        break;
      case 'lakes':
        map.setPaintProperty(this._id, "fill-color", "#bcd6f1");
        map.setPaintProperty(this._id, "fill-opacity",  0.75);
        break;
      case 'sahel':
        map.setPaintProperty(this._id, "fill-pattern", "sand-11");
        map.setPaintProperty(this._id, "fill-opacity",  0.75);
        break;
      case 'proj1_data_Boukombe':
      case 'proj1_data_RWH':
      case 'proj1_data_fertile':
      case 'proj1_data_RPT':
      case 'proj1_data_KoumagouB':
      case 'proj1_data_Sadore1998':
      case 'proj1_data_Sadore2013':
      case 'proj1_data_Saria':
        map.setPaintProperty(this._id, "icon-color", "red");
        map.setPaintProperty(this._id, "icon-halo-width", 5);
        map.setPaintProperty(this._id, "icon-halo-color", "rgba(255,255,255,0.75)");
        map.setLayoutProperty(this._id, "icon-image", "marker-15");
        map.setLayoutProperty(this._id, "icon-allow-overlap", true);
        break;
      case 'proj1_research_locations':
        map.setPaintProperty(this._id, "text-color", "#060");
        map.setPaintProperty(this._id, "text-halo-color", "rgba(255,255,255,0.75)");
        map.setPaintProperty(this._id, "text-halo-width", 2);
        map.setPaintProperty(this._id, "icon-color", "red");
        map.setPaintProperty(this._id, "icon-halo-width", 5);
        map.setPaintProperty(this._id, "icon-halo-color", "rgba(255,255,255,0.75)");
        map.setLayoutProperty(this._id, "icon-image", "triangle-15");
        map.setLayoutProperty(this._id, "icon-allow-overlap", true);
        map.setLayoutProperty(this._id, "text-field", "{Name}");
        map.setLayoutProperty(this._id, "text-font", ["Open Sans Semibold"]);
        map.setLayoutProperty(this._id, "text-transform", "uppercase");
        map.setLayoutProperty(this._id, "text-letter-spacing", 0.1);
        map.setLayoutProperty(this._id, "text-offset", [0, 1.5]);
        map.setLayoutProperty(this._id, "text-size", {
          "base": 1.4,
          "stops": [[10, 8], [20, 14]]
        });
        break;
      case 'beninResearchLocations':
        map.setPaintProperty(this._id, "text-color", "#060");
        map.setPaintProperty(this._id, "text-halo-color", "rgba(255,255,255,0.75)");
        map.setPaintProperty(this._id, "text-halo-width", 2);
        map.setPaintProperty(this._id, "icon-color", "red");
        map.setPaintProperty(this._id, "icon-halo-width", 5);
        map.setPaintProperty(this._id, "icon-halo-color", "rgba(255,255,255,0.75)");
        map.setLayoutProperty(this._id, "icon-image", "triangle-15");
        map.setLayoutProperty(this._id, "icon-allow-overlap", true);
        map.setLayoutProperty(this._id, "text-field", "{Village}");
        map.setLayoutProperty(this._id, "text-font", ["Open Sans Semibold"]);
        map.setLayoutProperty(this._id, "text-transform", "uppercase");
        map.setLayoutProperty(this._id, "text-letter-spacing", 0.1);
        map.setLayoutProperty(this._id, "text-offset", [0, 1.5]);
        map.setLayoutProperty(this._id, "text-size", {
          "base": 1.4,
          "stops": [[10, 8], [20, 14]]
        });
        break;
      case 'nigeriaResearchLocations':
        map.setPaintProperty(this._id, "text-color", "#060");
        map.setPaintProperty(this._id, "text-halo-color", "rgba(255,255,255,0.75)");
        map.setPaintProperty(this._id, "text-halo-width", 2);
        map.setPaintProperty(this._id, "icon-color", "red");
        map.setPaintProperty(this._id, "icon-halo-width", 5);
        map.setPaintProperty(this._id, "icon-halo-color", "rgba(255,255,255,0.75)");
        map.setLayoutProperty(this._id, "icon-image", "triangle-15");
        map.setLayoutProperty(this._id, "icon-allow-overlap", true);
        map.setLayoutProperty(this._id, "text-field", "{LGA}");
        map.setLayoutProperty(this._id, "text-font", ["Open Sans Semibold"]);
        map.setLayoutProperty(this._id, "text-transform", "uppercase");
        map.setLayoutProperty(this._id, "text-letter-spacing", 0.1);
        map.setLayoutProperty(this._id, "text-offset", [0, 1.5]);
        map.setLayoutProperty(this._id, "text-size", {
          "base": 1.4,
          "stops": [[10, 8], [20, 14]]
        });
        break;
      case 'airports':
        map.setPaintProperty(this._id, "text-color", "#600");
        map.setPaintProperty(this._id, "text-halo-color", "rgba(255,255,255,0.75)");
        map.setPaintProperty(this._id, "text-halo-width", 2);
        map.setPaintProperty(this._id, "icon-color", "red");
        map.setPaintProperty(this._id, "icon-halo-width", 5);
        map.setPaintProperty(this._id, "icon-halo-color", "rgba(255,255,255,0.75)");
        map.setLayoutProperty(this._id, "icon-image", "airport-15");
        map.setLayoutProperty(this._id, "icon-allow-overlap", true);
        map.setLayoutProperty(this._id, "text-field", "{Name}");
        map.setLayoutProperty(this._id, "text-font", ["Open Sans Semibold"]);
        map.setLayoutProperty(this._id, "text-transform", "uppercase");
        map.setLayoutProperty(this._id, "text-letter-spacing", 0.1);
        map.setLayoutProperty(this._id, "text-offset", [0, 1.5]);
        map.setLayoutProperty(this._id, "text-size", {
          "base": 1.4,
          "stops": [[10, 8], [20, 14]]
        });
        break;
      case 'population':
        map.setPaintProperty(this._id, "text-color", "#000");
        map.setPaintProperty(this._id, "text-halo-color", "rgba(255,255,255,0.75)");
        map.setPaintProperty(this._id, "text-halo-width", 2);
        map.setPaintProperty(this._id, "icon-color", "red");
        map.setPaintProperty(this._id, "icon-halo-width", 5);
        map.setPaintProperty(this._id, "icon-halo-color", "rgba(255,255,255,0.75)");
        map.setLayoutProperty(this._id, "icon-image", "circle-stroked-11");
        map.setLayoutProperty(this._id, "icon-allow-overlap", true);
        map.setLayoutProperty(this._id, "icon-ignore-placement", true);
        map.setLayoutProperty(this._id, "text-field", "{Name}");
        map.setLayoutProperty(this._id, "text-font", ["Open Sans Semibold"]);
        map.setLayoutProperty(this._id, "text-transform", "uppercase");
        map.setLayoutProperty(this._id, "text-letter-spacing", 0.1);
        // map.setLayoutProperty(this._id, "text-allow-overlap", true);
        // map.setLayoutProperty(this._id, "text-ignore-placement", true);
        // map.setLayoutProperty(this._id, "text-optional", true);
        map.setLayoutProperty(this._id, "text-offset", [0, 1.5]);
        map.setLayoutProperty(this._id, "text-size", {
          "base": 1.4,
          "stops": [[10, 8], [20, 14]]
        });
        break;
      default:
        throw 'Undefined layer:' + config.layer;
    }
  }else {
    throw 'config lacking mandatory propeties.';
  }
};

global.VectorLayer.prototype.getId = function(){
  return this._id;
};

global.VectorLayer.prototype.getType = function(){
  return 'vector';
};

global.VectorLayer.prototype.getProject = function(){
  return this._config.project;
};

global.VectorLayer.prototype.getCountry = function(){
  return this._config.country;
};

global.VectorLayer.prototype.getLayer = function(){
  return this._config.layer;
};

global.VectorLayer.prototype.getGeomType = function(){
  return this._config.type;
};

global.VectorLayer.prototype.show = function(){
  map.setLayoutProperty(this._id, 'visibility', 'visible');
  this._on = 1;
};

global.VectorLayer.prototype.hide = function(){
  map.setLayoutProperty(this._id, 'visibility', 'none');
  this._on = 0;
};

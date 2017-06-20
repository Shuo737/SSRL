// constructor
global.ChoropLayer = function(config){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, config);

  // initialize ChoropLayer-specific properties
};
global.ChoropLayer.prototype = Object.create(Layer.prototype);
global.ChoropLayer.prototype.constructor = ChoropLayer;

global.ChoropLayer.prototype.makeLegend = function(){
  this._lg = 'legend for chrop layer';
};

global.ChoropLayer.prototype.getLegend = function(){
  return this._lg;
};

global.ChoropLayer.prototype.getCurCat = function(){
  return this._curCat;
};

global.ChoropLayer.prototype.draw = function(){
  console.log('draw chrop layer');
};

// constructor
global.Theme = function(config){
  if(checkMustKeys(config,['classifier', 'ramp', 'layer'])){
    for(var p in config){
      if(config.hasOwnProperty(p)){
        if((config.classifier instanceof Classifier) && (config.ramp instanceof Ramp)  && (config.layer instanceof Layer)){
          this['_' + p] = config[p];
        }else{
          throw 'Invalid configuration for creating a [Theme] object.';
        }
      }
    }
  }
};
global.Theme.prototype.getClassifier = function(){
  return this._classifier;
};
global.Theme.prototype.getRamp = function(){
  return this._ramp;
};
global.Theme.prototype.getSize = function(){
  if(!this._size){
    throw '[Size] not defined!';
  }else if(!(this._size instanceof Array)){
    throw '[Size] should be an array with 2 elements (min_size, max_size)';
  }{
    return this._size;
  }
};

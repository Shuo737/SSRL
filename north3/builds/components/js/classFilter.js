global.Filter = function(config){

  var goodVerbs = ['==', '!==', '>', '>=', '<', '<=', '()', '@'];

  // filter type:
  // -1: not set, 0: spatial fitler, 1: non-spatial filter
  //
  this._type = -1;
  if(typeof config.verb === 'undefined' || config.verb === ''){
    throw 'A valid verb is expected';
  }else{
    if(goodVerbs.indexOf(config.verb)>=0){ // check for correct verbs
      if(config.verb === '@'){
        this._type = 0;
      }else{
        this._type = 1;
      }
      this.verb = config.verb;
      this.value = config.value;
      return this;
    }else{
      log('Illegal verb for the filter. Supported verbs are: \n' + goodVerbs.join(' '), 0);
    }
  }
};

global.Filter.prototype.getVerb = function(){
  return this._verb;
};

global.Filter.prototype.getValue = function(){
  return this._value;
};

global.Filter.prototype.getType = function(){
  return this._type;
};

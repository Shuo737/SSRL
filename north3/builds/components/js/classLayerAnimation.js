global.LayerAnimation = function(node){
  // constructor
  if(node instanceof Node){
    this._node = node;
    this._id = this._node.getId();
    this._minYear = 0;
    this._maxYear = this._node.getYears().length - 1;
    this._curYear = this._node.getLayerManager().getYearIndex();
    this._enabled = false;
  }else{
    throw 'A [Node] object is required to create [LayerAnimation] class';
  }
};

global.LayerAnimation.prototype.start = function(){
  var self = this;
  if(self._maxYear < 2){
    showModalMsgAuto('Multiple year\'s data are required to use this function!', 'danger');
    return false;
  }
  self._interval = setInterval(function(){
    self._curYear = self._node.getLayerManager().getYearIndex();
    self._curYear ++;
    if (self._curYear > self._maxYear){
      self._curYear = self._minYear;
    }

    // play the animation by triggering each year-div's click event
    $('#lg-node-' + self._id + ' .chart-div .slider_bg.year [data="' + self._curYear + '"]').trigger('click');

    self._enabled = true;
  }, 2000);
};

global.LayerAnimation.prototype.pause = function(){
  clearInterval(this._interval);
  delete this._interval;
  this._enabled = false;
};

global.LayerAnimation.prototype.resume = function(){
  if(!this._interval) this.start();
};

global.LayerAnimation.prototype.getEnabled = function(){
  return this._enabled;
};

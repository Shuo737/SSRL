if(!global.d3) {
  global.d3 = require('d3');
}

// constructor
global.CustomLayer = function(node){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, node);

  // initialize DotLayer-specific properties
};

global.CustomLayer.prototype = Object.create(Layer.prototype);
global.CustomLayer.prototype.constructor = CustomLayer;

// the registered id/name of the custom layer
global.CustomLayer.prototype.getChartType = function(){
  return 'custom';
};

// set up the layer's configuration for the user if needed
global.CustomLayer.prototype.showConfig = function()

}

// create its legend
global.CustomLayer.prototype.getLegend = function(){

  // the play button
  var btnPlay = this.getLegendComponent('btn-play');
}

// show happens before the layer is drawn, so that some initialization or
// other settings can be updated before drawing the layer
global.CustomLayer.prototype.show = function(){

}

// hide will be called when the layer is going to be
// destroyed. This is helpful for resetting the
// system state as before the layer was shown.
global.CustomLayer.prototype.hide = function(){

}

// this is used for doing classification
// return: array of numbers
global.CustomLayer.prototype.getClassificationData = function(){

}

// draw this layer
global.CustomLayer.prototype.draw = function(){
  var lm = this.getLayerManager();
  var node = this.getNode();
  var metanode = node.getMetaNode();
  var name = metanode.getMenu().getName();
  var title = metanode.getMenu().getTitle()
  var redraw = node.getRedraw();
  var animation = this.getAnimation().getEnabled();
  var data = node.getData();
  var index = lm.getYearIndex();

  // drawing this layer

  metanode.setChartTypePrev({
    'chartType': 'costom',
    'yearIndex': index
  })

  this.setRenderType('costom'); // for its base Layer object

  // UI
  if(redraw || animation){
    hideStatusMsg();
  }else{
    hideModalMsg();
  }

  // send the drawDone message
  this.drawDone();
}

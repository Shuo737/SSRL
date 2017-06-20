global.SvgLayer = L.Class.extend({

    initialize: function (svg, isBgLayer) {
        // save position of the layer or any options from the constructor
        this._isBgLayer = isBgLayer;
        this._svg = svg;
    },

    _preRender: {
      flag: false,
      css: ''
    },

    onAdd: function (map) {
        this._map = map;

        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'svg-layer leaflet-zoom-hide');
        this._el.style.display = 'none';
        // this._el.style.background = 'none';
        // this._el.style.display = 'block';
        this._el.innerHTML = this._svg;

        // if(this._isBgLayer){
        //     map.getPanes().overlayPane
        //     .insertBefore(this._el,map.getPanes().overlayPane.firstChild);
        // }else{
            map.getPanes().overlayPane.appendChild(this._el);
        // }

        // apply the pre-rendering styles to all `g` elements
        if(this._preRender.flag && this._preRender.css){
          var gs = this._el.querySelectorAll('g');
          if(gs.length){
            for (var i = 0; i < gs.length; i++) {
              gs[i].style.cssText = this._preRender.css;
            }
          }
        }

        this._el.style.display = 'block';

        // add a viewreset event listener for updating layer's position, do the latter
        map.on('viewreset', this._reset, this);
        this._reset();
    },

    onRemove: function (map) {
        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    _reset: function () {
        // update layer's position
        var z = this._map.getZoom();
        var wd = Math.pow(2,z) * 256;
        var nw = this._map.latLngToLayerPoint([90,-180]);
        this._el.style.position = 'absolute';
        this._el.style.left = nw.x + 'px';
        this._el.style.top = nw.y + 'px';
        this._el.style.width = wd + 'px';
        this._el.style.height = wd + 'px';
    }
});
SvgLayer.prototype.toggle = function(){
    if (this._el.style.visibility === 'hidden') {
      this.show();
    }else{
      this.hide();
    }
};

SvgLayer.prototype.preRenderAdd = function(map, cssString){
  if(!this._el){
    this._preRender.flag = true;
    this._preRender.css = cssString;
    map.addLayer(this);
  }else{
    throw 'This SVG layer is already added to the map.';
  }
};

SvgLayer.prototype.hide = function(){
    this._el.style.visibility = 'hidden';
};
SvgLayer.prototype.show = function(){
    this._el.style.visibility = 'visible';
};

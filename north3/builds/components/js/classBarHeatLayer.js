require('jquery_ui');
require('bootstrap-slider');

// constructor
global.BarHeatLayer = function(node){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, node);

  // initialize BarHeatLayer-specific properties
};
global.BarHeatLayer.prototype = Object.create(Layer.prototype);
global.BarHeatLayer.prototype.constructor = BarHeatLayer;

global.BarHeatLayer.prototype.getChartType = function(){
  return 'heatmap';
};

global.BarHeatLayer.prototype.getLegend = function(){
  if(!(this._lg instanceof LegendControlDefault)){
    var time_control = $('<div class="sub-control slider"></div>');
    var lm = this.getLayerManager();
    var node = lm.getNode();
    var years = node.getYears();
  	var n = years.length;
    var theme = this.getTheme();
    var colors = theme.getRamp().getColors();
    var cats = node.getCategories();
    var i, div;
    var lyr = this;

    // year slider
    time_control = this.getLegendComponent({
      id: 'time-control',
      years: years,
      divClick: function(){
      lyr.resetTheme();
    }});

    var container = $('<div data="' + node.getId() + '"></div>');
    container.append(time_control);
    this._lg = container;

  }

  return this._lg;
};

global.BarHeatLayer.prototype.hide = function(){

  // hide the tooltip
  var c = this.heatmap._heatmap;
  if(c.tooltip){
    c.tooltip.hide();
    delete c.tooltip;
  }

  // show markers
  this.getLayerManager().showMarkers();

  if(this.heatmap){
    map.removeLayer(this.heatmap);
    this.heatmap = null;
  }
};

global.BarHeatLayer.prototype.show = function(){
  var node = this.getNode();
  var lm = this.getLayerManager();
  var catIndex, yearIndex;
  var prev = node.getChartTypePrev();
  var redraw = node.getRedraw();
  var animation = this.getAnimation().getEnabled();
  if(this.heatmap instanceof HeatmapOverlay && redraw || animation){
    hideStatusMsg();
    return;
  }

  if(this.heatmap instanceof HeatmapOverlay){
    // redraw or animation scenario
  }else{

    /* fresh load */
    yearIndex = lm.getYearIndex();

    // hide markers
    this.getLayerManager().hideMarkers();

    // initial load: add the legend to its layerManager's legend container
    if(!lm.hasChildLegend({chartType: 'heatmap'})){
      console.log('add heat\'s legend to its LM');
      this.getLayerManager().addChildLegend({
        chartType: 'heatmap',
        content: this.getLegend()
      });
    }
  }

  var lg = lm.getLegend();

  yearIndex = lm.getYearIndex();
  lg.div.find('.chart-div[data="heatmap"] .slider_bg.year [data="' + yearIndex + '"]')
    .addClass('active')
    .siblings().removeClass('active');

  // show this layer
  this.draw();
  this.setShow(true);
};

global.BarHeatLayer.prototype.getClassificationData = function(){
  var a = [];
  var node = this.getNode();
  var data = node.getData();
  var n = node.getYears().length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < data.length; j++) {
      var v = data[j]['v' + i];
      if((typeof v !== 'undefined' && v > 0)){
        a.push(v);
      }
    }
  }
  return a;
};

global.BarHeatLayer.prototype.setClusterRadius = function(data){
  this._clusterRadius = data;
};

global.BarHeatLayer.prototype.getClusterRadius = function(){
  return this._clusterRadius;
};

global.BarHeatLayer.prototype.showConfig = function(){
  var lyr = this;
  var node = this.getNode();
  var modal = $(['<div class="modal fade config" data-backdrop="static" role="dialog">',
                '<div class="modal-dialog">',
                  '<div class="modal-content">',
                  '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                    '<h4 class="modal-title">',
                      '<i class="icon icon-info-circled"></i>',
                      'Layer Configuration',
                    '</h4>',
                  '</div>',
                  '<div class="modal-body">',
                    '<h3 class="title">', node.getMenu().getTitle(), '</h3>',
                    '<div class="row">',
                       '<div class="col-sm-3">',
                         'Theme:',
                       '</div>',
                       '<div class="col-sm-9">',
                         '<label><input type="radio" name="theme" value="default"> Default</label><br>',
                         '<label><input type="radio" name="theme" value="GYR"> Green-Yellow-Red</label><br>',
                         '<label><input type="radio" name="theme" value="BRW"> Blue-Red-White</label><br>',
                         '<label><input type="radio" name="theme" value="YRP"> Yellow-Red-Purple</label>',
                       '</div>',
                    '</div>',
                    '<div class="row">',
                       '<div class="col-sm-3">',
                         'Exaggeration <span id="zfactor-label">()</span>:',
                       '</div>',
                       '<div class="col-sm-9">',
                         '<input id="zfactor-slider" type="text"/>',
                       '</div>',
                    '</div>',
                  '<div class="modal-footer">',
                      '<button type="button" data="apply" class="btn btn-success">Apply</button>',
                      '<button type="button" data="cancel" class="btn btn-success">Cancel</button>',
                  '</div>',
                '</div>',
              '</div>'].join(''));

    modal.on('hidden.bs.modal', function(){
      // remove the modal dialog when its turned off
      modal.remove();
    }).on('shown.bs.modal', function(){
      $('#zfactor-label').html('(' + (lyr.heatmap.cfg.zfactor || 1) + ')');
      $('#zfactor-slider').bootstrapSlider({
        tooltip: 'always',
        min: 0.2,
        max: 10,
        step: 0.2,
        value: lyr.heatmap.cfg.zfactor
      }).on('change', function(e) {
          $('#zfactor-label').html('(' + e.value.newValue + ')');
          lyr.heatmap.cfg.zfactor = e.value.newValue;
        });
      $('#maxOpac-slider').slider({ min: 0, max: 1, step: 0.1, value: lyr.heatmap.cfg.maxOpacity,
        change: function(event, ui) {
          $('#maxOpac-slider-value').html('(' + ui.value + ')');
          lyr.heatmap.cfg.maxOpacity = ui.value;
        }
      });

      var code = lyr.gradient_code || 'default';
      $('[name="theme"][value="' + code + '"]').prop('checked', 'checked');

    });

    // bind [apply] button
    modal.find('[data="apply"]').click(function(){
      lyr.heatmap._draw();
      lyr.heatmap._heatmap.configure(lyr.heatmap.cfg);
    });

    // bind [cancel] button
    modal.find('[data="cancel"]').click(function(){
      modal.modal('hide');
    });

    // bind themes
    modal.find('[name="theme"]').on('change', function(e){
      switch ($(this).val()) {
        case 'default':
        lyr.heatmap.cfg.gradient = {
          0.25:"rgb(0,0,255)",
          0.55:"rgb(0,255,0)",
          0.85:"yellow",
          1:"rgb(255,0,0)"
        };
        lyr.gradient_code = 'default';
        break;
        case 'GYR':
          lyr.heatmap.cfg.gradient = {
            '.5': 'green',
            '.8': 'yellow',
            '.95': 'red'
          };
          lyr.gradient_code = 'GYR';
          break;
        case 'BRW':
          lyr.heatmap.cfg.gradient = {
            '.5': 'blue',
            '.8': 'red',
            '.95': 'white'
          };
          lyr.gradient_code = 'BRW';
          break;
        case 'YRP':
          lyr.heatmap.cfg.gradient = {
            '.5': 'yellow',
            '.8': 'red',
            '.95': 'purple'
          };
          lyr.gradient_code = 'YRP';
          break;
        default:
      }
      // $('.heat-theme').removeClass('open');
      // return false;
    });

  // append modal to DOM
  $('#layout').append(modal);

  // show the modal dialog
  modal.modal('show');
  modal.find('.modal-content').draggable({
    cursor: "move",
    handle: '.modal-header'
  });
  // modal.modal('show');

};

global.BarHeatLayer.prototype.draw = function(){
  console.log('draw heat layer');

  var lm = this.getLayerManager();
  var node = this.getNode();
  var name = node.getMenu().getName();
  var title = node.getMenu().getTitle();
  var redraw = node.getRedraw();
  var animation = this.getAnimation().getEnabled();
  var data = node.getData();
  var hasNote = !!node.getNote();
  var years = node.getYears();
  var cats = node.getCategories();
  var yearIndex =   lm.getYearIndex();
  var catIndex = lm.getCategoryIndex();
  var theme = this.getTheme();
  var ext =  theme.getClassifier().getClassification().extent;
  var lyr;
  var hasTooltipOpen = false;

  // handling 'redraw' & 'animation' scenarios
  if(this.heatmap instanceof HeatmapOverlay){
    // skip some init steps for these 2 scenarios
    if(animation){
      showAlertAuto('<strong>Time</strong> ' + years[yearIndex], 'info');
    }
    lyr = this.heatmap._heatmap;
    if(lyr.tooltip){
      hasTooltipOpen = true;
    }
  }else{
    var cfg = {
      // [0,1] *optional* default = 0.85
      // The blur factor that will be applied to all datapoints.
      // The higher the blur factor is, the smoother the gradients will be
      "blur": 0.85,
  	  // "maxOpacity": 0.8,
      "zfactor": 1,
  	  // scales the radius based on map zoom
  	  "scaleRadius": true,
  	  // which field name in your data represents the latitude - default "lat"
  	  latField: 'lat',
  	  // which field name in your data represents the longitude - default "lng"
  	  lngField: 'lng',
  	  // which field name in your data represents the data value - default "value"
  	  valueField: 'count'
  	};

    this.heatmap = new HeatmapOverlay(cfg);

    map.addLayer(this.heatmap);

    lyr = this.heatmap._heatmap;
    $(this.heatmap.cfg.container)
      .on("mousemove", function(e, coord){
        var x, y;
        if(coord){
          x = coord[0];
          y = coord[1];
        }else{
          x = e.originalEvent.layerX;
          y = e.originalEvent.layerY;
        }
        var val = lyr.getValueAt({x:x, y:y});

        var lm = node.getLayerManager();
        var yearIndex = lm.getYearIndex();

        var content = setTooltipDivContent({
            chart: 'heatmap',
            title: title,
            percent: node.getPercent(),
            data: {
              place: '&mdash;',
              var: name,
              values: [{
                name: name,
                year: years[yearIndex],
                value: '&asymp; ' + val
              }]
            },
            scale: node.getScale(),
            hasNote: hasNote
          });

        if(!lyr.tooltip){
          lyr.tooltip = new TooltipDiv('place-var white');
        }

        // update coord when it's valid
        if(!coord){
          lyr.tooltip.coord = [e.originalEvent.layerX, e.originalEvent.layerY];
        }
        lyr.tooltip.show($(this), content, coord || lyr.tooltip.coord);

      })
      .on("mousewheel DOMMouseScroll mouseout", function(e){
        if(!lyr.tooltip) return;
        lyr.tooltip.hide();
        delete lyr.tooltip;
      });
  }

  var fld_id = "v" + yearIndex;

  var values = [];
  for (i = 0; i < data.length; i++){
    var val = data[i];
    values.push({
    	lat: val.lat,
    	lng: val.lng,
    	count: val[fld_id]
    });
  }

  this.heatmap.setData({
    max: ext[1],
  	min: ext[0],
		data: values
  });

  if(hasTooltipOpen){
    var ev = $.Event('mousemove');
    ev.originalEvent = {}; // has to do this to pacify jquery-touch-events from complaining.
    $(this.heatmap.cfg.container).trigger(ev, [lyr.tooltip.coord]);
  }

  node.setChartTypePrev({
    'chartType': 'heatmap',
    'yearIndex': yearIndex
  });
  this.setRenderType('heatmap'); // for its base Layer object

  // UI
  if(redraw || animation){
    hideStatusMsg();
  }else{
    hideModalMsg();
  }

  // no need to send the drawDone message

};

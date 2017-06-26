if(!global.d3) {
  global.d3 = require('d3');
}
require('jquery_ui');
require('bootstrap-slider');
require('bootstrap-colorpicker');

// constructor
global.BarLayer = function(node){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, node);

  // initialize BarLayer-specific properties
  this.cfg = {};
};
global.BarLayer.prototype = Object.create(Layer.prototype);
global.BarLayer.prototype.constructor = BarLayer;

global.BarLayer.prototype.getChartType = function(){
  return 'bar';
};

global.BarLayer.prototype.getLegend = function(){

  if(!(this._lg instanceof LegendControlDefault)){
    var lm = this.getLayerManager();
    var node = lm.getNode();
    var years = node.getYears();

    // year slider
    time_control = this.getLegendComponent({
      id: 'time-control',
      years: years,
      supressClick: true,
      divHighlight: true,
      supressPlay: true,
      colors: this.getTheme().getRamp().getColors()
    });

    var container = $('<div data="' + node.getId() + '"></div>');
    container.append(time_control);
    this._lg = container;
  }

  return this._lg;
};

global.BarLayer.prototype.show = function(){
  var node = this.getNode();
  var lm = this.getLayerManager();
  var yearIndex;

  // fresh load
  if(!lm.hasChildLegend({chartType: 'bar'})){
    lm.addChildLegend({
      chartType: 'bar',
      content: this.getLegend()
    });
  }

  // show this layer
  this.draw();
  this.setShow(true);
};

global.BarLayer.prototype.repaintLayer = function(config){

  // copy over all properties
  for(var p in config){
    if(config.hasOwnProperty(p)){
      this.cfg[p] = config[p];
    }
  }

  // mark all previously rendered mcharts as invalid
  $('[lid="' + this.getNode().getId() + '"] svg').attr('data', 'invalid');

  this.draw();
};

global.BarLayer.prototype.showConfig = function(){
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
                    '<h3 class="title">', this.getNode().getMenu().getTitle(), '</h3>',
                    '<div class="row">',
                       '<div class="col-sm-4">',
                         'Border Color:',
                       '</div>',
                       '<div class="col-sm-8">',
                         '<input class="color input-group colorpicker-component">',
                       '</div>',
                    '</div>',
                    '<div class="row">',
                       '<div class="col-sm-4">',
                         'Bar\'s Min Height <span id="min-ht-label"></span>:',
                       '</div>',
                       '<div class="col-sm-8">',
                         '<input id="min-ht-slider" type="text"/>',
                       '</div>',
                    '</div>',
                    '<div class="row">',
                       '<div class="col-sm-4">',
                         'Y Axis Transform:',
                       '</div>',
                       '<div class="col-sm-8">',
                         '<label><input id="min-ht-slider" name="yTransform" value="log" type="radio"> Log</label> ',
                         '<label><input id="min-ht-slider" name="yTransform" value="orig" type="radio"> Original</label>',
                       '</div>',
                    '</div>',
                  '<div class="modal-footer">',
                      '<button type="button" data="apply" class="btn btn-success">Apply</button>',
                      '<button type="button" data="cancel" class="btn btn-success">Cancel</button>',
                  '</div>',
                '</div>',
              '</div>'].join(''));
    modal.layer = this;
    modal.on('hidden.bs.modal', function(){

      // remove .colorpicker-hidden elements
      modal.find('input.color').colorpicker('destroy');

      // remove the modal dialog when its turned off
      modal.remove();
    }).on('shown.bs.modal', function(){
      var borderClr = modal.layer.getLayerManager().getLegend().div.find('.slider_bg.year div').first().css('border-color');
      modal.find('input.color').css('background-color', borderClr).attr('value', borderClr);
      if(modal.layer.cfg.yTransform){
        modal.find('[value="' + modal.layer.cfg.yTransform + '"]').prop('checked', 'checked');
      }else{
        modal.find('[value="orig"]').prop('checked', 'checked');
      }
      var minH = modal.layer.cfg.minHeight;
      if(typeof minH === 'undefined'){
        minH = 3;
      }
      $('#min-ht-label').html('(' + minH + ')');
      $('#min-ht-label').html('(' + minH + ')');
      $('#min-ht-slider').bootstrapSlider({
        // tooltip: 'always',
        min: 0,
        max: 10,
        value: minH
      }).on('change', function(e) {
          $('#min-ht-label').html('(' + e.value.newValue + ')');
        });
    });

    // bind [apply] button
    modal.find('[data="apply"]').click(function(){
      var newClr = $('.input-group').val();
      // var newClr = $('.colorpicker-color').css('background-color') || 'black'; // if the user doen't click it'll be rgba(0, 0, 0, 0) thus changing the config automatically
      // var newClr = modal.find('input.color').data('colorpicker').color.toString(); // a bit slower
      modal.layer.getLayerManager().getLegend().div.find('.slider_bg.year div').css('border-color', newClr);
      modal.layer.repaintLayer({
        borderColor: newClr,
        minHeight: Number($('#min-ht-slider').val()),
        yTransform: $('[name="yTransform"]:checked').val()
      });
    });

    // bind [cancel] button
    modal.find('[data="cancel"]').click(function(){
      modal.modal('hide');
    });

    // color picker
    modal.find('input.color').colorpicker({
      format: 'rgba'
    }).on('changeColor', function(e){
      $(this).css('background-color', e.color.toRGB());
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

global.BarLayer.prototype.getClassificationData = function(){
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

global.BarLayer.prototype.draw = function(){
  var lm = this.getLayerManager();
  var node = this.getNode();
  var name = node.getMenu().getName();
  var title = node.getMenu().getTitle();
  var redraw = node.getRedraw();
  var data = node.getData();
  var years = node.getYears();
  var hasNote = !!node.getNote();
  var bbox = map.getBounds();
  var lyr = this;

  // draw this layer
  if(!redraw){
    showModalMsg('Drawing Bar Chart Map for ' + node.getMenu().getName());
  }else{
    showStatusMsg('Drawing Bar Chart Map for ' + node.getMenu().getName());
  }

  // get classification breaks
  var theme = this.getTheme();
  var cls_result =  theme.getClassifier().getClassification();
  var breaks = cls_result.breaks;
  var ranges = cls_result.ranges;
  var min = cls_result.extent[0];
  var max = cls_result.extent[1];
  var n = breaks.length;
  var w = DEFAULT.marker_div.size.w;
  var h = DEFAULT.marker_div.size.h;
  var bar_wd;
  var pad = 10;

  if(typeof lyr.cfg.minHeight === 'undefined'){
    lyr.cfg.minHeight = 3;
  }

  var x0 = d3.scale.linear()
    .range([pad, w - pad]);

  // var y = d3.scale.linear()
  //   .range([h - pad, pad]);

  var yLog = function(value){
    value = Number(value);
    if(value < 1){
      value = 1;
    }
    return +d3.scale.log()
      .base(Math.E)
      .domain([1, max])
      .range([lyr.cfg.minHeight, h - 2])(value).toFixed(2);
  };

  var yOrig = function(value){
    value = Number(value);
    if(value < 0){
      value = 0;
    }
    return +d3.scale.linear()
      .domain([0, max])
      .range([lyr.cfg.minHeight, h - 2])(value).toFixed(2);
  };

  var y = function(d){
    if(!lyr.cfg.yTransform){
      lyr.cfg.yTransform = 'log';
    }
    switch (lyr.cfg.yTransform) {
      case 'orig':
        return yOrig(d);
      case 'log':
        return yLog(d);
      default:
        throw 'Unsupported yTransform!';
    }
  };

  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .ticks(years.length);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var colors = theme.getRamp().getColors();
  function getColors(d,i){
    return colors[i];
  }

  function getScaledValue(d){
    if(d.value === null || d.value <= 0){
      return y(0);
    }else{
      return y(d.value);
    }
  }

  // d and i are from the closure
  function translateG(d, i){
    return "translate(" + (i * bar_wd + 1) + ", " + (h - getScaledValue(d) - 1).toFixed(2) + ")";
  }

  // event handlers
  var clickHandler = function(e){
    var loc = location; // bind 'location' in the closure
    return function(){

      me = d3.select(this);

      var card = new Card({
        layer: lyr,
        data: me.selectAll('g.can').data(),
        marker: this.parentNode,
        latLng: loc
      });

      card_broker.add(card);

    };
  };

  var mouseOverHandler = function(e) {
    return function(e, hoverIndex){
      var me;

      // remove previous toolitp
      var tip = $.data(this, 'tooltip');
      if(tip){
        tip.hide();
        $.removeData(this, 'tooltip');
      }

      if(this.parentNode.parentNode){
        // console.log(this.parentNode.parentNode);
        me = d3.select(this);
      }else{
        console.log(this.div);
        console.log('bug?');
      }
      var hover = me.select(':hover');
      if(hover && hover[0][0] && hover[0][0].tagName == 'g'){
        hover._fill = hover.attr('fill');
        hover.attr('style','fill:url(#gradient)');
        var highlight = hover.data()[0].values[0].year;

        content = setTooltipDivContent({
          chart: 'bar',
          title: title,
          percent: node.getPercent(),
          data: me.selectAll('g.can').data(),
          highlight: highlight,
          hasNote: hasNote
        });
        $.data(this, 'tooltip', new TooltipDiv('place-var white'));
        $.data(this, 'hover', hover);
        $.data(this, 'tooltip').show($(this),content);
      }
    };
  };
  var mouseOutHandler = function(e) {
    return function(){
      // remove hovering tooltip
      var t = $.data(this, 'tooltip');
      var h = $.data(this, 'hover');

      if(!t || !h) return;
      $.data(this, 'tooltip').hide();
      $.removeData(this, 'tooltip');

      h.attr('style','fill:' + h._fill);
      $.removeData(this, 'hover');

      // this.tooltip.hover.attr('style','fill:' + this.tooltip.hover._fill);
      //
      // this.tooltip.hide();
      // delete this.tooltip;
    };
  };
  var mouseUpHandler = function(e) {
    return function(){
      console.log('mouse up');
    };
  };

  for (i = 0; i < data.length; i++){
    // if the point is outside the map view, we don't draw it
    var location = L.latLng([data[i].lat, data[i].lng]);
		if (!bbox.contains(location)){
			continue;
		}else{
      var markerDiv = $('[lid="' + node.getId() + '"][fid="' + data[i].id + '"]');
      svg = markerDiv.find('svg');

      // applying any filters
      var fm = this.getLayerManager().getFilterManager();
      if(fm.getFilters().length){
        var shouldKeep = fm.applyFilters(data[i]);
        var parentDiv = markerDiv.parent();
        if(!shouldKeep){
          // console.log('Skip: ' + data[i].id);
          if(parentDiv.css('display') !== 'none'){
            parentDiv.css('display', 'none');
          }
          continue;
        }else{
          if(parentDiv.css('display') !== 'block'){
            parentDiv.css('display', 'block');
          }
        }
      }

      // if the 'data' attr is marked as 'invalid' (by repaint method) we don't block the rendering sequence, otherwise we skip it
      if(svg.attr('data') !== 'invalid'){
        if(svg.attr('data-chart') == 'bar')
          continue;
      }

      var values = [];
      var vs = [];
      var zero = 0;
      var v;
      for (var j = 0; j < years.length; j++) {
        var fields = node.filterFields(years[j]);
        vs = [];
        for (var k = 0; k < fields.length; k++) {
          v = data[i][fields[k].id];
          if(v === null || Number(v) < 0){
            v = '&mdash;';
          }
          vs.push({
            name: fields[k].name,
            year: fields[k].year,
            value: v
          });
        }

        v = data[i]['v' + j];
        if(v === null){
          v = '0';
          zero ++;
        }else if(Number(v) <= 0){
          v = '0';
          zero ++;
        }else{
          v = Number(v);
        }

        values.push({
          place: data[i].name,
          ico: data[i].ico,
          var: name,
          values: vs,
          value: v
        });
      } // end for j, loop thru years

      if(zero === years.length){
        values.na = true;
      }
      if(!values.na){

        var div = '[lid="' + this._node.getId() + '"][fid="' + data[i].id + '"]';

        // add this line to exlictly allow spider_broker detecting this div is valid
        var p = $(div).parent();
        if(p.css('display') !== 'block'){
          p.css('display','block');
        }

        bar_wd = +(values.length < 3 ? 10 : ((w - values.length + 1) / values.length)).toFixed(2);

        var d3chart = d3.select(div)
          .html("")
          .append('svg')
  				.attr('data-chart', 'bar')
          .attr('width', w)
          .attr('height', h);

        $(d3chart[0])
          .on('click', clickHandler.call(this, event))
          .on("mouseover", mouseOverHandler.call(this, event))
          .on("mousewheel DOMMouseScroll mouseout", mouseOutHandler.call(this, event))
          .on("mouseup", mouseUpHandler.call(this, event));

        d3chart.selectAll('.can')
          .data(values)
          .enter().append("g")
          .attr("class","can")
          .attr("transform", translateG)
          .attr('fill', getColors)
          .attr('stroke', this.cfg.borderColor || 'black')
          .append("rect")
          .attr("class","bar")
          .attr("height", getScaledValue)
          .attr("width", bar_wd);

        d3chart.append('g').attr('class','x axis')
          .attr("transform", "translate(0," + (h - pad) + ")");
      } // end if(!values.na)

    } // end if validify marker
  } // end loop thru all place points

  node.setChartTypePrev({
    'chartType': 'bar'
  });

  this.setRenderType('bar'); // for its base Layer object

  // UI
  if(redraw){
    hideStatusMsg();
  }else{
    hideModalMsg();
  }

  // send the drawDone message
  this.drawDone();
};

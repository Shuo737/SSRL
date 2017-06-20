if(!global.d3) {
  global.d3 = require('d3');
}

// constructor
global.BarDotLayer = function(node){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, node);

  // initialize DotLayer-specific properties
};
global.BarDotLayer.prototype = Object.create(Layer.prototype);
global.BarDotLayer.prototype.constructor = BarDotLayer;

global.BarDotLayer.prototype.getChartType = function(){
  return 'dot';
};

global.BarDotLayer.prototype.getLegend = function(){
  if(!(this._lg instanceof LegendControlDefault)){
    var lm = this.getLayerManager();
    var node = lm.getNode();
    var years = node.getYears();
  	var n = years.length;
    var theme = this.getTheme();
    var cls_result =  theme.getClassifier().getClassification();
    var breaks = cls_result.breaks;
    var ranges = cls_result.ranges;
    var size = theme.getSize();
    var colors = theme.getRamp().getColors();
    var cats = node.getCategories();
    var slider, i, div;
    var lyr = this;

    // year slider
    time_control = this.getLegendComponent({
      id: 'time-control',
      years: years,
      // supressClick: true,
      // divHighlight: true,
      // supressPlay: true,
      colors: this.getTheme().getRamp().getColors()
    });

    var container = $('<div data="' + node.getId() + '"></div>');
    container.append(time_control);
    this._lg = container;

  }

  return this._lg;
};

global.BarDotLayer.prototype.show = function(){
  var node = this.getNode();
  var lm = this.getLayerManager();
  var yearIndex;

  /* fresh load */
  // initial load: add the legend to its layerManager's legend container
  if(!lm.hasChildLegend({chartType: 'dot'})){
    console.log('add dot\'s legend to its LM');

    var prev = node.getChartTypePrev();

    yearIndex = lm.getYearIndex();

    lm.addChildLegend({
      chartType: 'dot',
      content: this.getLegend()
    });
  }

  // legend's ui

  var lg = lm.getLegend();

  yearIndex = lm.getYearIndex();
  lg.div.find('.chart-div[data="dot"] .slider_bg.year [data="' + yearIndex + '"]')
    .addClass('active')
    .siblings().removeClass('active');

  // show this layer
  this.draw();
  this.setShow(true);
};

global.BarDotLayer.prototype.getClassificationData = function(){
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

global.BarDotLayer.prototype.draw = function(){

  console.log('draw dot layer');

  var lm = this.getLayerManager();
  var node = this.getNode();
  var name = node.getMenu().getName();
  var title = node.getMenu().getTitle();

  var redraw = node.getRedraw();
  var animation = this.getAnimation().getEnabled();

  var data = node.getData();
  var yearIndex =   lm.getYearIndex();
  var years = node.getYears();
  var cats = node.getCategories();
  var hasNote = !!node.getNote();
  var bbox = map.getBounds();
  var lyr = this;
  var svg;

  // UI
  if(redraw || animation){
    showStatusMsg('Updating charts...');
  }else{
    showModalMsg('Drawing Dot Chart Map for ' + node.getMenu().getName());
  }

  if(animation){
    showAlertAuto('<strong>Time</strong> ' + years[yearIndex], 'info');
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
  var size = theme.getSize();
  var colors = theme.getRamp().getColors();
  function getColors(){
    return colors[yearIndex];
  }

  // event handlers
  var clickHandler = function(e){
    var loc = location; // bind 'location' in the closure
    return function(){

      me = d3.select(this);

      var card = new Card({
        layer: lyr,
        data: me.data()[0],
        marker: this.parentNode.parentNode,
        latLng: loc
      });

      card_broker.add(card);

    };
  };

  var mouseOverHandler = function(e){
    return function(){
      var me = d3.select(this);

      // remove previous toolitp
      var tip = $.data(this, 'tooltip');
      if(tip){
        tip.hide();
        $.removeData(this, 'tooltip');
      }

      c._fill = me.attr('fill');
      // me.attr('data',me.attr('fill'));
      // me.attr('fill', 'url(#gradient)');
      me.attr('style','fill:url(#gradient)');
      var data = me.data()[0];
      var content = setTooltipDivContent({
          nodeType: node.getChartType(),
          chart: 'dot',
          title: title,
          percent: node.getPercent(),
          data: data,
          scale: node.getScale(),
          hasNote: hasNote
        });
      $.data(this, 'tooltip', new TooltipDiv('place-var white'));
      $.data(this, 'tooltip').show($(this),content);
    };
  };

  var mouseOutHandler = function(e){
    return function(){
      // remove hovering tooltip
      var t = $.data(this, 'tooltip');
      if(!t) return;
      var me = d3.select(this);
      me.attr('style','fill:' + c._fill);
      $.data(this, 'tooltip').hide();
      $.removeData(this, 'tooltip');
    };
  };

  var mouseUpHandler = function(e){
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
        var shouldKeep = fm.applyFilters(data[i], year);
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
        if(svg.attr('data-year') == yearIndex && svg.attr('data-chart') == 'dot')
          continue;
      }

      // get the 'default' value to render the size of the pie
  		var val = Number(data[i]['v' + yearIndex]);
      if(val === null || Number(val) < 0){
        // dot_sz = size[0];
        continue;
      }

      // figure out the color index
      var sz = 0, dot_sz = 0;

      if(val <= breaks[0]){
        sz = 0;
      }else if(val > breaks[n - 1]){
        sz = n;
      }else{
        for (j = 0; j < n-1; j++) {
          var b1 = breaks[j];
          var b2 = breaks[j + 1];
          if(val > b1 && val <= b2){
            sz = j + 1;
            break;
          }
        }
      }
      dot_sz = size[0] + (size[1] - size[0]) / n * sz; // size in arcmap

      var values = [];
      var vs = [];
      var v = 0;

      var fields = node.filterFields(years[yearIndex]);
      vs = [];
      for (var k = 0; k < fields.length; k++) {
        v = data[i][fields[k].id] || '&mdash;';
        if(v === null || Number(v) < 0){
          v = '&mdash;';
        }
        vs.push({
          name: fields[k].name,
          year: fields[k].year,
          value: v
        });
      }

      v = data[i]['v' + yearIndex];

      values.push({
        place: data[i].name,
        ico: data[i].ico,
        var: name,
        values: vs,
        value: v
      });

      var div = '[lid="' + this._node.getId() + '"][fid="' + data[i].id + '"]';

      var p = $(div).parent();
      if(p.css('display') !== 'block'){
        p.css('display','block');
      }

      var prevDrawing = $(div + ' circle');
      var prevTip;
      if(prevDrawing.length){
        prevTip = $.data(prevDrawing[0], 'tooltip');
        if(prevTip){
          prevTip.hide();
          $.removeData(prevDrawing[0], 'tooltip');
        }
      }

      svg = d3.select(div)
        .html('')
        .append('svg')
      // .attr('data-chart', 'dot2')
      	.attr('data-year', yearIndex)
        .attr('data-chart', 'dot')
        .attr('width', w)
        .attr('height', h);

      var c = svg.append("circle")
        .attr("class","dot")
        .data(values)
        .attr("cx", w /2)
        .attr("cy", h /2)
        .attr("fill", getColors)
        .attr("fill-opacity",0.75)
        .attr("stroke","#fff")
        .attr("stroke-opacity",0.75)
        .attr("r", dot_sz);

      $(c[0])
        .on('click', clickHandler.call(this, event))
        .on("mouseover", mouseOverHandler.call(this, event))
        .on("mousewheel DOMMouseScroll mouseout", mouseOutHandler.call(this, event))
        .on("mouseup", mouseUpHandler.call(this, event));

      if(prevTip){
        $(c[0]).trigger('mouseover');
      }

    } // end if (draw for valid locations)
  } // end for

  // update a few properties
  node.setChartTypePrev({
    'chartType': 'dot',
    'yearIndex': yearIndex
  });
  this.setRenderType('dot'); // for its base Layer object

  // UI
  if(redraw || animation){
    hideStatusMsg();
  }else{
    hideModalMsg();
  }

  // send the drawDone message
  this.drawDone();
};

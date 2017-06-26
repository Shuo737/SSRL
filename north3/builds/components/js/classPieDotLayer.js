if(!global.d3) {
  global.d3 = require('d3');
}

// constructor
global.PieDotLayer = function(node){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, node);

  // initialize DotLayer-specific properties
};
global.PieDotLayer.prototype = Object.create(Layer.prototype);
global.PieDotLayer.prototype.constructor = PieDotLayer;

global.PieDotLayer.prototype.getChartType = function(){
  return 'dot';
};

global.PieDotLayer.prototype.getLegend = function(){
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
    var time_control = this.getLegendComponent({
      id: 'time-control',
      years: years
    });

    // patch slider
    var patch_control = this.getLegendComponent({
      id: 'patch-control',
      categories: cats,
      colors: colors
    });

    var container = $('<div data="' + node.getId() + '"></div>');
    container.append(patch_control).append(time_control);
    this._lg = container;

  }

  return this._lg;
};

global.PieDotLayer.prototype.show = function(){
  var node = this.getNode();
  var lm = this.getLayerManager();
  var catIndex, yearIndex;

  /* fresh load */
  // initial load: add the legend to its layerManager's legend container
  if(!lm.hasChildLegend({chartType: 'dot'})){
    console.log('add dot\'s legend to its LM');

    catIndex = lm.getCategoryIndex();
    yearIndex = lm.getYearIndex();

    lm.addChildLegend({
      chartType: 'dot',
      content: this.getLegend()
    });
  }

  // legend's ui

  var lg = lm.getLegend();
  catIndex = lm.getCategoryIndex();
  lg.div.find('.chart-div[data="dot"] .slider_bg.patch [data="' + catIndex + '"]')
    .addClass('active')
    .siblings().removeClass('active');

  yearIndex = lm.getYearIndex();
  lg.div.find('.chart-div[data="dot"] .slider_bg.year [data="' + yearIndex + '"]')
    .addClass('active')
    .siblings().removeClass('active');

  // show this layer
  this.draw();
  this.setShow(true);
};

global.PieDotLayer.prototype.getClassificationData = function(){
  var a = [];
  var node = this.getNode();
  var lm = this.getLayerManager();
  var data = node.getData();
  var n = node.getYears().length;
  var catInx = +lm.getCategoryIndex() + 1;

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < data.length; j++) {
      var v = data[j]['y' + i + 'v' + catInx];
      if((typeof v !== 'undefined' && v > 0)){
        a.push(v);
      }
    }
  }
  return a;
};

global.PieDotLayer.prototype.draw = function(){

  console.log('draw dot layer');

  var lyr = this;
  var lm = this.getLayerManager();
  var node = this.getNode();
  var name = node.getMenu().getName();
  var title = node.getMenu().getTitle();

  var redraw = node.getRedraw();
  var animation = this.getAnimation().getEnabled();

  var data = node.getData();
  var yearIndex = lm.getYearIndex();
  var catIndex = lm.getCategoryIndex();
  var years = node.getYears();
  var cats = node.getCategories();
  var hasNote = !!node.getNote();
  var bbox = map.getBounds();
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
    return colors[catIndex];
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
        if(svg.attr('data-year') == yearIndex &&
          svg.attr('data-chart') == 'dot' &&
          svg.attr('data-cat') == catIndex)
          continue;
      }

  		var val = Number(data[i]['y' + yearIndex + 'v' + (catIndex + 1)]);
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
      vs.push({
        name: cats[catIndex],
        year: years[yearIndex],
        value: val
      });

      // color and comment field
      for (j = fields.length - 1; j >= fields.length - 2; j--) {
        var fld = fields[j];
        v = data[i][fld.id] || '&mdash;';
        vs.push({
          name: fld.name,
          year: years[yearIndex],
          value: v
        });
      }

      values.push({
        place: data[i].name,
        ico: data[i].ico,
        var: name,
        values: vs,
        value: dot_sz
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
        .attr('data-cat', catIndex)
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
  // lm.setYearIndex(yearIndex);
  // lm.setCategoryIndex(catIndex);
  node.setChartTypePrev({
    'chartType': 'dot',
    'catIndex': catIndex,
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

if(!global.d3) {
  global.d3 = require('d3');
}

// constructor
global.RealPieLayer = function(node){

  // call the parent constructor, make sure 'this' is set correctly
  Layer.call(this, node);

  // initialize RealPieLayer-specific properties
};

global.RealPieLayer.prototype = Object.create(Layer.prototype);
global.RealPieLayer.prototype.constructor = RealPieLayer;

global.RealPieLayer.prototype.getChartType = function(){
  return 'pie';
};

global.RealPieLayer.prototype.getLegend = function(){
  if(!(this._lg instanceof LegendControlDefault)){

    var time_control;
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
    var slider, i;
    var lyr = this;
    slider = $('<div class="slider_bg year"></div>');

    // year slider
    time_control = this.getLegendComponent({
      id: 'time-control',
      years: years
    });

    // patch slider
    var patch_control = this.getLegendComponent({
      id: 'patch-control',
      categories: cats,
      colors: colors,
      supressClick: true
    });

    var container = $('<div data="' + node.getId() + '"></div>');
    container.append(patch_control).append(time_control);
    this._lg = container;
  }

  return this._lg;
};

global.RealPieLayer.prototype.getCurCat = function(){
  return this._curCat;
};

global.RealPieLayer.prototype.show = function(){

  var lm = this.getLayerManager();

  // initial load: add the legend to its layerManager's legend container
  if(!lm.hasChildLegend({chartType: 'pie'})){
    // console.log('add pie\'s legend to its LM');
    lm.addChildLegend({
      chartType: 'pie',
      content: this.getLegend()
    });
  }

  // legend's ui
  var node = this.getNode();
  var prev = node.getChartTypePrev();
  var lg = lm.getLegend();

  var yearIndex = lm.getYearIndex();
  if(yearIndex === -1){
    if(prev){
      yearPrev = prev.yearIndex;
    }
    if(typeof yearPrev !== 'undefined'){
      lm.setYearIndex(yearPrev);
    }else{
      lm.setYearIndex(0);
    }
    yearIndex = lm.getYearIndex();
  }
  lg.div.find('.chart-div[data="pie"] .slider_bg.year [data="' + yearIndex + '"]')
    .addClass('active')
    .siblings().removeClass('active');

  // show this layer
  this.draw();
  this.setShow(true);
};

global.RealPieLayer.prototype.getClassificationData = function(){
  var a = [];
  var data = this.getNode().getData();
  var n = this.getNode().getYears().length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < data.length; j++) {
      var v = data[j]['y' + i + 'v0'];
      if((typeof v !== 'undefined' && v > 0)){
        a.push(v);
      }
    }
  }
  return a;
};

global.RealPieLayer.prototype.repaintLayer = function(colors){

  var node = this.getNode();

  // mark all previously rendered mcharts as invalid
  $('[lid="' + node.getId() + '"] svg').attr('data', 'invalid');

  // drill down each nodes within this metaNode and update ramps for all loaded layers
  // for (var i = 0; i < ns.length; i++) {
    // var n = ns[i];
    var lm = node.getLayerManager();
    if(lm instanceof LayerManager){
      var ls = lm.getLayers();
      if(ls.length > 0){
        for (var j = 0; j < ls.length; j++) {
          if(ls[j] instanceof RealPieLayer){
            var th = ls[j].getTheme();
            if(th instanceof Theme){

              // update its legend
              // var patches = lm.getLegend().l.querySelectorAll('.patch > div');
              var patches = $('#lg-node-' + this.getNode().getId() + ' .chart-div .slider_bg.patch > div');

              for (var k = 0; k < patches.length; k++) {
                patches[k].style.background = colors[k];
              }

              // manually overwrite the preset ramp
              ramp_broker.overrideRealPieRamp({
                ramp: th.getRamp(),
                colors: colors.reverse() // reverse it since the colors scraped from the dialog box is in backwards
              });
            } // end if Theme
          } // end if RealPieLayer
        } // end for j
      } // end if ls.length
    } // end if lm
  // } // end for i

  // this.setRepaint(true);
  this.draw();
  // this.setRepaint(false);

}; // end repaintLayer

global.RealPieLayer.prototype.draw = function(){
  var lyr = this;
  var lm = lyr.getLayerManager();
  var node = lyr.getNode();
  var name = node.getMenu().getName();
  var title = node.getMenu().getTitle();

  var redraw = node.getRedraw();
  var animation = lyr.getAnimation().getEnabled();

  var data = node.getData();
  var index = lm.getYearIndex();
  if(index < 0){
    index = node.getYears().length - 1;
    lm.setYearIndex(index);
  }
  var year = node.getYear(index);
  var cats = node.getCategories();
  var hasNote = !!node.getNote();
  var bbox = map.getBounds();

  var i, j,cls, ramp, theme, svg;

  // UI
  if(redraw || animation){
    showStatusMsg('Updating charts...');
  }else{
    showModalMsg('Drawing Pie Chart Map for ' + node.getMenu().getName());
  }

  if(animation){
    showAlertAuto('<strong>Time</strong> ' + year, 'info');
  }

  // check the year label on the legend
  // $('#lg-node-' + this.getNode().getId() + ' .chart-div .slider_bg.year [data="' + index + '"]').addClass('active').siblings().removeClass('active');

  // get classification breaks
  theme = lyr.getTheme();
  var cls_result, breaks, ranges, n;

  // if the node's values are in %, classification doesn't make sense, its classifier will be null.
  if(!node.getPercent()){
    cls_result =  theme.getClassifier().getClassification();
    breaks = cls_result.breaks;
    ranges = cls_result.ranges;
    n = breaks.length;
  }

  var size = theme.getSize();
  var colors = theme.getRamp().getColors();

  var getPieColor = function(d,i){
    return colors[i];
  };

  // event handlers
  var clickHandler = function(e){
    var loc = location; // bind 'location' in the closure
    return function(){

      me = d3.select(this);

      var card = new Card({
        layer: lyr,
        data: me.selectAll('path').data(),
        marker: this.parentNode.parentNode,
        latLng: loc
      });

      card_broker.add(card);

    };
  };

  var mouseOverHandler = function(e, hoverIndex){
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
      if(!hover[0][0]){
        hover = me.select('path:nth-child(' + (hoverIndex + 1) + ')'); // jquery's index starts at 0 whereas css's index starts at 1
      }
      if(hover && hover[0][0] && hover[0][0].tagName == 'path'){
        hover._fill = hover.attr('fill');
        hover.attr('style','fill:url(#gradient)');
        var highlight = hover.data()[0].data.name;

        content = setTooltipDivContent({
          chart: 'pie',
          title: title,
          percent: node.getPercent(),
          data: me.selectAll('path').data(),
          scale: node.getScale(),
          highlight: highlight,
          hasNote: hasNote
        });
        $.data(this, 'tooltip', new TooltipDiv('place-var white'));
        $.data(this, 'hover', hover);
        $.data(this, 'tooltip').show($(this),content);
      }
    };
  };

  var mouseOutHandler = function(e){
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
      // $('[lid="' + this._node.getId() + '"][fid="' + this._node.getScale() + '_' + data[i].id + '"]').parent().css('display','none');

      var markerDiv = $('[lid="' + node.getId() + '"][fid="' + data[i].id + '"]');
      svg = markerDiv.find('svg');
      // svg = $('[lid="' + node.getId() + '"][fid="' + node.getScale() + '_' + data[i].id + '"] svg');

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
            markerDiv.parent().css('display', 'block');
          }
        }
      }

      // if the 'data' attr is marked as 'invalid' (by repaint method) we don't block the rendering sequence, otherwise we skip it
      if(svg.attr('data') !== 'invalid'){
        if(svg.attr('data-year') == index && svg.attr('data-chart') == 'pie')
          continue;
      }
    }

    // get the 'default' value to render the size of the pie
		var val = Number(data[i]['y' + index + 'v0']);

    if(val < 0) val = 0;

    // figure out the color index
		var sz = 0, dot_sz = 0;

    if(!node.getPercent()){
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
    }

    var w = DEFAULT.marker_div.size.w;
		var h = DEFAULT.marker_div.size.h;

		var values = [];
		var zero = 0;

    for (j = 0; j < cats.length; j++) {

			// var fld1 = lyr.fields.findId(cats[j], year);
			var fld1 = 'y' + index + 'v' + (j + 1);
			var fld0 = 'y' + index + 'v0';
      var v = data[i][fld1];
      var v_p = 0;
      if(v === null){
        v = '&mdash;';
        zero ++;
      }else if(Number(v) <= 0){
        zero ++;
      }else{
        v = Number(v);

        // we won't calculate % values of the original values are in %
        if(!node.getPercent()){
          v_p = (100 * v / data[i][fld0]).toFixed(1);
        }
      }

			values.push({
				place: data[i].name,
				ico: data[i].ico,
				var: name,
				name: cats[j],
				year: year,
				value: v,
        color: data[i].a1,
				value_p: v_p
			});
		}

    if(zero === cats.length){
      values.na = true;
    }

		var div = '[lid="' + this._node.getId() + '"][fid="' + data[i].id + '"]';
		$(div).parent().css('display','block');

    var prevDrawing = $(div + ' g');
    var prevTip;
    if(prevDrawing.length){
      prevTip = $.data(prevDrawing[0], 'tooltip');
      if(prevTip){
        prevTip.hoverIndex = prevDrawing.find(':hover').index();
        prevTip.hide();
        $.removeData(prevDrawing[0], 'tooltip');
      }
    }

    // in case of a repaint command is on hold, since we are going to rewrite the <svg> element, [data='invalid'] won't present.
    svg = d3.select(div)
  				.html('')
  				.append('svg')
  				.style('display','block')
  				.style('margin', 'auto')
  				.attr('data-year', index)
  				.attr('data-chart', 'pie')
  				.attr('width', w)
  				.attr('height', h);

    if(!values.na){

      var g = svg.append('g')
                 .attr('transform','translate(' + w/2 + ',' + h/2 + ')');
      					//  .attr('transform','translate(' + w/2 + ',' + h/2 + ') scale(0.1)');

      $(g[0])
        .on("click", clickHandler.call(this, event))
        .on("mouseover", mouseOverHandler.call(this, event))
        .on("mousewheel DOMMouseScroll mouseout", mouseOutHandler.call(this, event))
        .on("mouseup", mouseUpHandler.call(this, event));

      var arc = d3.svg.arc()
						.outerRadius(dot_sz || 0.8 * size[1]) // percentage nodes will have the same default size.
						.innerRadius(0);

      var pie = d3.layout.pie()
						.value(function(d){if(d.value === "" || d.value == "-") return 0; else return d.value;})
						.sort(null);

			var path = g.selectAll('path')
						.data(pie(values))
						.enter()
						.append('path')
						.attr("class","dot")
						.attr('d',arc)
						.attr('stroke','#fff')
						.attr('stroke-opacity', 0.5)
						.attr('fill', getPieColor);

      // g.transition().duration(800)
      //  .attr('transform','translate(' + w/2 + ',' + h/2 + ')');

      if(prevTip){
        $(g[0]).trigger('mouseover', [prevTip.hoverIndex]);
        prevTip = null;
      }

    } // end if(!values.na)
  } // end for data[i]


  node.setChartTypePrev({
    'chartType': 'pie',
    'yearIndex': index
  });
  this.setRenderType('pie'); // for its base Layer object

  // UI

  if(redraw || animation){
    hideStatusMsg();
  }else{
    hideModalMsg();
  }

  // send the drawDone message
  this.drawDone();
};

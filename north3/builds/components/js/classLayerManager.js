global.LayerManager = function(){
  // constructor

  this._node = {};
  this._layers = [];
  this._geo = {};
  this._legend = null;
  this._chartTypePrev = {};
  this._filters = [];

  // if(checkMustKeys(obj,['node', 'layers'])){
  //   for(var p in obj){
  //     if(obj.hasOwnProperty(p)){
  //       this['_' + p] = obj[p];
  //     }
  //   }
  // }else{
  //   console.log('Failed to create LayerManager object.');
  // }

};

global.LayerManager.prototype.setGeo = function(){

  showStatusMsg('Creating chart containers.'); // technically, they are chart divs

  this._geo = L.layerGroup();
  map.addLayer(this._geo);

  var ns = this._node.getData();
  var isChorop = (this._node.getChartType() === 'choropleth');

  for (var i = 0; i < ns.length; i++) {
    var lat = Number(ns[i].lat);
    var lng = Number(ns[i].lng);

    var m = L.marker([lat,lng],{
			icon: L.divIcon({
				className: (isChorop ? 'mchart chorop' : 'mchart'),
				iconSize: new L.Point(DEFAULT.marker_div.size.w, DEFAULT.marker_div.size.h),
				iconAnchor: new L.Point(DEFAULT.marker_div.anchor.x, DEFAULT.marker_div.anchor.y),
				html: '<div lid="' + this._node.getId() + '" fid="' + ns[i].id + '"></div>'
			})
		});
    m._lid = this._node.getId();
    m._id = ns[i].id;
    m._layerManager = this;
    var me = this;
    // m.once('mouseover', markerOver.call(m, event));
    // m.once('mouseout', markerOut.call(m, event));

    this._geo.addLayer(m);

    hideStatusMsg();

  } // end for
};

global.LayerManager.prototype.getGeo = function(){
  return this._geo;
};

global.LayerManager.prototype.removeGeo = function(){
  // this._geo = null;

  // remove svg boundaries
};

global.LayerManager.prototype.setNode = function(data){
  if(this._node.id){
    throw 'This node has been initialized.';
  }else{
    this._node = data;
    this._chartType = this._node.getChartType();
    this.setGeo();
  }
};

global.LayerManager.prototype.getNode = function(){
  return this._node;
};

global.LayerManager.prototype.getChartType = function(){
  return this._chartType;
};

global.LayerManager.prototype.setYearIndex = function(index){
  this._year_index = Number(index);
};

global.LayerManager.prototype.getYearIndex = function(){

  if(typeof this._year_index === 'undefined'){
    var n = this._node.getYears().length - 1;
    var prev = this._node.getChartTypePrev();
    if(prev){
      var yearPrev = prev.yearIndex;
      if(typeof yearPrev !== 'undefined'){
        this.setYearIndex(yearPrev);
      }else{
        this.setYearIndex(n); // the system defaults to latest year's data
      }
    }else{
      this.setYearIndex(n); // the system defaults to latest year's data
    }
  }

  return +this._year_index;
};

global.LayerManager.prototype.setCategoryIndex = function(index){
  this._cat_index = Number(index);
};

global.LayerManager.prototype.getCategoryIndex = function(){

  if(typeof this._cat_index === 'undefined'){
    var prev = this._node.getChartTypePrev();
    if(prev){
      var catPrev = prev.categoryIndex;
      if(typeof catPrev !== 'undefined'){
        this.setCategoryIndex(catPrev);
      }else{
        this.setCategoryIndex(0); // the system defaults to the 1st category
      }
    }else{
      this.setCategoryIndex(0); // the system defaults to the 1st category
    }
  }

  return +this._cat_index;
};

global.LayerManager.prototype.addLayer = function(layer){
  this._layers.push(layer);
  layer._layerManager = this;
};

global.LayerManager.prototype.getLayers = function(){
  return this._layers;
};

global.LayerManager.prototype.getLegend = function(){
  var me = this;
  if(!this._legend){
    var container = $('<div id="lg-node-' + this.getNode().getId() + '" class="control"></div>');
    var tabs = $('<ul class="nav nav-tabs"></ul>');

    var allowedTypes = chart_config.getChart(this.getNode().getChartType()).charts;
    var tabClickH = function(chartType){
      return function(){
        global.dispatchEvent(new CustomEvent('layer-hide', {'detail': {'layer': me.getCurrentLayer()}}));
        me.show(chartType);
      };
    };

    for (var i = 0; i < allowedTypes.length; i++) {
      var ty = allowedTypes[i];
      var ch = chart_config.getChart(ty);
      var tab = $('<li role="presentation" class="' + ty + '-tab"><a>' + ch.icon + ch.name + '</a></li>');
      tab.click(tabClickH(allowedTypes[i]));
      tabs.append(tab);
    }

    var divs = $('<div class="chart-div"></div>');

    var chart_content = $('<div class="node-content"></div>');
    chart_content.append(tabs).append(divs);

    // footer for all children layers
    var misc_control = $('<div class="footer"></div>');

    var src = $('<div class="source"><i class="icon icon-info-circled"></i>Metadata</div>');
    src.click(function(e){
      e.stopPropagation();
      var node = me.getNode();
      var curLayer = me.getCurrentLayer();
      var link = document.URL.substr(0, document.URL.lastIndexOf('/')) + '/index.php?id=' + node.getId();

      var colorDivs = '';
      var colors = curLayer.getTheme().getRamp().getColors();
      var items;
      switch (curLayer.getChartType()) {
        case 'pie':
          items = node.getCategories();
          break;
        case 'bar':
          items = node.getYears();
          break;
        default:
          // throw 'Unsupported chart type';
      }
      if(items && items.length){
        for (var i = 0; i < colors.length; i++) {
          colorDivs += '<div style="background:' + colors[i] + '"><span>' + items[i] + '</span></div>';
        }
      }else{
        var yearIndex = me.getYearIndex();
        colorDivs += '<div style="background:' + colors[yearIndex] + '"></div>';
      }

      var modal = $(['<div class="modal fade metadata" data-backdrop="static" role="dialog">',
                    '<div class="modal-dialog">',
                      '<div class="modal-content">',
                      '<div class="modal-header">',
                        '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                        '<h4 class="modal-title">',
                          '<i class="icon icon-info-circled"></i>',
                          'Metadata',
                        '</h4>',
                      '</div>',
                      '<div class="modal-body">',
                        '<h3 class="title">', node.getMenu().getTitle(), '<span class="reveal"><i class="icon icon-eye"></i> Show me</span></h3>',
                        '<table>',
                          '<tr>',
                            '<td class="caption">Name</td>',
                            '<td>', chart_config.getChart(node.getChartType()).icon + node.getMenu().getName(), '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="caption">Years</td>',
                            '<td>', node.getYears().join(', '), '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="caption">Class breaks</td>',
                            '<td>', curLayer.getTheme().getClassifier().getClassification().breaks, '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="caption">Colors</td>',
                            '<td class="colors">', colorDivs, '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="caption">Permalink <i class="icon icon-link"></i></td>',
                            '<td class="permalink"><textarea>', link, '</textarea><button class="btn btn-default">Copy</button></td>',
                          '</tr>',
                          '<tr>',
                            '<td class="caption">Source</td>',
                            '<td>', node.getSource(), '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="caption">Note</td>',
                            '<td>', node.getNote(), '</td>',
                          '</tr>',
                        '</table>',
                      '</div>',
                      '<div class="modal-footer">',
                          '<button type="button" data="ok" class="btn btn-success">OK</button>',
                      '</div>',
                    '</div>',
                  '</div>'].join(''));

      $('#layout').append(modal);

      modal.on('hidden.bs.modal', function(){

        // remove the model dialog when its turned off
        modal.remove();
      }).on('shown.bs.modal', function(){

        var me = $(this);

        // hook up the copy button's click event
        me.find('.permalink button').click(function(){
          me.find('.permalink textarea')[0].select();
          var successful = document.execCommand('copy');
          if(successful){
            showAlertAuto('URL is copied successfully!', 'success');
        	}else{
            showAlertAuto('URL cannot be copied automatically. You can do it yourself by selecting the URL, right-click and select copy.', 'danger');
        	}
        }); // end button click

        // hook up title's hover event
        me.find('.reveal').hover(function(){
          me.ps = node.getMenu().getParents();
          var lapse = 0;
          var mnOpen = function(i, lapse){
            setTimeout(function(){
              $('#mn_' + me.ps[i].getId()).addClass('open');
            }, 500 + lapse * 250);
          };
          for (var i = 0; i < me.ps.length; i++) {
            lapse ++;
            mnOpen(i, lapse);
          }
        }, function(){
          var num = 0;
          var lapse = 0;
          var mnHide = function(i, lapse, num){
            setTimeout(function(){
              num ++;
              if(num === me.ps.length){
                delete me.ps;
                console.log('me.ps deleted!');
              }
              $('#mn_' + me.ps[i].getId()).removeClass('open');
            }, 500 + lapse * 250);
          };
          for (var i = me.ps.length - 1; i >= 0; i--) {
            lapse ++;
            mnHide(i, lapse, num);
          }
        });
      }); // end on shown.bs.modal

      // show the modal dialog
      modal.modal('show');

      // bind [ok] button
      modal.find('[data="ok"]').click(function(){

        // hide the modal dialog
        modal.modal('hide');
      });

    }); // end src.click

    var dl = $('<div class="download"><i class="icon icon-download"></i>Download</div>');
    dl.click(function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      console.log('poping up download xlsx window');
      me.getNode().downloadXls();
    });

    // var filter = $('<div class="filter"><i class="icon icon-filter"></i>Filter</div>');
    // filter.click(function(e){
    //   e.stopPropagation();
    //   var node = me.getNode();

    //   var modal = $(['<div class="modal fade filter" data-backdrop="static" role="dialog">',
    //                 '<div class="modal-dialog">',
    //                   '<div class="modal-content">',
    //                   '<div class="modal-header">',
    //                     '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
    //                     '<h4 class="modal-title">',
    //                       '<i class="icon icon-info-circled"></i>',
    //                       'Filter Content',
    //                     '</h4>',
    //                   '</div>',
    //                   '<div class="modal-body">',
    //                     '<h3 class="title">', node.getMetaNode().getMenu().getTitle(), '</h3>',
    //                     '<table>',
    //                       '<tr>',
    //                         '<td class="caption">Province</td>',
    //                         '<td class="province">',
    //                           '<label><input type="checkbox" data="59"> BC</label>',
    //                           '<label><input type="checkbox"  data="48"> AB</label>',
    //                           '<label><input type="checkbox" data="47"> SK</label>',
    //                           '<label><input type="checkbox" data="46"> MB</label>',
    //                         '</td>',
    //                       '</tr>',
    //                       '<tr>',
    //                         '<td class="caption">Other Attributes</td>',
    //                         '<td>', 'Attributes...', '</td>',
    //                       '</tr>',
    //                     '</table>',
    //                   '</div>',
    //                   '<div class="modal-footer">',
    //                       '<button type="button" data="apply" class="btn btn-success">Apply</button>',
    //                       '<button type="button" data="removeAll" class="btn btn-success">Remove All</button>',
    //                   '</div>',
    //                 '</div>',
    //               '</div>'].join(''));

    //   $('#layout').append(modal);

    //   modal.on('hidden.bs.modal', function(){

    //     // remove the modal dialog when its turned off
    //     modal.remove();

    //   }).on('shown.bs.modal', function(){

    //     // load existing filters
    //     var fm = me.getFilterManager();
    //     var filters = fm.getFilters();

    //     if(filters.length){
    //       for (var i = 0; i < filters.length; i++) {

    //         // check for geography filter
    //         if(filters[i].getType() === 0){
    //           var ids = filters[i].value;
    //           for (var j = 0; j < ids.length; j++) {
    //             modal.find('[data="' + ids[j] + '"]').prop('checked', true);
    //           }
    //         }else{
    //           modal.find('[data]').prop('checked', true);
    //         }
    //       }
    //     }else{
    //       modal.find('[data]').prop('checked', true);
    //     }
    //   }); // end on shown.bs.modal

    //   // show the modal dialog
    //   modal.modal('show');

    //   // bind [removeAll] button
    //   modal.find('[data="removeAll"]').click(function(){
    //     me.getFilterManager().removeFilters();

    //     console.log('reset filters to the default setting.');
    //   });

    //   // bind [ok] button
    //   modal.find('[data="apply"]').click(function(){

    //     // // get unchecked boxes, which we are going to hide
    //     // var checkedProvs = modal.find('.province input:checked');
    //     //
    //     // var allProvs = $('[lid="' + node.getId() + '"]');
    //     //
    //     // // remove mchart divs for unchecked provinces
    //     // for (var i = 0; i < checkedProvs.length; i++) {
    //     //
    //     //   console.log('Keep: ' + '[fid^="' + node.getScale() + '_' + $(checkedProvs[i]).attr('data') + '"]');
    //     //   allProvs = allProvs.not('[fid^="' + node.getScale() + '_' + $(checkedProvs[i]).attr('data') + '"]');
    //     // }
    //     //
    //     // // hide those mchart divs
    //     // allProvs.parent().css('display', 'none');

    //     // has filters???
    //     console.log('check if filter settings are changed.');

    //     // add the filter
    //     var fm = me.getFilterManager();
    //     var selected = modal.find('.province input:checked');
    //     fm.addFilter(new Filter({
    //       verb: '@',
    //       value: selected.map(function(){return $(this).attr('data');})
    //     }));

    //     // update the view
    //     me.getNode().getMetaNode().updateView();

    //     // UI
    //     if(selected.length == 4){
    //       fm.setModified(false);
    //       filter.css('color', 'black');
    //     }else{
    //       fm.setModified(true);
    //       filter.css('color', 'red');
    //     }
    //     showModalMsgAuto('Filter applied.');

    //     // hide the modal dialog
    //     modal.modal('hide');
    //   });

    //   // bind [cancel] button
    //   modal.find('[data="cancel"]').click(function(){

    //     // hide the modal dialog
    //     modal.modal('hide');
    //   });

    // }); // end filter.click()

    var config = $('<div class="config"><i class="icon icon-cog"></i>Config</div>');
    config.click(function(e){
      console.log('config...');
      var curChartType = me.getNode().getChartTypePrev().chartType;
      var lyr = me.findByChartType(curChartType);
      lyr.showConfig();
    });

    // misc_control.append(src).append(dl).append(filter).append(config);
    misc_control.append(src).append(dl).append(config);

    container.append('<div class="title">' +
      this.getNode().getMenu().getTitle() + '</div></div>')
      .append(chart_content)
      .append(misc_control);

    this._legend = new LegendControlDefault({
      node: this.getNode(),
      content: container
    });

  } // end if

  return this._legend;
};

global.LayerManager.prototype.hasChildLegend = function(config){
  if(checkMustKeys(config,['chartType'])){
    return this.getLegend().div.find('.chart-div').attr('data') === config.chartType;
  }
};

global.LayerManager.prototype.addChildLegend = function(config){
  if(checkMustKeys(config,['chartType', 'content'])){
    // activate its tab
    // var lgDiv = $(this.getNode().getMetaNode().getLegend().l);
    var lgDiv = this.getLegend();
    // if this fails, use the line above

    var tab = lgDiv.div.find('.nav-tabs .' + config.chartType + '-tab');
    tab.addClass('active')
       .siblings().removeClass('active');
    // show its chart-div
    var div = lgDiv.div.find('.chart-div');

    div.attr('data', config.chartType);
    // remove previous node's legend and insert new node's legend
    div.html('').append(config.content);
  }else{
    console.log('Failed to update the chart\'s legend.');
  }
};

global.LayerManager.prototype.removeChildLegend = function(config){
  this.getLegend().div.find('.chart-div').html('');
};

global.LayerManager.prototype.getFilterManager = function(verb){
  if(!this._filterManager || (this._filterManager && !(this._filterManager instanceof FilterManager))){
    this._filterManager = new FilterManager(this);
  }
  return this._filterManager;
};

global.LayerManager.prototype.show = function(chart){

  var node = this.getNode();

  // show the marker divs
  if(!map.hasLayer(this.getGeo())){
    map.addLayer(this.getGeo());
  }

  var redraw = this.getNode().getRedraw();

  // supress the modal msg during redraw event
  if(!redraw){
    showModalMsg('Drawing ' + node.getMenu().getName());
  }else{
    showStatusMsg('Drawing ' + node.getMenu().getName());
  }

  // show its legend when it's called first time
  map.addControl(this.getLegend());

  // initial load: add the legend to map, also check the menu
  if(!this._legend){
    map.addControl(this.getLegend());
  }

  var prev = node.getChartTypePrev();
  if (prev){
    prev = prev.chartType;
  }

  // when user clicked the chart-tab and there exists a chart
  // we need to call previous layer's hide event for a reset
  if(chart && prev){
    this.findByChartType(prev).hide();
  }

  chart = chart || prev || this.getChartType();
  var l = this.findByChartType(chart);

  if(!l){
    switch (chart) {
      case 'dot':
        if(node.getChartType() === 'bar'){
          l = new BarDotLayer(node);
        }else if(node.getChartType() === 'pie'){
          l = new PieDotLayer(node);
        }else{
          throw 'Unsupported node type!';
        }
        break;
      case 'heatmap':
        if(node.getChartType() === 'bar'){
          l = new BarHeatLayer(node);
        }else if(node.getChartType() === 'pie'){
          l = new PieHeatLayer(node);
        }else{
          throw 'Unsupported node type!';
        }
        break;
      case 'bar':
        l = new BarLayer(node);
        break;
      case 'pie':
        l = new RealPieLayer(node);
        break;
      case 'chorop':
        l = new Chorop(node);
        break;
      default:
    }
    this.addLayer(l);
  }
  this.setShow(true);
  l.show();
};

global.LayerManager.prototype.hide = function(){

  var prev = this.getNode().getChartTypePrev();
  if (prev){
    prev = prev.chartType;
  }
  var p = prev || this.getChartType();
  var l = this.findByChartType(p);
  if(l) l.hide();

  // remove any background svg-layers

  // var ls = this.getLayers();
  // for (var i = 0; i < ls.length; i++) {
  //   ls[i].hide();
  // }

  // remove legend
  this.removeChildLegend();

  // hide the markers
  map.removeLayer(this.getGeo());

  // release memory
  this.removeGeo();

  this.setShow(false);

};

global.LayerManager.prototype.setShow = function(flag){
  this._on = !!flag;
  this.getNode().setShow(!!flag);
};

global.LayerManager.prototype.getShow = function(){
  return this._on;
};

global.LayerManager.prototype.draw = function(){
  console.log('draw/repaint this layer');
};

global.LayerManager.prototype.showMarkers = function(){

  this.getLegend().hideMask();

  var ns = this._node.getData();
  for (var i = 0; i < ns.length; i++) {
    $('[lid="' + this._node.getId() + '"][fid="' + ns[i].id + '"]').parent().css('display','block');
    $('#svg_' + ns[i].id + ' g path').css('visibility','visible');
  }
};

global.LayerManager.prototype.hideMarkers = function(){

  var ns = this._node.getData();
  for (var i = 0; i < ns.length; i++) {
		$('[lid="' + this._node.getId() + '"][fid="' + ns[i].id + '"]').parent().css('display','none');
		$('#svg_' + ns[i].id + ' g path').css('visibility','hidden');
	}
};

global.LayerManager.prototype.getMarkerLayers = function(){
  console.log('get marker layers');
};

global.LayerManager.prototype.autoZoom = function(){

  // var c = this.getNode().getCenter();
  // var z1 = calcZoom(s);
  // var z0 = map.getZoom();
  //
  // map.setView([c.y, c.x], Math.abs(z1[0] - z0) < Math.abs(z1[1] - z0) ? z1[0] : z1[1]);

};

global.LayerManager.prototype.findByChartType = function(chartType){
  var ls = this.getLayers();
  for (var i = 0; i < ls.length; i++) {
    if(ls[i].getChartType() === chartType){
      return ls[i];
    }
  }
  return null;
};

// get the currnt active layer.
global.LayerManager.prototype.getCurrentLayer = function(){
  return this.findByChartType(this.getLegend().div.find('.chart-div').attr('data'));
};

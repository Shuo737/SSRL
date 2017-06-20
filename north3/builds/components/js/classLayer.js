if(!global.d3) {
  global.d3 = require('d3');
}

global.Layer = function(config){
  // constructor

  if(!(config instanceof Node)){
    throw 'Expect a [Node] object to create a [Layer] object.';
  }

  this._node = config;
  this._renderType = '';
};

global.Layer.prototype.getNode = function(){
  return this._node;
};

global.Layer.prototype.setRenderType = function(data){
  this._renderType = data;
};

global.Layer.prototype.getRenderType = function(){
  return this._renderType;
};

global.Layer.prototype.setShow = function(data){
  this._on = !!data;
};

global.Layer.prototype.getShow = function(){
  return this._on;
};

global.Layer.prototype.getChartType = function(){
  // throw 'This method must be overrided.';
  return this._node._chartType;
};

global.Layer.prototype.getLayerManager = function(){
  return this._layerManager;
};

global.Layer.prototype.showConfig = function(){
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
                    '<p>There is nothing to configure for this layer. You are good to go!</p>',
                  '</div>',
                  '<div class="modal-footer">',
                      '<button type="button" data="ok" class="btn btn-success">OK</button>',
                  '</div>',
                '</div>',
              '</div>'].join(''));

  modal.on('hidden.bs.modal', function(){
    // remove the modal dialog when its turned off
    modal.remove();
  });

  // bind [ok] button
  modal.find('[data="ok"]').click(function(){
    modal.modal('hide');
  });

  // append modal to DOM
  $('#layout').append(modal);

  // show the modal dialog
  modal.modal('show').draggable();
};

///
// parameters:
// config = {
//   id: "component's ID",
//   /* real pie */
//   categories: ['cat1', 'cat2', ...],
//   colors: ['red', 'green', ...],
//   supressClick: false, // click the patch div to draw a new chart
//   divClick: function(){}, // custom function attached to the patch-div's click event
//   /* bar chart */
//   years: ['2001', '2002', ...], // array of years for the dataset
//   colors: ['red', 'green', ...], // colors for year-divs
//   supressClick: false, // click the year div to draw a new chart
//   supressPlay: true, // doesn't show barlayer's play button
//   divClick: function(){}, // custom function attached to the year-div's click event
//   divHighlight: true, // highlight barlayer's chart from its time slider
// }
///
global.Layer.prototype.getLegendComponent = function(config){
  var lyr = this;
  var lm = lyr.getLayerManager();
  var slider, div, i;

  switch (config.id) {
    case 'patch-control':
      if(!checkMustKeys(config, ['categories', 'colors'])){
        throw 'Expecting "categories" field';
      }
      var patch_control = $('<div class="sub-control slider"></div>');	// the legend patches
      slider = $('<div class="slider_bg patch"></div>');
      var patchDivClickHandler = function(e){
        return function(){

          var me = $(this);

          // check on the year label in the legend
          me.addClass('active').siblings().removeClass('active');
          // update the node's [category] property
          lm.setCategoryIndex(me.attr('data'));
          // console.log('patch div clicked');

          // draw the chart
          lyr.draw();
        };
      };

      for (i = config.categories.length - 1; i >= 0; i --){
        div = $('<div data="' + i + '" style="background:' + config.colors[i] + '"><span>' + config.categories[i] + '</span></div>');
        if(config.divClick){
          div.click(config.divClick);
        }
        if(!config.supressClick){
          div.click(patchDivClickHandler.call(this, event));
        }

    		slider.append(div);
    	}

      slider.children().each(function(i){
        var me = $(this);
        me.click(function(e){
          e.stopPropagation();
          console.log('pie\'s legend clicked.');
        }).hover(function(){
          var clr = $(this).css('background-color');
          var inx = $(this).attr('data');
          if(lyr.getNode().getChartTypePrev().chartType == "pie"){
            d3.selectAll('[lid="' + lyr.getNode().getId() + '"] g path:nth-child(' + (Number(inx) + 1) + ')').attr('style','fill:url(#gradient)');
          }
        }, function(){
          var clr = $(this).css('background-color');
          var inx = $(this).attr('data');
          if(lyr.getNode().getChartTypePrev().chartType == "pie"){
            d3.selectAll('[lid="' + lyr.getNode().getId() + '"] g path:nth-child(' + (Number(inx) + 1) + ')').attr('style','');
          }
        });
      });

      var btnPaint = $('<img src="img/paint2.png" class="paint"></img>');

      btnPaint.click(function(e){
        e.stopPropagation();
        divs = $(this).prev().find('div');

        var content = '<table class="color"><tr><td>Category</td><td>Current</td><td>New</td></tr>';
        for (i = 0; i < divs.length; i++) {
          var col = $(divs[i]).attr('style').split(':')[1];
          if(col.indexOf(',')>-1){
            col = /(\d+),\s*(\d+),\s*(\d+)/.exec(col);
            col = rgbToHex(Number(col[1]),Number(col[2]),Number(col[3]));
          }
          var txt = $(divs[i]).text();
          content += '<tr><td>' + txt + '</td><td style="background-color:'+ col +';border-radius:3px"><td><input class="color" style="border-radius:3px;width:100px;padding:0" value=' + col + '></td></tr>';
        }
        content += '</table>';

        // showModalDialog('Change a color', content);
        // var input = $('.modal-dialog .modal-body input.color');
        var modal = $(['<div class="modal fade" data-backdrop="static" role="dialog">',
                      '<div class="modal-dialog">',
                        '<div class="modal-content">',
                        '<div class="modal-header">',
                          '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                          '<h4 class="modal-title">',
                            '<img src="img/paint2.png" class="paint">',
                            'Design your own colors',
                          '</h4>',
                        '</div>',
                        '<div class="modal-body">',
                          content,
                        '</div>',
                        '<div class="modal-footer">',
                            '<button type="button" data="ok" class="btn btn-success">OK</button>',
                            '<button type="button" data="cancel" class="btn btn-success">Cancel</button>',
                        '</div>',
                      '</div>',
                    '</div>'].join(''));
          $('#layout').append(modal);
          modal.modal('show');

          modal.find('[data="ok"]').click(function(){

            // remove the model dialog when its turned off
            modal.modal('hide').on('hidden.bs.modal', function(){
              modal.remove();
            });

            // repaintLayer
            var colors = modal.find('input.color').map(function(){return $(this).val();});
            lyr.repaintLayer(colors.toArray());
          });

          modal.find('[data="cancel"]').click(function(){

            // remove the model dialog when its turned off
            modal.modal('hide').on('hidden.bs.modal', function(){
              modal.remove();
            });
          });

          $.each(modal.find('input.color'), function(){
            $(this).colorpicker({
              color: $(this).val(),
              format: 'hex'
            }).on('changeColor', function(e){
              // console.log('color changed', e);
              e.target.style.background = e.color.toHex();
            });
          });

      }); // end btnPaint.click

      patch_control.append('<i class="icon icon-chart-pie"></i>').append(slider).append(btnPaint);

      return patch_control;

    case 'time-control':
      if(!checkMustKeys(config, ['years'])){
        throw 'Expecting "years" field';
      }

      var time_control = $('<div class="sub-control slider"></div>');

      // year slider
      slider = $('<div class="slider_bg year"></div>');
      var yearDivClickHandler = function(e){
        return function(){

          var me = $(this);

          // check on the year label in the legend
          me.addClass('active').siblings().removeClass('active');
          // update the node's [year] property
          lm.setYearIndex(me.attr('data'));
          // console.log('year div clicked');
          // node.setYearIndex(me.attr('data'));

          // draw the chart
          lyr.draw();
        };
      };

      for (i = config.years.length - 1; i >- 1; i --) {
        div = '<div data="' + i + '" style="';
        if(config.colors instanceof Array){
          div += 'background:' + config.colors[i];
        }else{
          div +='border:1px solid';
        }
        div += '"><span>' + config.years[i] + '</span></div>';
        div = $(div);
        if(config.divClick){
          div.click(config.divClick);
        }

        if(!config.supressClick){
          div.click(yearDivClickHandler.call(this, event));
        }

        // setupTooltipDiv(div, 'Draw chart for ' + years[i]);
        slider.append(div);
      }

      if(config.divHighlight){
        slider.children().each(function(i){
          var me = $(this);
          me.hover(function(){
            var inx = $(this).attr('data');
            if(lyr.getNode().getChartTypePrev().chartType == "bar"){
              d3.selectAll('[lid="' + lyr.getNode().getId() + '"] g.can:nth-child(' + (Number(inx) + 1) + ')').attr('style','fill:url(#gradient)');
            }
          },
          function(){
            var inx = $(this).attr('data');
            if(lyr.getNode().getChartTypePrev().chartType == "bar"){
              d3.selectAll('[lid="' + lyr.getNode().getId() + '"] g.can:nth-child(' + (Number(inx) + 1) + ')').attr('style','');
            }
          });
        });
      }

      // play button
      var btnPlay = $('<i class="play icon icon-play" title="Play the animation"></i>');
      btnPlay.checked = false;
      btnPlay.click(function(e){

        e.stopPropagation();

        if(btnPlay.checked){
    			btnPlay.checked = false;
    			$(this).removeClass('icon-pause').addClass('icon-play');
          lyr.getAnimation().pause();
    		}else{
    			btnPlay.checked = true;
    			$(this).removeClass('icon-play').addClass('icon-pause');
          lyr.getAnimation().resume();
    		}
      });

      time_control.append('<i class="caption icon icon-clock"></i>').append(slider);
        if(!config.supressPlay){
          time_control.append(btnPlay);
        }
      return time_control;

    default:

  }
};

global.Layer.prototype.show = function(){
  throw 'Layer of type "' + this.getChartType() + '" must override this method."';
};

global.Layer.prototype.hide = function(){

  var i, data, node;

  node = this.getLayerManager().getNode();

  switch (this.getRenderType()) {
    case 'pie':
    case 'bar':
    case 'bar_top10':
    case 'dot':

      // recycle color ramps
      ramp_broker.recycleRamp(this.getTheme().getRamp());

      data = node.getData();
      for (i = 0; i < data.length; i++) {
        var div = $('[lid="' + node.getId() + '"][fid="' + node.getScale() + '_' + data[i].id + '"]');
        var cht = div.find('svg').children()[0];
        if(cht && cht.tooltip){
          cht.tooltip.hide();
          delete cht.tooltip;
        }

        // clear SVG charts to release some memory
        div.html('');

        // make mchart div invisible
        div.parent().css('display','none');

        // set any associated hovering background invisible
			  // $('#svg_' + node.getScale() + '_' + data[i].id + ' g path').css('visibility','hidden');
        // $('#svg_' + node.getScale() + '_' + data[i].id).parent().remove();
      }
      break;
    case 'heatmap':

      break;
    case 'choropleth':

      break;
    default:

  } // end switch

  // legend
  this.getLayerManager().removeChildLegend();

  this.setShow(false);

  // recycle its ramp index
	// ramp3.recycleRampIndex(this);

  global.dispatchEvent(new CustomEvent('layer-hide', {'detail': {'layer': this}}));
};

global.Layer.prototype.draw = function(){
  console.log('draw/repaint layer');
  throw 'Layer of type "' + this.getChartType() + '" must override this method."';
};

global.Layer.prototype.resetTheme = function(){
  this._theme = null;
};

global.Layer.prototype.getTheme = function(){
  if(this._theme && (this._theme instanceof Theme)){
    // no thing, we have the theme initialized already
  }else{
    // var userScheme = node.getScheme();
    // if(!userScheme) userScheme = {};
    var node = this.getNode();
    var cats = node.getCategories();
    var years = node.getYears();

    var cls = new Classifier(this);
    if(!node.getPercent()){
      if(node.getScheme() && node.getScheme().breaks){
        throw "not implemented: loading user defined theme from the meta json script.";
      }else{

        cls.quantile(DEFAULT.render.breaks);
      } // end if(!node.getScheme().breaks)
    }

    if(node.getScheme() && !node.getScheme().colors){
      this._theme = null;
      throw "not implemented: loading user defined theme from the meta json script.";
    }else{
      switch (this.getChartType()) {
        case 'pie':
          ramp = ramp_broker.createRealPieRamp({count: cats.length});
          break;
        case 'bar':
          ramp = ramp_broker.createBarRamp({count: years.length});
          break;
        default:

      }
      this._theme = new Theme({
        classifier: cls,
        ramp: ramp,
        size: DEFAULT.render[this.getChartType()],
        layer: this
      });
    }
  } // end else
  return this._theme;
};

global.Layer.prototype.getAnimation = function(){
  if(!this._animation){
    this._animation = new LayerAnimation(this.getNode());
  }
  return this._animation;
};

global.Layer.prototype.drawDone = function(){
  global.dispatchEvent(new CustomEvent('layer-shown', {'detail': {'layer': this}}));
};

global.LegendControlDefault = L.Control.extend({
  options: {position: 'bottomright'},
  initialize: function (options) {
    var me = this;
    L.Util.setOptions(me, options);
    me._node = me.options.node;
    var container = $('<div class="legend-control" style="font-size: ' + DEFAULT.UI.legend_font + 'px"></div>');
    container.append(me.options.content);
    container.find('*').dblclick(function(e){
      e.stopPropagation(); // bug fixed on 20160225
    });
    container.find('*').on('tap, hold', function(e){
      e.stopPropagation(); // bug fixed on 20160225
      console.log('tap, hold dismissed');
    });
    var title = container.find('.title');
    var s = title.find('span');
    setupTooltipDiv(s, function(){
      return s.parent().attr('title');
    });

    var controlBox = $('<div class="control-box"></div>');
    var ctlMin = $('<i data="min" class="icon icon-minus-squared" title="Minimize the legend."></i>');
    var ctlHide = $('<i data="hide" class="icon icon-eye" title="Hide this layer."></i>');
    var ctlClose = $('<i data="close" class="icon icon-cancel-squared" title="Turn off this layer."></i>');

    ctlMin.click(function(e){
      e.stopPropagation();
      me.toggleLegend();
    });

    ctlClose.click(function(e){
      e.stopPropagation();
      // if(ctlClose.tooltip)
      //   ctlClose.tooltip.hide();
      me._node.hide();
    });

    ctlHide.click(function(e){
      e.stopPropagation();
      if($(this).hasClass('icon-eye')){
        $(this).removeClass('icon-eye').addClass('icon-eye-off');
        me._node.setTempHide(true);
        me._node.hideMarkers();
      }else{
        $(this).removeClass('icon-eye-off').addClass('icon-eye');
        me._node.setTempHide(false);
        me._node.showMarkers();
      }
    });

    controlBox.append(ctlHide)
      .append(ctlMin)
      .append(ctlClose);
    title.after(controlBox);
    controlBox.after('<div class="mask"></div>');

    me.div = container;
  },
  onAdd: function(map){
    return this.div[0];
  },
  getChartType: function(){
    return this._node.getLayerManager().getChartType();
  },
  showMask: function(msg){
    this.div.find('.mask').html('<div>' + msg + '</div>').css('display', 'block');
  },
  hideMask: function(){
    this.div.find('.mask').html('').css('display', 'none');
  },
  shrinkLegend: function(){
    if(this.div.small) return;
    this.div.small={};
    // var l2 = $(this.l);
    var l2 = this.div;
    l2.addClass('shrink');
    // l2.find('.meta-content').css('display', 'none');
    // l2.find('.mask div').css('display', 'none');
    l2.find('[data="min"]')
      .removeClass('icon-minus-squared')
      .addClass('icon-plus-squared')
      .attr('title', 'Restore the legend.');

    // clr = l2.find('.active').css('background-color');
    // if(clr.length){
    //   var g = clr + ' 0%,rgb(255,255,255) 25%, rgb(255,255,255) 100%';
    //   l2.css('background-image', ['-moz-linear-gradient(left, ',g,')'].join(''));
    //   l2.css('background-image', ['-webkit-linear-gradient(left, ',g,')'].join(''));
    //   l2.css('background-image', ['linear-gradient(to right, ',g,')'].join(''));
    // }

    l2.find('.title').prepend(chart_config.getChart(this.getChartType()).icon);
  },
  growLegend: function(){
    delete this.div.small;
    var l2 = this.div;
    l2.removeClass('shrink');
    // l2.find('.meta-content').css('display', 'block');
    // l2.find('.mask div').css('display', 'block');
    l2.find('[data="min"]')
      .removeClass('icon-plus-squared')
      .addClass('icon-minus-squared')
      .attr('title', 'Minimize the legend.');
    // l2.css('background-image', 'none');

    l2.find('.title .icon').remove();
  },
  toggleLegend: function(){
    if(!this.div.small){
      this.shrinkLegend();
    }else{
      this.growLegend();
    }
  }
}); // end global.LegendControlDefault

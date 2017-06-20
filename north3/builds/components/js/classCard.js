global.Card = function(config){
  // constructor
  if(checkMustKeys(config, ['layer', 'data', 'marker', 'latLng']) && config.latLng instanceof L.LatLng){
    if(config.layer instanceof Layer){
      for(var p in config){
        if(config.hasOwnProperty(p)){
          this['_' + p] = config[p];
        }
      } // end for

      // add its id
      this._id = card_broker.generateId();
    }
  }else{
    throw 'Invalid config!';
  }
};

global.Card.prototype.getId = function(){
  if(typeof this._id !== 'undefined'){
    return  this._id;
  }else{
    return -1;
  }
};

global.Card.prototype.getLayer = function(){
  return this._layer;
};

global.Card.prototype.getData = function(){
  return this._data;
};

global.Card.prototype.getPlace = function(){
  switch (this.getChartType()) {
    case 'pie':
      return this._data[0].data.place;
    default:
      throw 'Unsupported chartType: ' + this.getChartType();
  }
};

global.Card.prototype.getYear = function(){
  switch (this.getChartType()) {
    case 'pie':
      return this._data[0].data.year;
    case 'bar': // return the latest year
      return this._data[this._data.length - 1].values[0].year;
    case 'dot':
      return this._data.values[0].year;
    default:
      throw 'Unsupported chartType: ' + this.getChartType();
  }
};

global.Card.prototype.getTitle = function(){
  return this.getLayer().getNode().getMenu().getTitle();
};

global.Card.prototype.getMarker = function(){
  return $(this._marker);
};

global.Card.prototype.getLatLng = function(){
  return this._latLng;
};

global.Card.prototype.getChartType = function(){
  return this.getLayer().getChartType();
};

global.Card.prototype.getNote = function(){
  return this.getLayer().getNode().getNote();
};

global.Card.prototype.getPercent = function(){
  return this.getLayer().getNode().getPercent();
};

global.Card.prototype.popView = function(){
  var clone = $(_getRenderString(this, {mask: false, view: false, locate: false}));
  clone.find('.mask').remove();
  clone.find('.actions').css('display', '');

  // append the card to DOM
  $('#layout').append(clone);
  var offset = card_broker.generateOffset();
  clone.css({
    'left': offset.left + 'px',
    'top': offset.top + 'px'
  });
  clone.draggable();
  // clone.draggable({
  //   cursor: "move",
  //   handle: '.place-title'
  // });

  // events
  clone.hover(function(){
    clone.find('.actions').css('display', 'block');
  }, function(){
    clone.find('.actions').css('display', 'none');
  });
  clone.find('.actions [data="hide"]').click(function(){
    console.log('hide this card');
  });

  clone.find('.actions [data="locate"]').click(function(){
    console.log('locate this card');
  });

  clone.find('.actions [data="remove"]').click(function(){
    clone.remove();
  });
};

function _getRenderString(card, config){
  var chart = card.getChartType(),
	    title = card.getTitle(),
	    data = card.getData(),
      hasNote = card.getNote(),
      percent = card.getPercent(),
      hasMask = true,
      hasView = true,
      hasLocate = true,
      hasRemove = true;
  if(config && typeof config.mask !== 'undefined') hasMask = config.mask;
  if(config && typeof config.view !== 'undefined') hasView = config.view;
  if(config && typeof config.locate !== 'undefined') hasLocate = config.locate;
  if(config && typeof config.remove !== 'undefined') hasRemove = config.remove;
  var content = [
    '<div class="card" data-id="' + card.getId() + '">',
    hasMask ? '<div class="mask"></div>' : '',
    '<div class="actions">',
      '<div class="btn-group" role="group">',
        hasView ? '<button type="button" data="view" class="btn btn-primary btn-xs"><i class="icon icon-eye"></i> View</button>' : '',
        hasLocate ? '<button type="button" data="locate" class="btn btn-primary btn-xs"><i class="icon icon-target"></i> Locate</button>' : '',
        hasRemove ? '<button type="button" data="remove" class="btn btn-primary btn-xs"><i class="icon icon-cancel-circled"></i> Discard</button>' : '',
      '</div>',
    '</div>'].join('');
    switch (chart) {
      case 'pie':
        content += setTooltipDivContent({
          chart: 'pie',
          title: title,
          data: data,
          hasNote: hasNote,
          percent: percent
        }) + '</div>'; // card's div
        break;
      case 'bar':
        content += setTooltipDivContent({
          chart: 'bar',
          title: title,
          data: data,
          hasNote: hasNote,
          percent: percent
        }) + '</div>';
        break;
      case 'dot':
        content += setTooltipDivContent({
          chart: 'dot',
          title: title,
          data: data,
          hasNote: hasNote,
          percent: percent
        }) + '</div>';
        break;
      default:
        throw 'Unsupported chartType: ' + chart;
    }
    return content;
}

global.Card.prototype.render = function(){

  var me = this;
  var content = _getRenderString(me);

  // hook all events
  var card = $(content);
  card.hover(function(){
    card.find('.actions').css('display', 'block');
  }, function(){
    card.find('.actions').css('display', 'none');
  });
  card.find('[data="remove"]').click(function(){

    var modal = $(['<div class="modal fade config" data-backdrop="static" role="dialog">',
                  '<div class="modal-dialog">',
                    '<div class="modal-content">',
                    '<div class="modal-header">',
                      '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                      '<h4 class="modal-title">',
                        '<i class="icon icon-info-circled"></i>',
                        'Discard Card',
                      '</h4>',
                    '</div>',
                    '<div class="modal-body">',
                      '<p>Do you really want to throw away this card from your deck?</p>',
                    '</div>',
                    '<div class="modal-footer">',
                        '<button type="button" data="yes" class="btn btn-success">Yes</button>',
                        '<button type="button" data="no" class="btn btn-danger">No</button>',
                    '</div>',
                  '</div>',
                '</div>'].join(''));
    modal.on('hidden.bs.modal', function(){
      // remove the modal dialog when its turned off
      modal.remove();
    });

    // bind [Yes] button
    modal.find('[data="yes"]').click(function(){
      card_broker.remove(me);
      modal.modal('hide');
    });

    // bind [No] button
    modal.find('[data="no"]').click(function(){
      modal.modal('hide');
    });

    // append modal to DOM
    $('#layout').append(modal);

    // show the modal dialog
    modal.modal('show').draggable();

  }); // end remove button's click

  card.find('[data="locate"]').click(function(){
    // var p1 = me.getMarker().offset();
    var p1 = map.latLngToContainerPoint(me.getLatLng());
    p1.left = p1.x;
		p1.top = p1.y + getHeaderHeight();
    var p2 = card.offset();
    p2.top += parseInt(card.css('height')) / 2;

    _showLeadLine(p1, p2);
    
  }); // end locate button's click

  card.find('[data="view"]').click(function(){
    me.popView();
  });

  return card;

};

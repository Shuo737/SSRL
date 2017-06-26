global.FilterManager = function(layerManager){
  // constructor
  this._layerManager = layerManager;
  this._filters = [];

  this._addSpatialFilter = function(filter){
    if(filter.getType() !== 0){
      throw 'Spatial filter object expected!';
    }else{
      if(this._filters.length){
        var sf = this.getFilters('@');
        if(sf instanceof Filter){
          this._filters.pop(sf); // delete the previous filter
        }
        // add the new spatial filter
        this._filters.push(filter);
      }else{
        // in case we don't have any filters, we simply add this filter directly
        this._filters.push(filter);
      }
    }
  };

  this._addNonSpatialFilter = function(filter){
    var v = filter.getVerb(); // the verb of the filter to be added.
    if(filter.getType() === 0){
      throw 'Non-spatial filter object expected!';
    }else{
      if(this._filters.length){
        var f = this.getFilters(v);
        if(f instanceof Filter){
          this._filters.pop(f); // delete the previous filter
        }
        // add the new filter
        this._filter.push(filter);
      }else{
        // in case we don't have any filters, we simply add this filter directly
        this._filters.push(filter);
      }
    }
  };

  return this;
};

global.FilterManager.prototype.getFilters = function(filter_verb){
  if(typeof filter_verb == 'undefined'){
    return this._filters;
  }else{
    var fs = this.getFilters();
    for (var i = 0; i < fs.length; i++) {
      if(fs[i].verb == filter_verb){
        return fs[i];
      }
    }
    fs = null;
    return [];
  }
};

global.FilterManager.prototype.getLayerManager = function(){
  return this._layerManager;
};

global.LayerManager.prototype.removeFilters = function(){
  this._filters = [];

  // UI
  this.getLayerManager().getLegend().find('.filter').removeClass('applied');
};

global.FilterManager.prototype.applyFilters = function(data, year){
  var node = this.getLayerManager().getNode();

  var markerDiv = $('[lid="' + node.getId() + '"][fid="' + node.getScale() + '_' + data.id + '"]');
  svg = markerDiv.find('svg');

  var filters = this.getFilters();

  var flags = {
    total: filters.length,
    cur: 0
  };

  for (var i = 0; i < filters.length; i++) {
    var fld;
    if(year){
      fld = node.getDefaultFieldId(year);
    }
    var shouldKeep = false;
    switch (filters[i].verb) {
      case '@': // geography/provincial filter
        var provIds = filters[i].value;
        for (var j = 0; j < provIds.length; j++) {
          if(data.id.indexOf(provIds[j]) === 0){
            shouldKeep = true;
            break;
          }
        }
        break;
      case '==':
        if(data[fld] == filters[i].value){
          shouldKeep = true;
        }
        break;
      case '!==':
        if(data[fld] !== filters[i].value){
          shouldKeep = true;
        }
        break;
      case '>':
        if(data[fld] > filters[i].value){
          shouldKeep = true;
        }
        break;
      case '>=':
        if(data[fld] >= filters[i].value){
          shouldKeep = true;
        }
        break;
      case '<':
        if(data[fld] < filters[i].value){
          shouldKeep = true;
        }
        break;
      case '<=':
        if(data[fld] <= filters[i].value){
          shouldKeep = true;
        }
        break;
      case '()':
        if((data[fld] > filters[i].value[0]) && (data[fld] < filters[i].value[1])){
          shouldKeep = true;
        }
        break;
      default:

    } // end switch

    flags.cur ++;
    if(flags.cur === flags.total){
      return shouldKeep;
    }
  }

  return true;
};

// Supported query verbs:
// `()` is BETWEEN operator
// `@` is geography operator for selecting specific provinces
global.FilterManager.prototype.addFilter = function(filter){
  if(filter instanceof Filter){
    if(filter.getType() === 0){ // spatial filter
      this._addSpatialFilter(filter);
    }else{
      this._addNonSpatialFilter(filter);
    }
  }else{
    throw 'A [Filter] object is requred.';
  }
};

global.FilterManager.prototype.setModified = function(flag){
  this._changed = !!flag;
};

global.FilterManager.prototype.getModified = function(filter){
  return this._changed;
};

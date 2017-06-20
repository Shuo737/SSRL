global.Node = function(obj){
  // constructor

  this._loaded = false; // This flag indicates if the layer's data is fetched from the server
  this._on = false; // This flag indicates if this layer is visible or not
  this._layerManager = null;
  this._menu = null;
  this._year_index = -1;

 if(obj instanceof Menu){
   var conf = obj.getServerConfig();
   for(var p in conf){
     if(conf.hasOwnProperty(p)){
       this['_' + p] = conf[p];
     }
   }
   this._menu = obj;
   this._id = this._menu.getId();
   this._year = obj._year;
 }else{
   log('Failed to create Node object. [Menu] object required.');
 }

};

global.Node.prototype.getMenu = function(){
  return this._menu;
};

global.Node.prototype.show = function(){
  if(this.getShow()){
    hideModalMsg();
    return true;
  }else{

    if(this._layerManager instanceof LayerManager){
      this._layerManager.show();
    }else{
      this.load();
    }

    // UI
    this.getMenu().check();

    // mark some status flags
    this.setShow(true);

    return true;
  }
};

global.Node.prototype.hide = function(){
  if(this._layerManager){
    console.log('Removing node: ' + this.getId());
    this._layerManager.hide();

    this.setShow(false);

    // UI
    this.getMenu().uncheck();
    map.removeControl(this.getLayerManager().getLegend());

    this._layerManager = null;
  }
};

global.Node.prototype.setRedraw = function(flag){
  this._redraw = !!flag;
};

global.Node.prototype.getRedraw = function(){
  return this._redraw;
};

global.Node.prototype.load = function(){

  var me = this;

  function _load(data){

    hideModalMsg(); // remove the modal message

    me._fields = new Fields(me, data.fields);
    me._categories = data.categories;
    me._percent = data.percent;
    me._extent = data.extent;
    me._default = data.default;
    me._loaded = true;
    me._data = data.data;
    me._layerManager = new LayerManager();

    me._layerManager.setNode(me);
    me._layerManager.show();
  }

  // check the client's local cache and try load it from there
  if(localData_broker.getindexedDBSupport()){
    showModalMsg('<span class="icon icon-arrows-cw animate-spin"></span> Loading Data...');
    var data = localData_broker.retrieve(this.getId(), function(data){
      if(data){
        log('data retrieved from the local indexedDB', 1);
        hideModalMsg();
        _load(data);
      }else{  // if the client doesn't have it, try load it from the server
        showModalMsg('<span class="icon icon-arrows-cw animate-spin"></span> Loading Data...', 'warning');
        $.ajax({
      	  method: 'GET',
      	  url: 'lib/get_var.php',
      	  dataType: 'json',
      	  data: {id: me.getId()}
      	}).done(function(data){
          log('data retrieved from the remote server', 1);
          if(localData_broker.getindexedDBSupport()){
            localData_broker.store({
              id: me.getId(),
              data: data
            }, function(){
              log('data cached in the local indexedDB.', 1);
            });
          }
          hideModalMsg();
          _load(data);
        }).fail(function(data){
          if(data.responseText){
            try{
              var re = JSON.parse(data.responseText);
              if(re.status === -1){
                showModalMsgAuto('Not implemented.', 'danger');
              }
            }catch(err){
              showModalMsgAuto(data.responseText, 'danger');
              log(data.responseText, false);
            }
          }else{
            showModalMsgAuto('An error occurred while talking to the server.', 'danger');
          }
        }); // end ajax
      } // end else
    });
  } // end if localData_broker
};

global.Node.prototype.getId = function(){
  return this._id;
};

global.Node.prototype.getData = function(){
  return this._data;
};

global.Node.prototype.getSource = function(){
  return this._src;
};

global.Node.prototype.getNote = function(){
  return this.getMenu().getNote() || '';
};

global.Node.prototype.getYear = function(index){
  return this._year[index];
};

global.Node.prototype.getYears = function(){
  return this._year;
};

global.Node.prototype.getScale = function(){
  return this._scale;
};

global.Node.prototype.getDefaultFieldName = function(){
  return this._default;
};

global.Node.prototype.filterFields = function(year){
  return this._fields.filterFields(year);
};

global.Node.prototype.getDefaultFieldId = function(year){
  return this._fields.findId(this._default, year);
};

global.Node.prototype.getChartTypePrev = function(){
  return this._chartTypePrev;
};

global.Node.prototype.setChartTypePrev = function(config){
  var flag;
  switch (this.getChartType()) {
    case 'pie':
      flag = checkMustKeys(config,['chartType', 'yearIndex']);
      break;
    case 'bar':
      flag = checkMustKeys(config,['chartType']);
      break;
    default:
      throw 'Unsupported chart type!';
  }
  if(flag){
    this._chartTypePrev = config;
  }
};

global.Node.prototype.getChartType = function(){
  return this._chart;
};

global.Node.prototype.getCategories = function(){
  return this._categories;
};

global.Node.prototype.getPercent = function(){
  return !!this._percent;
};

global.Node.prototype.getExtent = function(){
  return this._extent;
};

global.Node.prototype.getNode = function(){
  return this._node;
};

global.Node.prototype.getCenter = function(){
  return this._center;
};

global.Node.prototype.getScheme = function(){
  return this._scheme;
};

global.Node.prototype.getLayerManager = function(){
  return this._layerManager;
};

global.Node.prototype.setShow = function(flag){
  this._on = !!flag;
};

global.Node.prototype.getShow = function(){
  return this._on;
};

global.Node.prototype.checkLoaded = function(){
  return this._loaded;
};

global.Node.prototype.downloadXls = function(fields){
  var self_node = this;
  showStatusMsg('Loading EULA...');
  $.ajax({
    method: 'GET',
    url: 'eula.html',
    dataType: 'text'
  }).done(function(eula){

    showModalMsg('Preparing for the download...');

    var modal = $(['<div class="modal fade download" data-backdrop="static" role="dialog">',
                  '<div class="modal-dialog">',
                    '<div class="modal-content">',
                    '<div class="modal-header">',
                      '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                      '<h4 class="modal-title">',
                        '<i class="icon icon-download"></i>',
                        'Download Data',
                      '</h4>',
                    '</div>',
                    '<div class="modal-body">',
                      '<p>By downloading data from this service, you must agree to the following terms and conditions:</p>',
                      '<h3>Agreement</h3>',
                      '<div>' + eula + '</div>',
                    '</div>',
                    '<div class="modal-footer">',
                        '<button type="button" data="ok" class="btn btn-success">OK</button>',
                        '<button type="button" data="cancel" class="btn btn-success">Cancel</button>',
                    '</div>',
                  '</div>',
                '</div>'].join(''));

      $('#layout').append(modal);

      modal._abort = true;

      // remove the model dialog when its turned off
      modal.on('hidden.bs.modal', function(){
        if(modal._abort){
          showModalMsg('Download procedure aborted!', 'danger');
          setTimeout(function(){
            hideModalMsg();
          }, 1500);
        }else{
          hideModalMsg();
        }

        modal.remove();
      });

      // show the modal dialog
      modal.modal('show');

      hideStatusMsg();

      // bind [ok] button
      modal.find('[data="ok"]').click(function(){

        modal._abort = false;

        // hide the modal dialog
        modal.modal('hide');

        // start the download
        file_broker.downloadXls(self_node);
      });

      // bind [cancel] button
      modal.find('[data="cancel"]').click(function(){

        // hide the modal dialog
        modal.modal('hide');
      });
  });
};

global.Node.prototype.setTempHide = function(flag){
  this._tempHide = !!flag;
};

global.Node.prototype.getTempHide = function(){
  return this._tempHide;
};

global.Node.prototype.hideMarkers = function(){
  var lm = this.getLayerManager();

  if(lm.getNode().getChartTypePrev().chartType === "heatmap"){
    lm.findByChartType('heatmap').heatmap.cfg.container.style.display = 'none';
  }else{
    lm.hideMarkers();
  }

  lm.getLegend().showMask('Layer is hidden.');

};

global.Node.prototype.showMarkers = function(){
  var lm = this.getLayerManager();

  lm.getLegend().hideMask();

  if(lm.getNode().getChartTypePrev().chartType === 'heatmap'){
    lm.findByChartType('heatmap').heatmap.cfg.container.style.display = 'block';
  }else{
    // make all marks visible, this will only show all previously rendered markers
    lm.showMarkers();
  }

  // the user may have panned the map while the layer's hidden,
  // as a result, even markers in the view may not have been rendered,
  // so we need to call updateView method for rescue.
  this.updateView();
};

global.Node.prototype.updateView = function(){
  if(this.getShow()){
    this.setRedraw(true);
  }
  this.show();
};

global.Node.prototype.getShownChartType = function(){
  return this.getChartType();
};

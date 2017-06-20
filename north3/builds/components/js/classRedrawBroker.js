global.redraw_broker = (function(){
  var instance;
  var _current = 0; // current number of layers that have been redrawn
  var _total = 0; // total number of layers need to be redrawn

  // layer-shown event comes from 'Layer.prototype.drawDone'
  global.addEventListener('layer-shown', function(e){
    e.detail.layer.getNode().setRedraw(false);
    redraw_broker.updateStatus();
  });

  function _redrawMenu(menu){

    var j,k;

    if(menu instanceof Menu){

      // metaNodes that need to be updated
      var dirtyList = [];

      // work on the current menu
      var metaNode = menu.getMetaNode();

      // if this menu has metaNode (i.e. it's a data layer)
      // and it is turned on
      if(metaNode && metaNode.getShow()){

        // if this layer is not hidden due to user clicking the 'hide' button (eye icon)
        if(!metaNode.getTempHide()){

          // we update this layer's mchart divs
          dirtyList.push(metaNode);
        }

      } // end if metaNode

      // work on its children menus
      var subMenus = menu.getMenus();
      if(subMenus && subMenus.length){
        for (j = 0; j < subMenus.length; j++) {
          var ms = _redrawMenu(subMenus[j]);
          if(ms.length){
            // copy ms to dirtyList
            dirtyList.push.apply(dirtyList, ms);
          }
        }
      }

      return dirtyList;

    }else{
      throw 'Expecting a [Menu] object.';
    }
  }

  function createInstance(){
    return {
      setTotal: function(data){ _current = 0; _total = data; },
      updateStatus: function(){
        if(_total > 0){
          _current ++;
          if(_current >= _total){ // we are done with redrawing all layers
            console.log('Redraw queue: (' + _current + '/' + _total + ') ...');
            _current = 0;
            _total = 0;

            spider_broker.spiderfy(calcScale());
            console.log('Redraw complete!');
            return true;
          }else{
            console.log('Redraw queue: (' + _current + '/' + _total + ') ...');
            return false; // we haven't done yet
          }
        }else{
          // spider_broker.spiderfy(calcScale());
          console.log('Redraw queue is empty');
        }
      },
      redrawLayers: function(){

        // get the top/root menu
        var menus = menu_broker.getMenus();

        // collecting dirty metaNodes
        var dirtyList = _redrawMenu(menus);

        // update the _total counter
        _total = dirtyList.length;

        // clean the dirty metaNodes
        while(dirtyList.length){
          dirtyList[dirtyList.length - 1].updateView();
          dirtyList.pop();
        }
      } // end redrawLayers
    };
  }

  return (function(){
    if(!instance){
      showModalMsg('Loading Menu Broker...');
      instance = createInstance();
    }
    return instance;
  })();
})();

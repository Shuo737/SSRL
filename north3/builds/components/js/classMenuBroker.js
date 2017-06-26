global.menu_broker = (function(){
  var instance;
  var _meta = {};

  function _parseMenu(config) {
    var m = new Menu(config);

    // loop thru its children
    var c = config.children;
    if(c && (c instanceof Array) && (c.length > 0)){
      for (var i = 0; i < c.length; i++) {
        var subM = _parseMenu(c[i]);
        subM.setParent(m);
        m.addMenu(subM);
      }
    }
    return m;
  }

  function popMenuBroker(obj){

    if(!obj){
      obj = menu_broker.getMenu();
    }
    // we only need to init a Node Object for menus having 'data' property
    if(obj.checkDataFlag()){
      var node = new Node(obj);
      obj.setNode(node);
    }

    // recursively loop thru its children
    var c = obj.getMenus(); // if this doesn't work, use obj.children
    if(c && (c instanceof Array) && (c.length > 0)){
      for (var i = 0; i < c.length; i++) {
        popMenuBroker(c[i]);
      }
    }
  }

  function _loadData(){
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: 'lib/cache/meta.json'
      }).done(function(data){
        var root = {
          id: 'root',
          text: 'root',
          children: data.children[1].children
        };
        menu_broker._treeNodes = data.children[1].children;
        menu_broker._menu = _parseMenu(root);
        data = null;

        popMenuBroker();

        init_broker.init('menuBroker');

      });
  }

  function _find(object, target_id){
      if(object.getId() === target_id){
        return object;
      }else{
        var ms = object.getMenus();
        if(ms && ms.length){
          for (var i = 0; i < ms.length; i++) {
            var o = _find(ms[i], target_id);
            if(o) return o;
          }
          return null;
        }
        return null;
      }
    }

  function _getVisibleMenus(menu){

    var visibles = [];

    // collect current menu's node if it's turned on
    var n = menu.getNode();
    if(n && n.getShow()){
      visibles.push(menu);
    }

    // collect its sub-menus' nodes
    var subMenus = menu.getMenus();
    for (var i = 0; i < subMenus.length; i++) {
      var visList = _getVisibleMenus(subMenus[i]);
      if(visList.length){
        Array.prototype.push.apply(visibles,visList);
      }
    }

    return visibles;
  }

  function createInstance(){

    _loadData();

    var o = {
      getVisibleMenus: function(){
        return _getVisibleMenus(this.getMenu());
      },
      uncheckAllMenus: function(menu){
        if(!menu) menu = this.getMenu();

        // turn off current menu
        var n = menu.getNode();
        if(n) n.hide();

        // turn off its sub-menus
        var subMenus = menu.getMenus();
        for (var i = 0; i < subMenus.length; i++){
          this.uncheckAllMenus(subMenus[i]);
        }
      },
      getTreeNodes: function(){
        return this._treeNodes;
      },
      setMenu: function(data){
        this._menu = data;
      },
      getMenu: function(){
        return this._menu;
      },
      findMenuById: function(id){
        return _find(this.getMenu(), id);
      },
      preload: function(id){

        mnRoot = menu_broker.getMenu(); // root
        if(!_preload(mnRoot)){
          log('The requested id can\'t be found!');
          showModalMsgAuto('The requested layer can\'t be found!', 'danger');
        }

        function _preload(m){
          var node = m.getNode();
          if(node && node.getId() === id){
            node.show();
            node.getMenu().check();
            return true;
          }else{
            var menus = m.getMenus();
            for (var i = 0; i < menus.length; i++) {
              if(_preload(menus[i])){
                return true;
              }
            }
          }
          return false;
        } // end function _preload
      }  // end function preload
    };
    return o;
  }

  return (function(){
    if(!instance){
      showModalMsg('Loading Meta Broker...');
      instance = createInstance();
    }
    return instance;
  })();
})();

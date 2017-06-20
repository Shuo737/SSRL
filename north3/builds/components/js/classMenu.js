// constructor
global.Menu = function(config){
  // constructor

  this._id = null;
  this._name = null;
  this._data = false; // data flag
  // this._children = [];
  this._menus = [];
  this._title = null;
  this._scale = null;
  this._node = null;

  if(checkMustKeys(config,['text'])){
    for(var p in config){
      if(config.hasOwnProperty(p) && (p !== 'children')){
        this['_' + p] = config[p];
      }
    }
  }else{
    console.log('Failed to create Node object.');
  }
};

global.Menu.prototype.getId = function(){
  return this._id;
};

global.Menu.prototype.getName = function(){
  return this._text;
};

global.Menu.prototype.getNote = function(){
  return this._desc;
};

global.Menu.prototype.getAbbr = function(){
  return this._abbr;
};

global.Menu.prototype.getWidth = function(){
  return this._width;
};

global.Menu.prototype.getServerConfig = function(){
  return this._server;
};

global.Menu.prototype.getTitle = function(){
  var caption = this._title;
  if(!caption){
    if(this._abbr){
      caption = this._abbr;
    }else{
      caption = this._text;
    }
    var p = this.getParent();
    while (p.getName() !== 'root'){
      caption = (p.getAbbr() || p.getName()) + ' > ' + caption;
      p = p.getParent();
    }
  }

  return caption;
};

global.Menu.prototype.addMenu = function(data){
  this._menus.push(data);
  // data._parent = this;
};

global.Menu.prototype.setParent = function(data){
  if(this._parent){
    throw 'I already have my parent defined!';
  }else{
    this._parent = data;
  }
};

global.Menu.prototype.getParent = function(){
  return this._parent;
};

global.Menu.prototype.getParents = function(){
  var parents = [];
  var p = this.getParent();
  while(p && (p.getName() !== 'root')){
    parents.push(p);
    p = p.getParent();
  }
  return parents.reverse();
};

global.Menu.prototype.getMenus = function(){
  return this._menus;
};

global.Menu.prototype.checkDataFlag = function(){
  return !!this._server;
};

global.Menu.prototype.setNode = function(data){
  this._node = data;
};

global.Menu.prototype.getNode = function(){
  return this._node;
};

global.Menu.prototype.check = function(){
  
  var  tick_n = 100, // timeout: 10 seconds
       tick_i = 0,
      node_id = this._node.getId(),
         node = $('#' + node_id);
          
  if(!node.length){
    var intv = setInterval(function(){
      node = $('#' + node_id);
      if(node.length){
        clearInterval(intv);
        node.find('.icon-check-empty')
            .removeClass('icon-check-empty')
            .addClass('icon-check');
        return;
      }else{
        tick_i ++;
        // console.log('tick', tick_i);
        if(tick_i >= tick_n){
          clearInterval(intv);
          console.log('Timeout to check on this menu in TOC.');
        }
      }
    }, 100);
  }else{
    node.find('.icon-check-empty')
      .removeClass('icon-check-empty')
      .addClass('icon-check');
  }
};

global.Menu.prototype.uncheck = function(){
  $('#' + this._node.getId() + ' .icon-check')
    .removeClass('icon-check')
    .addClass('icon-check-empty');
};

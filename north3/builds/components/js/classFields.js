global.Fields = function(node, fields){
  // constructor
  this._node = node;
  this._fields = fields;
  return this;
};

global.Fields.prototype.find = function(id){
  for (var i = 0; i < this._fields.length; i++) {
    if(this._fields[i] === id){
      return this._fields[i];
    }
  }
  return null;
};

global.Fields.prototype.findId = function(name, year){
  for (var i = 0; i < this._fields.length; i++) {
    if(this._fields[i].name == name && this._fields[i].year == year){
      return this._fields[i];
    }
  }
  return null;
};

global.Fields.prototype.filterFields = function(year){
  var res = [];
  for (var i = 0; i < this._fields.length; i++) {
    if(this._fields[i].year == year){
      res.push(this._fields[i]);
    }
  }
  return res;
};

global.Fields.prototype.filterDefaultFields = function(){
  var res = [];
  for (var i = 0; i < this._fields.length; i++) {
    if(this._fields[i].name == this._node.getDefaultField()){
      res.push(this._fields[i]);
    }
  }
  return res;
};

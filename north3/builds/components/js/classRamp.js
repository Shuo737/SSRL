if(!global.d3) {
  global.d3 = require('d3');
}
global.Ramp = function(config){
  // constructor

  this._colors = [];
  this._userColors = [];

  if(checkMustKeys(config,['chartType', 'count', 'index'])){
    for(var p in config){
      if(config.hasOwnProperty(p)){
        this['_' + p] = config[p];
      }
    }

    // generate colors
    var i;
    var n = this._count;

    var c10 = d3.scale.category10().range();
    // log(c10(0));
    // var cs = [];
    // for (i = 0; i < 10; i++) {
    //   cs.push(c10(i));
    // }
    // console.log(cs.join(' '));

    var _ramp;
    var c20b = d3.scale.category20b();
    var grays = ['#636363', '#969696', '#bdbdbd', '#d9d9d9'];

    switch (this._chartType){
      case 'pie':
        if(n < 10){
          for (i = 0; i < n; i++) {
            this._colors.push(c10[i]);
          }
        }else if(n < 20){

          for (i = 0; i < n; i++) {
            this._colors.push(c20b(i));
          }
        }else if(n < 24){
          for (i = 0; i < 20; i++) {
            this._colors.push(c20b(i));
          }
          for (i = 0; i < n - 20; i++) {
            this._colors.push(grays[i]);
          }
        }else{
          throw 'Too many classes!\n\nn = ' + n;
        }
        break;
      case 'bar':

        _ramp = d3.scale.linear().domain([0, n]).range(['#ecdfb7', c10[this._index % 10]]);
        // console.log('this._index: ' + this._index + c10[this._index % 10]);

        for (i = 0; i < n; i++) {
          this._colors.push(_ramp(i));
        }

        // var total = ramp_broker.getBarColors();
        // var base = total[this._index % total.length];
        // _ramp = d3.scale.linear().domain([0,n]).range(base);
        // for (i = 0; i < n; i++) {
        //   this._colors.push(_ramp(i));
        // }
        break;
      default:
        console.log('%c Error: %c Unrecognized chart type!', 'background:#000; color:#f00', 'color:#f00');
    }

  }else{
    console.log('Failed to create Ramp object.');
  }
};

global.Ramp.prototype.getColors = function(){
  if(this.getUserColors().length){
    return this.getUserColors();
  }else{
    return this._colors;
  }
};

global.Ramp.prototype.setUserColors = function(colors){
	this._userColors = colors;
};

global.Ramp.prototype.getUserColors = function(){
	return this._userColors;
};

global.Ramp.prototype.getColor = function(i){
  if(this.getUserColors().length){
    return this.getUserColors()[i];
  }else{
    return this.getColors[i];
  }
};

global.Ramp.prototype.getUserColor = function(i){
	return this._userColors[i];
};


global.Ramp.prototype.getChartType = function(){
	return this._chartType;
};

global.Ramp.prototype.getIndex = function(){
	return this._index;
};

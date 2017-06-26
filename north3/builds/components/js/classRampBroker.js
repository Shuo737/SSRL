global.ramp_broker = (function(){
  // constructor

  var _barRamps = [];
  var _barRampsAvailIds = [];
  var _realPieRamps = [];
  var _realPieRampsAvailIds = [];
  var _choropRamps = [];
  var _barColors = [
    ['#ecdfb7', '#960000'],  /* red */
    ['#ecdfb7', '#964B00'],  /* orange */
    ['#ecdfb7', '#009600'],  /* green */
    ['#ecdfb7', '#00969B'],  /* cyan */
    ['#ecdfb7', '#004E9C'],  /* blue */
    ['#ecdfb7', '#4E009C'],  /* purple */
    ['#ecdfb7', '#9C009C'],  /* magenta */
    ['#ecdfb7', '#969600'],  /* yellow */
  ];

  // init sample ramps
  return {
    getBarColors: function(){
      return _barColors;
    },
    findRamp: function(chartType, rampIndex){
      var r = null;
      switch (chartType) {
        case 'bar':
          r = _barRamps;
          break;
        case 'pie':
          r = _realPieRamps;
          break;
        case 'chorop':
          r = _choropRamps;
          break;
        default:
          throw 'Unrecognized chartType.';
      }

      if((r instanceof Array) && (r.length > rampIndex)){
        return r[rampIndex];
      }else{
        console.log('Ramp not found!');
        return null;
      }
    },
    recycleRamp: function(ramp){
      switch (ramp.getChartType()) {
        case 'pie':
          _realPieRampsAvailIds.push(ramp.getIndex());
          _realPieRampsAvailIds.sort();
          _realPieRamps.splice(ramp.getIndex(), 1);
          break;
        case 'bar':
          _barRampsAvailIds.push(ramp.getIndex());
          _barRampsAvailIds.sort();
          _barRamps.splice(ramp.getIndex(), 1);
          break;
        default:

      }
    },
    createBarRamp: function(config){
      if(_barRampsAvailIds.length){
        config.index = _barRampsAvailIds.splice(0, 1);
      }else{
        config.index = _barRamps.length;
      }
      config.chartType = 'bar';
      var r = new Ramp(config);
      if(r){
        _barRamps.push(r);
        return r;
      }else{
        return null;
      }
    },
    createRealPieRamp: function(config){
      config.index = _realPieRamps.length;
      config.chartType = 'pie';
      var r = new Ramp(config);
      if(r){
        _realPieRamps.push(r);
        return r;
      }else{
        return null;
      }
    },
    overrideRealPieRamp: function(config){
      config.ramp.setUserColors(config.colors);
    },
    createChoropRamp: function(config){
      config.index = _choropRamps.length;
      config.chartType = 'chorop';
      var r = new Ramp(config);
      if(r){
        _choropRamps.push(r);
        return r;
      }else{
        return null;
      }
    },
    getBarDotColor: function(barIndex, dotIndex){
      var r = this.findRamp('BarRamp', barIndex);
      if(r.length > dotIndex){
        return r[dotIndex];
      }
      throw "Color not found!";
    },
    getChoropDotColor: function(choropIndex, dotIndex){
      var r = this.findRamp('choropRamp', choropIndex);
      if(r.length > dotIndex){
        return r[dotIndex];
      }
      throw "Color not found!";
    },
    getRealPieDotColor: function(pieIndex, catIndex, dotIndex){
      var r = this.findRamp('RealPieRamp', pieIndex);
      if(r.length > catIndex){
        var r2 = r[catIndex];
        if(r2.length > dotIndex){
          return r2[dotIndex];
        }
      }
      throw "Color not found!";
    }
  }; // end return
})();

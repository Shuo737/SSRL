global.geo_broker = (function(){

  var _geo;

  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: 'lib/geo.php'
    }).done(function(data){
      _geo = data;
  });

  return {
    getGeo: function(){
      return _geo;
    }
  };

})();

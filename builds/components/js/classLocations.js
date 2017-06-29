global.Locations = function(){

  /*  config starts here */
  var _gps = {
    'id': 'marker_gps',
    'title': 'You are here',
    'symbol': 'harbor',
    // 'latLng': [0, 0],
    'icon': {
      'url': 'img/marker_gps.png',
      'size': [32, 37]
    },
    'on' : 0
  };
  var _dest = {
    'id': 'marker_dest',
    'title': 'Destination',
    'symbol': 'monument',
    // 'latLng': [3, 0],
    'icon': {
      'url': 'img/marker_info.png',
      'size': [32, 37]
    },
    'on': 0
  };
  /*  config ends here */

  function _makeMarker(config){
    var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(' + config.icon.url + ')';
        el.style.width = config.icon.size[0] + 'px';
        el.style.height = config.icon.size[1] + 'px';

        el.addEventListener('click', function() {
            window.alert(config.icon.title);
        });
    return new mapboxgl.Marker(el, {
      offset: [-config.icon.size[0] / 2, -config.icon.size[1] / 2]
    });
  }

  function _getDistanceFromLatLonInKm(p1, p2) {
    var lat1 = p1.lat;
    var lon1 = p1.lng;
    var lat2 = p2.lat;
    var lon2 = p2.lng;
    var R = 6371; // Radius of the earth in km
    var dLat = _deg2rad(lat2-lat1);  // deg2rad below
    var dLon = _deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  function _deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  var _marker_gps = _makeMarker(_gps),
      _marker_dest = _makeMarker(_dest);

  return{

    checkGPS: function(){
      return !!_gps.on;
    },

    calcDist: function(){
      var p1 = _marker_gps.getLngLat();
      var p2 = _marker_dest.getLngLat();
      return _getDistanceFromLatLonInKm(p1, p2);
    },

    showGPS: function(coords){

      // add user's gps marker
      _marker_gps.setLngLat(coords);
      _marker_gps.addTo(map);
      _gps.on = 1;
      // hide modal msg if available
      hideModalMsg();
    },
    hideGPS: function(){
      _marker_gps.remove();
      _gps.on = 0;
    },
    showDest: function(coords){
      if(coords && coords instanceof Array){
        _marker_dest.setLngLat(coords);
        _marker_dest.addTo(map);

        // report the distance
        var dist = this.calcDist();
        showModalMsgAuto('Distance: ' + dist.toFixed(1) + 'km.');

        // hide modal msg if available
        // hideModalMsg();
      }else{
        console.log('Error: latLng not set!');
      }

    },
    hideDest: function(){
      _marker_dest.remove();
    }
  };
};

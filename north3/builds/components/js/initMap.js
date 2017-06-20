require('leaflet');
global.$ = require('jquery');
require('jquery-touch-events');

if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}

/* initialize the map */
function initMap() {

  lyrGoogleHack = L.tileLayer('http://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&scale=2', {
      attribution: 'Tiles &copy; Google',
      tms: false,
      subdomains: '0123', // randomly fetch tiles from the server, basically replace {s} with these values
    });

  var lyrCanada = L.tileLayer('http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    tms: false
  });
  
  var lyrImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
  });
  
  var lyrEsriTopo = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    // attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    // detectRetina:true,
  });
  
  var lyrLandscape = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    attribution: 'Tiles &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>'
  });
  
  var lyrOSM_Gray = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  
  var lyrLight = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    // tileSize: 128,
    // detectRetina:true,
    maxZoom: 13
  });

var lyrHere = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day/{z}/{x}/{y}/512/png8?app_id={app_id}&app_code={app_code}&ppi=320', {
    attribution: 'Map &copy; <a href="http://developer.here.com">HERE</a>',
    subdomains: '1234',
    mapID: 'newest',
    app_id: '7MRN2pV3o6K5gyzhx00s', // 'Y8m9dK2brESDPGJPdrvs',
    app_code: '-JFJwmOGPbyLynt6D1puag', // 'dq2MYIvjAotR8tHvY8Q_Dg',
    base: 'base',
    maxZoom: 20
  });
  
  global.map = L.map('map',{
    center: DEFAULT.map.center,
    zoom: DEFAULT.map.zoom,
    minZoom: DEFAULT.map.min_zoom,
    maxZoom: DEFAULT.map.max_zoom,
    // doubleClickZoom: false,
    layers: [lyrGoogleHack],
    zoomControl: false
  });
  
  global.map.baseLayers = {
    layers:{
      'Popular':{
        'Google Map': {
          layer: lyrGoogleHack,
          thumb: 'img/basemap_google.jpeg'
        },
        'Canada Base Map': {
          layer: lyrCanada,
          thumb: 'img/basemap_canada.jpeg'
        },
        'ESRI Topography': {
          layer: lyrEsriTopo,
          thumb: 'img/basemap_topo.jpeg'
        },
        'Here Maps': {
          layer: lyrHere,
          thumb: 'img/basemap_here.png'
        }
      },
      'Other':{
        'Satellite Imagery': {
          layer: lyrImagery,
          thumb: 'img/basemap_imagery.jpeg'
        },
        'Landscape': {
          layer: lyrLandscape,
          thumb: 'img/basemap_landscape.png'
        },
        'Light Background': {
          layer: lyrLight,
          thumb: 'img/basemap_light.jpeg'
        },
        'Grayscale Map': {
          layer: lyrOSM_Gray,
          thumb: 'img/basemap_gray.png'
        },
      }
    },
    default: 'Google Map',
    checked: 'Google Map',
    find: function(id){
      for(var groupId in this.layers){
        var g = this.layers[groupId];
        for(var lyrId in g){
          if(lyrId === id){
            return g[lyrId].layer;
          }
        }
      }
      return null;
    }
  };
  
  (new L.control.zoom({ position: 'topright'})).addTo(map);

  /* map events */
  global.map.on('moveend',function(e){
    $('#coordinate').html(map.getCenter().lat.toFixed(5) + ', ' + map.getCenter().lng.toFixed(5));
    // redraw_broker.redrawLayers();
  });
  global.map.on('zoomend',function(e){
    // redrawSvgStroke('.svg-layer g', 2);
    redrawSvgMarker();
  });
}

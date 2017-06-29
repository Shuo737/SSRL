global.mapboxgl = require('mapbox-gl');
// require('mapbox-gl-draw');

function initMap(){

  global.map = new mapboxgl.Map({
    container: 'map',
    center: DEFAULT.map.center,
    zoom: DEFAULT.map.zoom,
    attributionControl: false,
    infoControl: true,
      "layout": {
        "icon-image": "{icon}-15",
        "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
      },
    style: 'gl-styles/styles/style_new.json'
    // https://gis1test.usask.ca/soil-db/gl-styles/styles/osm-bright/style.json
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
  // map.addControl(new mapboxgl.Scale({position: 'bottom-right'})); // position is optional

  // draw control (eg. for interactive selection)
  // var draw = mapboxgl.Draw({
  //     drawing: true, // the ability to draw and delete features - default: true
  //     keybindings: true, // Keyboard shortcuts for drawing - default: true
  //     boxSelect: true, // If true, shift + click to features. If false, click + select zooms to area - default: true
  //     clickBuffer: 2, // On click, include features beyond the coordinates of the click by clickBuffer value all directions - default: 2
  //     displayControlsDefault: false, // Sets default value for the control keys in the control option - default true
  //     controls: {
  //         point: true,
  //         polygon: true,
  //         trash: true
  //     }
  // });
  // map.addControl(draw);

  map.on('load', function () {

    // load 2 markers: gps & destination
    global.locations = new global.Locations();

    // add a test layer
    map.addSource('basemaps',{
      type: 'vector',
      // tiles: ['http://gis1test.usask.ca:8081/basemaps/{z}/{x}/{y}']
      tiles: ['https://gis1test.usask.ca/v/basemaps/{z}/{x}/{y}']
    });

    map.addSource('project1',{
      type: 'vector',
      // tiles: ['http://gis1test.usask.ca:8082/project1/{z}/{x}/{y}']
      tiles: ['https://gis1test.usask.ca/v/project1/{z}/{x}/{y}']
    });

    map.addSource('project2',{
      type: 'vector',
      tiles: ['https://gis1test.usask.ca/v/project2/{z}/{x}/{y}']
    });

    map.addSource('basemaps_Nigeria_elev',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Nigeria/elev/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Nigeria_prcp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Nigeria/prcp/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Nigeria_temp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Nigeria/temp/{z}/{x}/{y}'],
      tileSize: 256
    });

    map.addSource('basemaps_Niger_elev',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Niger/elev/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Niger_prcp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Niger/prcp/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Niger_temp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Niger/temp/{z}/{x}/{y}'],
      tileSize: 256
    });

    map.addSource('basemaps_Benin_elev',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Benin/elev/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Benin_prcp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Benin/prcp/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Benin_temp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Benin/temp/{z}/{x}/{y}'],
      tileSize: 256
    });

    map.addSource('basemaps_Mali_elev',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Mali/elev/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Mali_prcp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Mali/prcp/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_Mali_temp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/Mali/temp/{z}/{x}/{y}'],
      tileSize: 256
    });

    map.addSource('basemaps_BurkinaFaso_elev',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/BurkinaFaso/elev/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_BurkinaFaso_prcp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/BurkinaFaso/prcp/{z}/{x}/{y}'],
      tileSize: 256
    });
    map.addSource('basemaps_BurkinaFaso_temp',{
      type: 'raster',
      tiles: ['https://gis1test.usask.ca/r/basemaps/BurkinaFaso/temp/{z}/{x}/{y}'],
      tileSize: 256
    });

    // when the map is initialized, we add each vector layer's placeholder. This is significant for their drawing order.
    layer_broker.initLayers();

  }); // end map.onload

  map.on('mousemove', function(e){

    // update coordinates
    $('#coordinate').html([e.lngLat.lng.toFixed(5), e.lngLat.lat.toFixed(5)].join(', '));

    // show feature's info

    var features = map.queryRenderedFeatures(e.point, { layers: layer_broker.getLayerIds() });
    map.getCanvas().style.cursor = features.length ? 'pointer' : '';

  }); // end map.mousemove

  map.on('click', function(e){
    // if GPS tool is enabled, then measure distance
    if(global.locations.checkGPS()){
      global.locations.showDest([e.lngLat.lng, e.lngLat.lat]);
    }else{ // feature's info-panel
      var features = map.queryRenderedFeatures(e.point, {layers: layer_broker.getLayerIds() });
      InfoPanel.show({features: features});
    }
  });
}

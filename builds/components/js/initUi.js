if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}
require('bootstrap');
require('bootstrap-toggle');
require('jstree');

global.map = null;

function initTreeView(){
  var mouseOverHandler = function(e) {
    return function(e, hoverIndex){

    };
  };

  var mouseOutHandler = function(e) {
    return function(){

    };
  };

  var mouseUpHandler = function(e) {
    return function(){
      console.log('mouse up');
    };
  };

  // event handlers
  var clickHandler = function(e){
    return function(){
      console.log('mouse click');
    };
  };

  $('#tree').jstree({
    "types": {
      "database": {
        "icon": DEFAULT.icons.tree_database[0]
      },
      "dataset":{
        "icon": DEFAULT.icons.tree_dataset[0]
      },
      "point":{
        "icon": DEFAULT.icons.tree_point[0]
      },
      "line":{
        "icon": DEFAULT.icons.tree_line[0]
      },
      "polygon":{
        "icon": DEFAULT.icons.tree_polygon[0]
      },
      "raster":{
        "icon": DEFAULT.icons.tree_raster[0]
      },
    },
    'core' : {
      'data' : meta_broker.getTreeTOC()
    },
    "plugins" : [
      "types"
    ]
  })
  .on('load_node.jstree', function(e, data){
    // for (var i = 0; i < data.node.children_d.length; i++) {
    // 	var id = data.node.children_d[i];
    // 	var orig = global.tree.get_node(id).original;
    //   var item = $('#' + orig.id + '_anchor');
    //   if(item.length > 0){
    //     item
    //       .on('click', clickHandler.call(this, event))
    //       .on('mouseover', mouseOverHandler.call(this, event))
    //       .on("mousewheel DOMMouseScroll mouseout", mouseOutHandler.call(this, event))
    //       .on("mouseup", mouseUpHandler.call(this, event));
    //   }
    // }
  }) // end load_node.jstree
  .on('select_node.jstree', function(e, data){

    var node = data.node.original;
    var nodeType = node.type;

    // var anchor = $('#' + node.id + '_anchor');

    if(nodeType == 'action-download'){ // download node

      var _type, _project, _country, _layer;

      // figure out data type
      var p_id = data.node.parent;
      var p = tree.get_node(p_id);
      _type = 'raster';
      if(p.type !== 'raster')
        _type = 'vector';

      // figure out project number, note that the root element is #
      // while(p.parent !== '#'){
      //   p = tree.get_node(p.parent);
      // }
      // _project = p.id;
      _project = p.original.project;
      _country = p.original.country;
      _layer = p.original.layer;

      // figure out country and layer id
      // var arrIds = p_id.split('-');
      // if(arrIds.length == 2){
      //   _country = arrIds[0];
      //   _layer = arrIds[1];
      // } else if(arrIds.length == 1){
      //   _country = null;
      //   _layer = p_id;
      // } else{
      //   throw "Node's ID should be {country_layer} or {layer}";
      // }

      var _config = {
        project: _project,
        layer: _layer,
        type: _type
      };
      if(_country !== '_'){
        _config.country = _country;
      }

      file_broker.download(_config);
    }else{
      if(/^(point|line|polygon|raster)$/.test(nodeType)){ // feature class nodes

        var icoEmpty = global.DEFAULT.icons['tree_' + nodeType][0];
        var icoCheck = global.DEFAULT.icons['tree_' + nodeType][1];

        if(!node.on){
          // menu_broker.findMenuById(node.id).getNode().show();

          $('#' + node.id + '_anchor' + ' .jstree-themeicon-custom')
          .css('background-image', 'url(' + icoCheck + ')');

          if(!node.dataLayer){

            if(data.node.type === 'raster'){
              node.dataLayer = new RasterLayer(node);
            }else{
              if(node.layer === 'soil'){
                node.dataLayer = new SoilLayer(node);
              }else{
                node.dataLayer = new VectorLayer(node);
              }
            }
          }

          layer_broker.addLayer(node.dataLayer);
          node.dataLayer.show();
          node.on = true;
        }else{
          // menu_broker.findMenuById(node.id).getNode().hide();

          $('#' + node.id + '_anchor' + ' .jstree-themeicon-custom')
            .css('background-image', 'url(' + icoEmpty + ')');

          layer_broker.removeLayer(node.dataLayer);
          node.dataLayer.hide();
          node.on = false;
        } // end else
      }else{
        // if(global.tree.is_open(data.node)){
        //   global.tree.close_node(data.node);
        // }else{
        //   global.tree.open_node(data.node);
        // }
      } // end else
    } // end else (feature class nodes)

  }) // end select_node.jstree
  .on('open_node.jstree', function(e,data){
    // global.tree.set_icon(data.node, DEFAULT.icons.tree_folder_open);
  }) // end open_node.jstree
  .on('close_node.jstree', function(e,data){
    // global.tree.set_icon(data.node, DEFAULT.icons.tree_folder_close);
  }); // end close_node.jstree

  global.tree = $('#tree').jstree(true);

} // end initTreeView

function updateLayout(){
  var contentH = getContentHeight();
  // $('#layout').css('height', contentH + 'px');
  var tocTitle = $('#tree-wrapper>.title').outerHeight();
  $('#tree-wrapper').css('height', contentH + 'px');
  $('#tree').css('height', (contentH - tocTitle) + 'px');
}

function initToggleBaseLayer(){
  var arrWater = [
    'waterway',
    'waterway_river',
    'waterway_stream_canal',
    'water',
    'water_offset',
    'water_pattern',
    'water_label',
    'marine_label_line_4',
    'marine_label_4',
    'marine_label_line_3',
    'marine_label_point_3',
    'marine_label_line_2',
    'marine_label_point_2',
    'marine_label_line_1',
    'marine_label_point_1'
  ];

  var arrLandUse = [
    'landuse_overlay_national_park',
    'landuse_park',
    'landuse_cemetery',
    'landuse_hospital',
    'landuse_school',
    'landuse_wood'
  ];

  var arrTraffic = [
    'aeroway_fill',
    'aeroway_runway',
    'aeroway_taxiway',
    'tunnel_motorway_link_casing',
    'tunnel_service_track_casing',
    'tunnel_link_casing',
    'tunnel_street_casing',
    'tunnel_secondary_tertiary_casing',
    'tunnel_trunk_primary_casing',
    'tunnel_motorway_casing',
    'tunnel_path_pedestrian',
    'tunnel_motorway_link',
    'tunnel_service_track',
    'tunnel_link',
    'tunnel_street',
    'tunnel_secondary_tertiary',
    'tunnel_trunk_primary',
    'tunnel_motorway',
    'tunnel_major_rail',
    'tunnel_major_rail_hatching',
    'road_motorway_link_casing',
    'road_service_track_casing',
    'road_link_casing',
    'road_street_casing',
    'road_secondary_tertiary_casing',
    'road_trunk_primary_casing',
    'road_motorway_casing',
    'road_path_pedestrian',
    'road_motorway_link',
    'road_service_track',
    'road_link',
    'road_street',
    'road_secondary_tertiary',
    'road_trunk_primary',
    'road_motorway',
    'road_major_rail',
    'road_major_rail_hatching',
    'bridge_motorway_link_casing',
    'bridge_service_track_casing',
    'bridge_link_casing',
    'bridge_street_casing',
    'bridge_secondary_tertiary_casing',
    'bridge_trunk_primary_casing',
    'bridge_motorway_casing',
    'bridge_path_pedestrian',
    'bridge_motorway_link',
    'bridge_service_track',
    'bridge_link',
    'bridge_street',
    'bridge_secondary_tertiary',
    'bridge_trunk_primary',
    'bridge_motorway',
    'bridge_major_rail',
    'bridge_major_rail_hatching',
    'rail_station_label',
    'airport_label',
    'road_label',
    'road_label_highway_shield'
  ];

  var arrAdmin1 = [
    'country_label_4',
    'country_label_3',
    'country_label_2',
    'country_label_1',
    'admin_level_2',
    'admin_level_2_disputed',
    'admin_level_2_maritime'
  ];

  var arrAdmin2 = [
    'admin_level_3',
    'admin_level_3_maritime',
    'place_label_other',
    'place_label_village',
    'place_label_town',
    'place_label_city'
  ];

  $('footer .base-layer [type="checkbox"]').change(function(){
    var me = $(this);
    switch (me.attr('data-id')) {
      case 'water':
        $.map(arrWater, function(val, i){
          console.log('turning off ' + val + ' ' + (me.is(':checked') ? 'visible' : 'none'));
          global.map.setLayoutProperty(val, 'visibility', me.is(':checked') ? 'visible' : 'none');
        });
        break;
      case 'landuse':
        $.map(arrLandUse, function(val, i){
          map.setLayoutProperty(val, 'visibility', me.is(':checked') ? 'visible' : 'none');
        });
        break;
      case 'traffic':
        $.map(arrTraffic, function(val, i){
          map.setLayoutProperty(val, 'visibility', me.is(':checked') ? 'visible' : 'none');
        });
        break;
      case 'admin-1':
        $.map(arrAdmin1, function(val, i){
          map.setLayoutProperty(val, 'visibility', me.is(':checked') ? 'visible' : 'none');
        });
        break;
      case 'admin-2':
        $.map(arrAdmin2, function(val, i){
          map.setLayoutProperty(val, 'visibility', me.is(':checked') ? 'visible' : 'none');
        });
        break;
      default:

    } // end of switch
  });

}

function initGPS(){
  $('#gps').bootstrapToggle({
    on: '<span class="icon icon-direction"></span> Hide GPS',
    off: '<span class="icon icon-direction"></span> Show GPS',
    width: '125px'
  }).change(function(){

    // GPS location tacking turned on
    if($(this).prop('checked')){
      showModalMsg('Locating...');
      // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
      // https://github.com/mapbox/mapbox-gl-js/blob/1da7a4e99bdd0f9f9639b79a20ad21e1beaea634/js/ui/control/geolocate_control.js#L54-L142
      // https://www.mapbox.com/mapbox-gl-js/api/#Map
      // https://www.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
      // http://gistest.usask.ca/%5barchive%5d%20north%20project/north/
      var gps_id = window.navigator.geolocation.getCurrentPosition(
        // success
        function(pos){
          var coord = pos.coords;
          console.log(coord.longitude + ',' + coord.latitude);
          global.locations.showGPS([coord.longitude, coord.latitude]);
        },
        // error
        function(err){
          console.warn('ERROR(' + err.code + '): ' + err.message);
        },
        // options
        options = {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 5000
        }
      );

    // GPS location tacking turned on
    }else{
      navigator.geolocation.clearWatch(map.gps_id);
      locations.hideGPS();
      locations.hideDest();
    }

  });
}

function initToc(){
  $('#toc').bootstrapToggle({
    on: '<span class="icon icon-sitemap"></span> Show TOC',
    off: '<span class="icon icon-sitemap"></span> Hide TOC',
    width: '125px'
  }).change(function(){
    var tree = $('#tree-wrapper');
    if($(this).prop('checked')){
      tree.stop(true, true).animate({
        'left': '-' + tree.css('width')
      }, 300);
    }else{
      tree.stop(true, true).animate({
        'left': '0px'
      }, 300);
    }
  });
}

function initBookmarks(){
  $('.bookmark [data-center]').click(function(){
    var me = $(this);
    map.flyTo({
      center: me.attr('data-center').split(','),
      zoom: me.attr('data-zoom'),
      pitch: 0,
      speed: 1.2,
      curve: 1
    });
  });
}

function init_ui(){
  showModalMsg('Initializing the User Interface...');

  // update layout
  updateLayout();

  $(window).resize(function() {
    updateLayout();
  });

  initTreeView();

  // bottom toolbar
  initBookmarks();
  initToc();
  initToggleBaseLayer();
  initGPS();
  initMap();

  hideModalMsg();
  console.log('Initialized: GUI');
  /*** events ***/

  // info panel
  $('#info-panel .minimize').click(function(){
    $(this).hide();
    InfoPanel.hideContent();
    // $('#info-panel').css('top', 'initial');
    // $('#info-panel .panel-content').hide();
    // $('#info-panel .maximize').show();
  });
  $('#info-panel .maximize').click(function(){
    $(this).hide();
    InfoPanel.showContent();
    // $('#info-panel').css('top', '');
    // $('#info-panel .panel-content').show();
    // $('#info-panel .minimize').show();
  });

} // end of init_ui

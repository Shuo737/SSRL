if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}

require('bootstrap');
require('bootstrap-toggle');
require('bootstrap-select');
require('jstree');

function initTreeView(){

  var mouseOverHandler = function(e) {
    return function(e, hoverIndex){
      var me;

      // remove previous toolitp
      var tip = $.data(this, 'tooltip');
      if(tip){
        tip.hide();
        $.removeData(this, 'tooltip');
      }

      var content = $.data(this, 'tooltip_content');
      $.data(this, 'tooltip', new TooltipDiv());
      $.data(this, 'tooltip').show($(this),content);
    };
  };

  var mouseOutHandler = function(e) {
    return function(){

      // remove hovering tooltip
      var t = $.data(this, 'tooltip');
      if(!t) return;

      $.data(this, 'tooltip').hide();
      $.removeData(this, 'tooltip');
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

  $('.tree-view').jstree({
    "types": {
			"cat": {
				"icon": DEFAULT.icons.tree_group
			},
			"group": {
				// "icon": "fa fa-folder-open-o"
				"icon": DEFAULT.icons.tree_folder_close
			},
			"item": {
				"icon": DEFAULT.icons.tree_item
			}
		},
		// "plugins" : [ "wholerow", "checkbox" ],
		"plugins" : [
			"types",
			// , "wholerow"
			"search"
		],
		'core' : {
			'data' : menu_broker.getTreeNodes()
		}
  }) // end jstree
  .on('load_node.jstree', function(e, data){
  	for (var i = 0; i < data.node.children_d.length; i++) {
  		var id = data.node.children_d[i];
  		var orig = global.tree.get_node(id).original;
  		if(orig.server){
  			var ch = chart_config.getChart(orig.server.chart).icon;
  			var yr = orig.year || '';
  			var desc = orig.desc || '';
        desc = desc.replace(/<ul\>(.(?!\/ul\>))+(<\/ul\>)/gi, '<div class = "more"> Turn on the layer to show more info...</div>');

  			var cont = '<h3>' + orig.text + '</h3><table>';
  			cont += '<tr><td>Chart</td><td>' + ch + '<td></tr>';
  			cont += '<tr><td>Years</td><td>' + yr.join(', ') + '</td></tr>';
  			cont += '<tr><td>Desc</td><td>' + desc + '</td></tr></table>';

  			// setupTooltipDiv(item, cont, !1);
        var item = $('#' + orig.id + '_anchor');
        if(item.length > 0){
          item.addClass('data');
          $.data(item[0], 'tooltip_content', cont);

          item
            .on('click', clickHandler.call(this, event))
            .on('mouseover', mouseOverHandler.call(this, event))
            .on("mousewheel DOMMouseScroll mouseout", mouseOutHandler.call(this, event))
            .on("mouseup", mouseUpHandler.call(this, event));
        }
  		}
  	}
  }) // end load_node.jstree
  .on('select_node.jstree', function(e, data){
    var node = data.node.original;
    if(global.tree.is_leaf(data.node)){ // we try to load the data for leaf nodes.
      var mattNode = menu_broker.findMenuById(node.id).getNode();
      if(!mattNode.getShow()){
        mattNode.show();
      }else{
        mattNode.hide();
        // global.hideVar(node);
        // $('#' + node.id + '_anchor')
        //   .find('.fa-check-square-o')
        //   .removeClass('fa-check-square-o')
        //   .addClass('fa-square-o');
      }
    }else{ // we open/close this folder nodes.
      if(global.tree.is_open(data.node)){
        global.tree.close_node(data.node);
      }else{
        global.tree.open_node(data.node);
      }
    }
  })
  .on('open_node.jstree', function(e,data){
    global.tree.set_icon(data.node, DEFAULT.icons.tree_folder_open);
    // console.log('node opened', e, data);
    for (var i = 0; i < data.node.children.length; i++) {
      var orig = global.tree.get_node(data.node.children[i]).original;
      if(orig.server){ // && !orig.init
        var ch = chart_config.getChart(orig.server.chart).icon;
        var yr = orig.year || '';
        var desc = orig.desc || '';
        desc = desc.replace(/<ul\>(.(?!\/ul\>))+(<\/ul\>)/gi, '<div class = "more"> Turn on the layer to show more info...</div>');

        var cont = '<h3>' + orig.text + '</h3><table>';
        cont += '<tr><td>Chart</td><td>' + ch + '<td></tr>';
        cont += '<tr><td>Years</td><td>' + yr.join(', ') + '</td></tr>';
        cont += '<tr><td>Desc</td><td>' + desc + '</td></tr></table>';

        var item = $('#' + orig.id + '_anchor');
        if(item.length > 0){
          item.addClass('data');
          $.data(item[0], 'tooltip_content', cont);

          item
            .on('click', clickHandler.call(this, event))
            .on('mouseover', mouseOverHandler.call(this, event))
            .on("mousewheel DOMMouseScroll mouseout", mouseOutHandler.call(this, event))
            .on("mouseup", mouseUpHandler.call(this, event));
        }
      }
    }
  }) // end open_node.jstree
  .on('close_node.jstree', function(e,data){
    global.tree.set_icon(data.node, DEFAULT.icons.tree_folder_close);
    // console.log('node closed', e, data);
  }); // end close_node.jstree

  global.tree = $('.tree-view').jstree(true);
}

// add ability to change base maps
function initMapSwitcher(){
  var select = $('#basemap-switch .selectpicker');
  for(var groupId in map.baseLayers.layers){
    var otpGroup = $('<optgroup label="' + groupId + '">');
    var group = map.baseLayers.layers[groupId];
    for(var lyrId in group){
      var option = $('<option data-content="<img src=\'' + group[lyrId].thumb + '\'>' + lyrId + '">' +lyrId + '</option>');
      otpGroup.append(option);
    }
    select.append(otpGroup);
  }
  select.selectpicker();
  select.change(function(){
    var lyrId = select.selectpicker('val');
    var oldMap = map.baseLayers.find(map.baseLayers.checked || map.baseLayers.default);
    var newMap = map.baseLayers.find(lyrId);
    console.log('Switch basemap to ' + select.selectpicker('val'));
    map.removeLayer(oldMap);
    map.addLayer(newMap);
    map.baseLayers.checked = lyrId;
  });
  
  // add scale effect to basemap thumbnails
  $('#basemap-switch img').hover(function(){
    $(this).stop(true, true).animate({
        width: '4em',
        height: '4em'
      }, 300);
  }, function(){
    $(this).stop(true, true).animate({
        width: '2em',
        height: '2em'
      }, 300);
  });
}

function init_ui(){

  showModalMsg('Initializing the User Interface...');

  updateVersion();

  // init left panel
  initLeftPanel();
  
  // init map switcher
  initMapSwitcher();
  
  // update layout
  updateLayout();
  $(window).resize(function() {
    updateLayout();
  });

  // init tree view
  initTreeView();

  setupBookmarks();

  card_broker.init();

  $('#btnHideAllLayers').click(function(){
    removeAllLayers();
  });

  $('#btnAtlas').click(function(){
    window.open('atlas.pdf', '_blank');
  });

  $('#toc2').bootstrapToggle({
    on: '<i class="icon icon-sitemap"></i> Show TOC',
    off: '<i class="icon icon-sitemap"></i> Hide TOC',
    width: '120px'
  }).change(function(){
    var tree = $('#tree-wrapper');
    if($(this).prop('checked')){
        global.leftPanel.close();
    }else{
      global.leftPanel.open();
    }
  });

  $('#txtSearchComunity').on('keyup',function(e){
    var popup = $('#ui-popup');
    if(e.keyCode == 27){ // ESC
      popup.css('visibility', 'hidden');
		}else{
      $('#btnSearchComunity').trigger('click');
    }
	});

  $('#btnSearchComunity').click(function(){
    var txtBox = $('#txtSearchComunity');
    var popup = $('#ui-popup');
    var txt = txtBox.val().trim();
		if(!txt || txt.length < 2){
      popup.css('visibility', 'hidden');
			return;
		}else{
      var geo = geo_broker.getGeo();
      var content = $('<div class="search-box"></div>');
      var n = 0;
      var clickHandler = function(event){
        return function(){
          var txt = $('#txtSearchComunity');
          var me = $(this);
          var name = me.text();
          var ll = me.attr('data').split(',');
          var lat = ll[0];
          var lng = ll[1];

          popup.css('visibility', 'hidden');

          var p1 = map.latLngToContainerPoint([lat, lng]);
          p1.left = p1.x;
          p1.top = p1.y + getHeaderHeight();
          var p2 = txt.offset();
          p2.left += txt.outerWidth() / 2;
          _showLeadLine(p1, p2, function(){
            var m = L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'cross-box',
                html: '<img class="default" src="img/box.gif">'
              })
            });
            var label = L.marker([lat, lng], {
              icon: L.divIcon({
                html: name,
                className: 'cross-box-label'
              })
            });

            map.addLayer(m);
            map.addLayer(label);

            setTimeout(function(){
              map.removeLayer(m);
              map.removeLayer(label);
            }, 2000);
          });
        };
      };

      for (var i = 0; i < geo.length; i++) {
        var t = geo[i].name;
        if(t.toUpperCase().indexOf(txt.toUpperCase())>-1){
          var s = $('<span data="' + geo[i].lat + ',' + geo[i].lng + '">' + t + '</span>');
          content.append(s);
          s.click(clickHandler.call(s, event));
          n ++;
        }
      } // end for

      if(n){
        popup.html(content)
          .removeClass('s').addClass('n')
				  .css({
  					'left': txtBox.offset().left + 'px',
  					'top': txtBox.offset().top - popup.outerHeight() + 'px',
  					'visibility': 'visible'
  				});
      } // end if
    }
  });

  $('.leaflet-bottom.leaflet-right').on('mousewheel DOMMouseScroll mouseout', function(e){
    e.stopPropagation();
  });

  $('#tip').click(function(){
    window.open('docs/manual.html', '_blank');
  });

  showModalMsg('Initializing the User Interface... Done.');

  hideModalMsg();

  log('left-panel initialized.', 1);

  log('preload...', 1);
  if(preload_var !== ''){
    var n = 1;
    preload_var = preload_var.split(',');
    // if(preload_var.length > n){
    //   preload_var.splice(n);
    // }
    menu_broker.preload(preload_var[0]);
  }else{
    showModalMsgAuto('Loading demo dataset...');
    menu_broker.preload('household_size');
  }
}

function removeAllLayers(){
  var visible_menus = menu_broker.getVisibleMenus();
  if(!visible_menus.length){
    showModalMsgAuto('There are no layers to turned off!', 'danger');
    return;
  }
  var menuTitles = ['<ol>'];
  while (visible_menus.length) {
    menuTitles.push('<li>');
    var menu = visible_menus[visible_menus.length - 1];
    menuTitles.push(chart_config.getChart(menu.getNode().getChartType()).icon);
    menuTitles.push(menu.getTitle());
    menuTitles.push('</li>');
    visible_menus.pop();
  }
  menuTitles.push('</ol>');

  menuTitles = menuTitles.join('');

  var modal = $(['<div class="modal fade config" data-backdrop="static" role="dialog">',
                '<div class="modal-dialog">',
                  '<div class="modal-content">',
                  '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                    '<h4 class="modal-title">',
                      '<i class="icon icon-info-circled"></i>',
                      'Discard Cards',
                    '</h4>',
                  '</div>',
                  '<div class="modal-body">',
                    '<p>Do you really want to turn off these layers from the map?</p>',
                      menuTitles,
                  '</div>',
                  '<div class="modal-footer">',
                      '<button type="button" data="yes" class="btn btn-success">Yes</button>',
                      '<button type="button" data="no" class="btn btn-danger">No</button>',
                  '</div>',
                '</div>',
              '</div>'].join(''));
  modal.on('hidden.bs.modal', function(){
    // remove the modal dialog when its turned off
    modal.remove();
  });

  // bind [Yes] button
  modal.find('[data="yes"]').click(function(){
    menu_broker.uncheckAllMenus();
    modal.modal('hide');
  });

  // bind [No] button
  modal.find('[data="no"]').click(function(){
    modal.modal('hide');
  });

  // append modal to DOM
  $('#layout').append(modal);

  // show the modal dialog
  modal.modal('show').draggable();

}

function updateLayout(){

  var contentH = getContentHeight();

  // $('.tree-view').css('height', contentH + 'px');

  if(map) {
    $('#map').css('height', contentH + 'px');
    map.invalidateSize();
  }

  // legend container's max-height
  var zm = $('.leaflet-control-zoom');
  zm = zm.offset().top - getHeaderHeight() + parseInt(zm.css('height'));
  $('.leaflet-bottom.leaflet-right').css('max-height', contentH - zm - 2 + 'px');

}

function updateVersion(){
  var ver = 'Updated: ' + new Date(document.lastModified).toLocaleDateString();
  $('.version').html(ver);
}

function setupTooltipDiv($obj, msg, isWhite){
  $obj.hover(function(e){
    if(!msg) return;
    $obj.hover = 1;
    $obj.timer = setTimeout(function(){
      if($obj.hover){
        $obj.tooltip = new TooltipDiv(isWhite ? 'white' : '');
        $obj.tooltip.show($obj, (typeof(msg) == 'function' ? msg() : msg));
      }
    }, 500);
  }, function(e){
    $obj.hover = 0;
    if($obj.timer){
      clearTimeout($obj.timer);
      delete $obj.timer;
    }
    if($obj.tooltip && $obj.tooltip.hide){
      $obj.tooltip.hide();
    }
  }).on('destroyed', function(){
    $obj.hover = 0;
    if($obj.timer){
      clearTimeout($obj.timer);
      delete $obj.timer;
    }
    if($obj.tooltip && $obj.tooltip.hide){
      $obj.tooltip.hide();
    }
  });
}

function setupBookmarks(){
  $('.bookmark a').click(function(){
    var me = $(this);
    map.setView(L.latLng(me.attr('data-center').split(',')), me.attr('data-zoom'));
  });
}

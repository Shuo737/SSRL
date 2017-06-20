global.spider_broker = (function(){

  var _spiders = null;
  var me = this;
  var _data_loading = false;
  global.addEventListener('layer-shown', function(e){
    var lyr = e.detail.layer;

    // we don't call spiderfy if this is a redraw event
    if(lyr.getNode().getRedraw()){
      return;
    }else{
      if(['bar', 'pie', 'dot'].indexOf(lyr.getChartType() >= 0)){
        spider_broker.addLayer(lyr);
      }
    }
  });

  global.addEventListener('layer-hide', function(e){
    var lyr = e.detail.layer;
    if(['bar', 'pie', 'dot'].indexOf(lyr.getChartType() >= 0)){
      spider_broker.removeLayer(lyr);
    }
  });

  function _load(cb){
    _data_loading = true;
    $.ajax({
      method: 'GET',
      url: 'lib/cache/spiders.svg'
    }).done(function(data){
      _spiders.data = new SvgLayer(data.documentElement.outerHTML);
      _data_loading = false;
      if(typeof cb === 'function'){
        cb.call();
      }
    }); // end $.ajax done
  }

  function _show(){
    if(!_spiders.data){
      if(!_data_loading){
        _load(_show());
      }else{
        setTimeout(function(){
          _show();
        }, 500);
      }
    }else{
      if(!map.hasLayer(_spiders.data)){ // init load, we add spiders to the map but hide them
        map.addLayer(_spiders.data);
        d3.selectAll('#svg_cm image').attr('visibility','hidden');
      }else{
        if(!_spiders.data.on){
          _spiders.data.show();
        }
      }
      redrawSvgMarker();
      _spiderfy();
    }
  }

  function _hide(){
    if(_spiders.data){
      if(map.hasLayer(_spiders.data)){
  			_spiders.data.hide();
        _spiderfy();
      }
		}
  }

  function _update(){
    if(_spiders){
      if(_spiders.layers.length > 1){
        _show();
      }else{
        _hide();
      }
    }else{
      if(!_data_loading){
        log('init load?');
      }else{
        setTimeout(function(){
          _update();
        }, 300);
      }
    }
  }

  function _spiderfy(){
    log('Trying to spiderfy...', 1);

    if(!map.hasLayer(_spiders.data)){
      console.log('Err: spiders not loaded yet!');
      return;
    }

    // var cm = document.querySelector('#svg_' + scale + '_cm');
		// if(!cm || cm.length === 0){
    //   console.log('Err: spiders not loaded yet!');
    //   return;
    // }

    // clear our spider counter (only count live ones)
    _spiders._count = 0;
    var _domTouched = 0;
    var _spidersExist = 0;
    var _domSpiders = 0;
    var ids = [];
    var i, k;

    // loop thru all candiate layers and populate an array with
    //   key: markder id
    //   values: layer ids
    var ls = _spiders.layers;
    for (i = 0; i < ls.length; i++) {
      var node = ls[i].getNode();
      if(node.getShow() && !node.getTempHide()){
        var data = node.getData();
        for (j = 0; j < data.length; j++){
          var p = data[j];
          if(map.getBounds().contains(L.latLng([p.lat, p.lng]))){
            if(!ids[p.id]){
              ids[p.id] = [];
            }
            ids[p.id].push(node.getId());
          }
        }
      }
    }

    for(var v in ids){
      var g = document.querySelector('#svg_spiders [data-id="' + v + '"]');
      if(!g){
    		// console.log('svg boundary na: ' + v + '@' + scale);
    		continue;
    	}
      var valid = [];
      if(ids.hasOwnProperty(v)){

        // figure out if this spider is alive and populate its legs
        // loop thru all of this location's candidate layers
        for (i = 0; i < ids[v].length; i++){
          var m = document.querySelector('[lid="' + ids[v][i] + '"][fid="' + v + '"]');
          if(!m) continue;
          if($(m).parent().css('display') == 'block' &&
        			m.children &&
        			m.children.length &&
        			m.children[0].children &&
        			m.children[0].children.length > 0)
						valid.push(m.parentNode);
        } // end for i

        // update the number of (valid) spiders
        if(valid.length > 0){
          _spiders._count ++; // yay, we have a live spider!
        }else{
          // eww, a dead spider
        }

        if(Number(g.getAttribute('data-spider-n')) == valid.length){
          _spidersExist ++;
        	continue;
        }

        if(valid.length === 0){
        	if(g.children[0].getAttribute('visibility') !== 'hidden'){
        		g.children[0].setAttribute('visibility', 'hidden');
            _domTouched ++;
        	}
        }else if(valid.length === 1){
        	// if(g.getAttribute('data-spider-on') !== 0){
        	// 	g.setAttribute('data-spider-on', 0);
        	// }
        	if(g.getAttribute('data-spider-n') !== 1){
        		g.setAttribute('data-spider-n', 1);
            _domTouched ++;
        	}
					valid[0].style.top  = '0';
					valid[0].style.left = '0';
					if(g.children[0].getAttribute('visibility') !== 'hidden'){
        		g.children[0].setAttribute('visibility', 'hidden');
            _domTouched ++;
        	}
        }else if(valid.length > 1){
        	console.log('A new spider comes to life!');
        	// if(g.getAttribute('data-spider-on') !== 1){
        	// 	g.setAttribute('data-spider-on', 1);
        	// }
        	if(Number(g.getAttribute('data-spider-n')) !== valid.length){
        		g.setAttribute('data-spider-n', valid.length);
            _domTouched ++;
        	}
        	if(g.children[0].getAttribute('visibility') !== 'visible'){
        		g.children[0].setAttribute('visibility', 'visible');
            _domTouched ++;
            _domSpiders ++;
        	}
          if(g.children[0].getAttribute('xlink:href') !== 'img/circle_' + valid.length + '.svg'){
        		g.children[0].setAttribute('xlink:href', 'img/circle_' + valid.length + '.svg');
            _domTouched ++;
        	}
					for (k = 0; k < valid.length; k++) {
						valid[k].style.top  = - DEFAULT.marker_div.mradius * 0.5 * Math.cos(k * 2 * Math.PI / valid.length) + 'px';
						valid[k].style.left =   DEFAULT.marker_div.mradius * 0.5 * Math.sin(k * 2 * Math.PI / valid.length) + 'px';
            _domTouched ++;
            _domTouched ++;
					}
				}
      } // end if ids.hasOwnProperty

    } // and for

    log(_spiders._count + ' spiders created, _domSpiders: ' + _domSpiders + ', _spidersExist: ' + _spidersExist + ', _domTouched: ' + _domTouched, 1);

  }

  return {
    spiderfy: _update,
    addLayer: function(lyr){
      if(lyr instanceof Layer){
        if(!_spiders){
          _spiders = {layers: []};
          _load();
        }

        if(_spiders.layers.indexOf(lyr) < 0){ // in case of a new layer being added
          _spiders.layers.push(lyr);
        }else{ // in case this layer is turned back on or due to redraw
          console.log('spider_broker has this layer already!');
        }

        _update();

      }else{
        throw 'Invalid [Layer] object!';
      }
    },
    removeLayer: function(lyr){
      if(lyr instanceof Layer){
        _spiders.layers.splice(_spiders.layers.indexOf(lyr), 1);

        _update();

      }else{
        throw 'Invalid [Layer] object!';
      }
    }
  };
})();

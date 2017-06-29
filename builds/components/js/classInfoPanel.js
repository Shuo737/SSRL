if(!global.mapboxgl) {
  global.mapboxgl = require('mapbox-gl');
}

global.InfoPanel = (function(){
  var _features,
      _tree = [],
      _jstree,
      _on = 0;

  return {
    show: function(config){
      if(checkMustKeys(config, ['features'])){

        // if($('#info-panel .panel-tree').jstree() instanceof $.jstree.core){
        //   $('#info-panel .panel-tree').jstree().destroy();
        // }
        if(_jstree){
          _jstree.destroy();
          $('#info-panel .panel-table').html('');
        }
        _tree = [];
        _features = config.features;
        _on = 0;

        if(!_features.length){
          this.hideContent();
        }else{
          this.showContent();
          if(_features.length > 20){
            showAlertAuto('Large number of records identitied: n=' + _features.length, 'danger');
          }

          $.each(_features, function(i, feature){
            var lid = feature.layer.id;

            var whichLayer = -1;
            for (var j = 0; j < _tree.length; j++) {
              if(_tree[j].id == lid){
                whichLayer = j;
                break;
              }
            } // end for

            if(whichLayer >= 0){
              _tree[whichLayer].children.push({
                id: lid + '' + i,
                text: 'ID:' + feature.id,
                icon: '',
                feature: feature
              });
            }else{
              _tree.push({
                id: lid,
                text: global.tree.get_node(lid).text,
                children: [{
                  id: lid + '' + i,
                  text: 'ID:' + feature.id,
                  icon: '',
                  feature: feature
                }]
              });
            }
          }); // end $.each
        }
      }else{
        throw 'config lacking mandatory propeties.';
      }

      for (var i = 0; i < _tree.length; i++) {
        _tree[i].text += ' <span class="count">n=' + _tree[i].children.length;
      }

      $('#info-panel').show();

      // populate the tree
      _jstree = $('#info-panel .panel-tree').jstree({
        'core':{
          'data': _tree
        }
      }).on('load_node.jstree', function(e, data){
        if(_jstree && _tree.length){
          _jstree.open_node(_tree[0].id);
          _jstree.select_node(_tree[0].children[0].id);
        }
      }).on('select_node.jstree', function(e, data){
        var node = data.node.original;
        if(!node.feature){
          return;
        }
        var feature = node.feature;

        // populate the table
        var tab = ['<table>',
                    '<tr><th>Field</th><th>Value</th></tr>',
                    '<tr><td>Geometry</td><td>', feature.geometry.type, '</td></tr>'];

        for(var key in feature.properties){
          if(/geometry|layer/.test(key)){
            continue;
          }else{
            var val = feature.properties[key];
            // if(/^-?\d*\.\d+$/.test(val)){
            //   val = val.toFixed(5);
            // }
            tab.push('<tr><td>', key.replace(/_/g, ' '), '</td><td>', val, '</td></tr>');
          }
        }
        tab.push('</table>');

        $('#info-panel .panel-table').html(tab.join(''));

      }).jstree();

      _on = 1;
    },
    hide: function(){
      $('#info-panel').hide();
      _on = 0;
    },
    showContent: function(){
      $('#info-panel').css('top', '');
      $('#info-panel .panel-content').show();
      $('#info-panel .minimize').show();
      $('#info-panel .maximize').hide();
    },
    hideContent: function(){
      $('#info-panel').css('top', 'initial');
      $('#info-panel .panel-content').hide();
      $('#info-panel .minimize').hide();
      $('#info-panel .maximize').show();
    },
  };
})();

/*
global.InfoPanel.prototype.show = function(){

  $.each(this._features, function(i, feature){
    for(var key in feature.properties){
      if(key.indexOf('_') >= 0){
        var newKey = key.replace('_', ' ');
        feature.properties[newKey] = feature.properties[key];
        delete feature.properties[key];
      }
    }
  });

  $('#info-panel .panel-body').html(['<pre>', JSON.stringify(features, function(key, value){
    if(/geometry|layer/.test(key)){
      return undefined;
    }else{
      if(typeof value === 'number' && /^-?\d*\.\d+$/.test(value)){
        return value.toFixed(5);
      }else{
        return  value;
      }
    }
  }, 2), '</pre>'].join(''));

  this._on = 1;
};

global.InfoPanel.prototype.hide = function(){
  $('#info-panel').hide();
  this._on = 0;
};

*/

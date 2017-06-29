global.meta_broker = (function(){
  var _treeTOC = [];
  var _tree = {};
  var _rasters = [];
  var _polygons = [];
  var _lines = [];
  var _points = [];
  var _orderObject = [];
  var _orderString = [];
  var _lut = {
    'AC': '#f79804',
    'ACfr': '#f79804',
    'ACha': '#f79804',
    'ACpl': '#f79804',
    'ACum': '#f79804',
    'ALgl': '#ffffbe',
    'ALha': '#ffffbe',
    'ALpl': '#ffffbe',
    'ALum': '#ffffbe',
    'ANsn': '#ed3c34',
    'ANsnmo': '#ed3c34',
    'ANsnum': '#ed3c34',
    'ANvi': '#ed3c34',
    'AR': '#f5d4a1',
    'ARab': '#f5d4a1',
    'ARbr': '#f5d4a1',
    'ARca': '#f5d4a1',
    'ARfl': '#f5d4a1',
    'ARha': '#f5d4a1',
    'ARpr': '#f5d4a1',
    'ARwl': '#f5d4a1',
    'CHcc': '#e1c838',
    'CHlv': '#e1c838',
    'CLha': '#fef400',
    'CLhaye': '#fef401',
    'CLlv': '#fef402',
    'CLpt': '#fef403',
    'CM': '#febe00',
    'CMca': '#febe00',
    'CMcr': '#febe00',
    'CMdy': '#febe00',
    'CMeu': '#febe00',
    'CMfl': '#febe00',
    'CMgl': '#febe00',
    'CMhaty': '#febe00',
    'CMhaye': '#febe00',
    'CMvr': '#febe00',
    'CR': '#005ce6',
    'DU': '#efe4be',
    'FL': '#00aff0',
    'FLca': '#00aff0',
    'FLdy': '#00aff0',
    'FLeu': '#00aff0',
    'FLmo': '#00aff0',
    'FLsz': '#00aff0',
    'FLti': '#00aff0',
    'FLum': '#00aff0',
    'FR': '#ff8721',
    'FRha': '#ff8721',
    'FRpl': '#ff8721',
    'FRro': '#ff8721',
    'FRum': '#ff8721',
    'FRxa': '#ff8721',
    'GL': '#8083d9',
    'GLcc': '#8083d9',
    'GLdy': '#8083d9',
    'GLeu': '#8083d9',
    'GLhaar': '#8083d9',
    'GLmo': '#8083d9',
    'GLum': '#8083d9',
    'GY': '#fef6a4',
    'GYcc': '#fef6a4',
    'GYha': '#fef6a4',
    'GYhaye': '#fef6a4',
    'GYpt': '#fef6a4',
    'HSdy': '#706b66',
    'HSeu': '#706b66',
    'HSfi': '#706b66',
    'HSsa': '#706b66',
    'KS': '#ca937f',
    'KScc': '#ca937f',
    'KSha': '#ca937f',
    'KSlv': '#ca937f',
    'LP': '#d1d1d1',
    'LPdy': '#d1d1d1',
    'LPeu': '#d1d1d1',
    'LPli': '#d1d1d1',
    'LPmo': '#d1d1d1',
    'LPrz': '#d1d1d1',
    'LPum': '#d1d1d1',
    'LV': '#fa8484',
    'LVab': '#fa8484',
    'LVcc': '#fa8484',
    'LVcr': '#fa8484',
    'LVfr': '#fa8484',
    'LVgl': '#fa8484',
    'LVha': '#fa8484',
    'LVvr': '#fa8484',
    'LX': '#ffbebe',
    'LXfr': '#ffbebe',
    'LXgl': '#ffbebe',
    'LXha': '#ffbebe',
    'LXpl': '#ffbebe',
    'NT': '#ffa77f',
    'NTdy': '#ffa77f',
    'NTeu': '#ffa77f',
    'NTro': '#ffa77f',
    'NTum': '#ffa77f',
    'PHgl': '#bd6446',
    'PHha': '#bd6446',
    'PHlv': '#bd6446',
    'PL': '#f77d3a',
    'PLdy': '#f77d3a',
    'PLeu': '#f77d3a',
    'PLsc': '#f77d3a',
    'PLum': '#f77d3a',
    'PT': '#730000',
    'PTab': '#730000',
    'PTeu': '#730000',
    'PTpt': '#730000',
    'PTpx': '#730000',
    'PTum': '#730000',
    'PZ': '#0cd900',
    'PZcb': '#0cd900',
    'PZgl': '#0cd900',
    'PZha': '#0cd900',
    'RG': '#fee3a4',
    'RGca': '#fee3a4',
    'RGdy': '#fee3a4',
    'RGeu': '#fee3a4',
    'SC': '#ed3994',
    'SCcc': '#ed3994',
    'SCgl': '#ed3994',
    'SCha': '#ed3994',
    'SChaty': '#ed3994',
    'SCso': '#ed3994',
    'SN': '#f9c2fe',
    'SNcc': '#f9c2fe',
    'SNgl': '#f9c2fe',
    'SNha': '#f9c2fe',
    'SNmo': '#f9c2fe',
    'SNst': '#f9c2fe',
    'STlv': '#41c2ea',
    'STlx': '#41c2ea',
    'STmo': '#41c2ea',
    'TC': '#8b2892',
    'UMcm': '#738e7f',
    'VR': '#9e567c',
    'VRcc': '#9e567c',
    'VRha': '#9e567c',
    'VRhams': '#9e567c',
    'VRpe': '#9e567c',
    'WR': '#b8e5fa'
  };

  // Some logic to retrieve, or generate tree structure
  $.ajax({
    method: 'GET',
    url: 'json/structure.json',
    dataType: 'json'
  }).done(function(data){
    _tree = data;
    var project_id;
    var country_id;
    var lyr, i, j, k;

    for (i = 0; i < data.length; i++) {
      project_id = data[i].id;
      var node = {
        id:  project_id,
        text: data[i].text,
        type: 'database',
        children: []
      };

      for (j = 0; j < data[i].country.length; j++) {
        var nodeCountry = data[i].country[j];
        country_id = nodeCountry.id;
        var nodes = [];

        for (k = 0; k < nodeCountry.point.length; k++) {
          lyr = nodeCountry.point[k];
          _points.push({
            project: project_id,
            country: country_id,
            layer: lyr.id,
            type: 'point'
          });
          nodes.push({
            type: 'point',
            project: project_id,
            country: country_id,
            layer: lyr.id,
            id: [project_id, country_id, lyr.id].join('_'),
            text: lyr.text,
            children: [
              {
                type: "action-download",
                icon: "icon icon-download",
                text: "Download"
              }
            ]
          });
        } // end for k

        for (k = 0; k < nodeCountry.line.length; k++) {
          lyr = nodeCountry.line[k];
          _lines.push({
            project: project_id,
            country: country_id,
            layer: lyr.id,
            type: 'line'
          });
          nodes.push({
            type: 'line',
            project: project_id,
            country: country_id,
            layer: lyr.id,
            id: [project_id, country_id, lyr.id].join('_'),
            text: lyr.text,
            children: [
              {
                type: "action-download",
                icon: "icon icon-download",
                text: "Download"
              }
            ]
          });
        } // end for k

        for (k = 0; k < nodeCountry.polygon.length; k++) {
          lyr = nodeCountry.polygon[k];
          if(lyr.id === 'soil'){
            nodes.push({
              type: 'polygon',
              project: project_id,
              country: country_id,
              layer: lyr.id,
              id: [project_id, country_id, lyr.id].join('_'),
              text: lyr.text,
              children: [
                {
                  type: "action-download",
                  icon: "icon icon-download",
                  text: "Download"
                }
              ]
            });
            for(var key in _lut){
              var _id = ['soil', key].join('_');
              _polygons.push({
                project: project_id,
                country: country_id,
                layer: _id,
                type: 'polygon'
              });
            }
          }else{
            _polygons.push({
              project: project_id,
              country: country_id,
              layer: lyr.id,
              type: 'polygon'
            });

            nodes.push({
              type: 'polygon',
              project: project_id,
              country: country_id,
              layer: lyr.id,
              id: [project_id, country_id, lyr.id].join('_'),
              text: lyr.text,
              children: [
                {
                  type: "action-download",
                  icon: "icon icon-download",
                  text: "Download"
                }
              ]
            });
          }

        } // end for k

        for (k = 0; k < nodeCountry.raster.length; k++) {
          lyr = nodeCountry.raster[k];
          _rasters.push({
            project: project_id,
            country: country_id,
            layer: lyr.id,
            type: 'raster'
          });
          nodes.push({
            type: 'raster',
            project: project_id,
            country: country_id,
            layer: lyr.id,
            id: [project_id, country_id, lyr.id].join('_'),
            text: lyr.text,
            children: [
              {
                type: "action-download",
                icon: "icon icon-download",
                text: "Download"
              }
            ]
          });
        }

        if(nodeCountry.id === '_'){
          Array.prototype.push.apply(node.children, nodes);
        }else{
          node.children.push({
            id: country_id,
            text: nodeCountry.text,
            type: 'dataset',
            children: nodes
          });
        }
      } // end for j
      _treeTOC.push(node);
    }
    // _treeTOC is ready
    console.log('Initialized: Tree TOC');
    init_ui();
  }).fail(function(err){
    console.log('err:', err);
  });

  return{
    getSoilLUT: function(){
      return _lut;
    },
    getTreeTOC: function(){
      return _treeTOC;
    },
    getTree: function(){
      return _tree;
    },
    getStackOrder: function(){
      if(!_orderObject.length){
        var i;
        for (i = 0; i < _points.length; i++) {
          _orderObject.push(_points[i]);
        }

        for (i = 0; i < _lines.length; i++) {
          _orderObject.push(_lines[i]);
        }

        for (i = 0; i < _polygons.length; i++) {
          _orderObject.push(_polygons[i]);
        }

        for (i = 0; i < _rasters.length; i++) {
          _orderObject.push(_rasters[i]);
        }
      }
      return _orderObject;
    } // end getStackOrder
    // ,getStackOrderString: function(){
    //   return _orderObject.map(function(o){
    //     return (o.country === '_' ?
    //        [o.project, o.layer].join('_') :
    //        [o.project, o.country, o.layer].join('_'));
    //   });
    // }
  }; // end return
})();

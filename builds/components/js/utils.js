if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}

require('bootstrap');

function checkMustKeys(obj, keys, throwError){
  for (var i = 0; i < keys.length; i++){
    // throw 'error';
    if (!obj.hasOwnProperty(keys[i]) && !obj.hasOwnProperty('_' + keys[i])) {
      if(!throwError){
        console.log('You can mute this error by setting [throwError] = false');
        console.log(obj);
        throw "Mandatory property missing: " + keys[i];
      }
      return false;
    }
  }
  return true;
}

global.showStatusMsg = function(msg){
  $('footer .busy .msg').html(msg);
  $('footer .busy').stop(true, true).animate({
    opacity: 1
  }, 300, "linear", function(){
    // animation complete
    $('footer .busy').css('color', '#3c763d');
  });
};

global.hideStatusMsg = function(msg){

  $('footer .busy').stop(true, true).animate({
    opacity: 0,
  }, 1000, "linear", function(){
    // setTimeout(function(){
    //   $('footer .busy .msg').html('')
    // }, 1500);
  });
};

global.checkModalDialogLoaded = function(){
  return $('#modalDiag').css('display') == 'block';
};

global.showModalDialog = function(title, msg){
  var d = $('#modalDiag');
  title = title || 'Information';
  if(d){
    d.find('.modal-title').html(title);
    d.find('.modal-body').html(msg);
    // if(!getModalMsgDismissed()){
      d.modal('show');
      // setModalMsgDismissed(false);
    // }
  }
};

global.hideModalDialog = function(){
  // if(checkModalDialogLoaded()){
    $('#modalDiag').modal('hide');
  // }else{
  //   setModalMsgDismissed(true);
  // }
};

// global.setModalMsgDismissed = function(flag){
//   _modalMsgCancel = !!flag;
// }
//
// global.getModalMsgDismissed = function(){
//   return _modalMsgCancel;
// }

global.showModalMsgAuto = function(msg, type){
  showModalMsg(msg, type);
  setTimeout(function(){
    hideModalMsg();
  }, 2000);
};

global.showModalMsg = function(msg, type){
  var d = $('#modalMsg div');
  type = type || 'success';

  if(global.modalMsgShown){
    d.html(msg).attr('class', 'alert alert-' + type);
    // console.log('modal msg updated');
    return;
  }

  var validTypes = ['success', 'info', 'warning', 'danger'];
  if(validTypes.indexOf(type)<0){
    console.log('Wrong type. Only these are supported: ' + validTypes.join(' '));
  }

  d.html(msg).attr('class', 'alert alert-' + type).parent().modal('show');
  global.modalMsgShown = 1;
  // console.log('modal msg show');
};

// if the backdrop doesn't go away, see this ref
// http://stackoverflow.com/questions/22056147/bootstrap-modal-backdrop-remaining
global.hideModalMsg = function(){
  $('#modalMsg').modal('hide');
  global.modalMsgShown = 0;
  // console.log('modal msg hide');
  // $('.modal-backdrop').remove();
};

global.showAlertAuto = function(msg, type){
  type = type || 'success';
  var validTypes = ['success', 'info', 'warning', 'danger'];
  if(validTypes.indexOf(type)<0){
    console.log('Wrong type. Only these are supported: ' + validTypes.join(' '));
  }

  var content = $(['<div class="alert alert-' + type + '">', msg, '</div>'].join(''));
  $('#layout').append(content);
  setTimeout(function(){
    content.animate({
      opacity: 0
    }, 300, function(){
      content.remove();
    });
  }, 2000);
};

global.getHeaderHeight = function(){
  return parseInt($('#navbar').css('height'));
};

calcZoom = function(ext){
  var d = DEFAULT.map.scale.find('OVERLAP');
  var b = DEFAULT.map.scale.find(ext.toUpperCase());
  return [b[0]-d, b[1]+d];
};

calcScale = function(z){
  if(typeof z =='undefined') z = map.getZoom();
  var scales = [];

  for (var i = 0; i < DEFAULT.map.scale.length - 2; i++) { // exclude the last 2 elements: 'ALL' and 'overlap'
    if (DEFAULT.map.scale[i].value[0] <= z && z <= DEFAULT.map.scale[i].value[1])
      scales.push(DEFAULT.map.scale[i].name);
  }
  return scales.join('/');
};

disableZoom = function(){
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  $(".leaflet-control-zoomslider").css("visibility", "hidden");
};

enableZoom = function(){
  map.touchZoom.enable();
  map.doubleClickZoom.enable();
  map.scrollWheelZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
  $(".leaflet-control-zoomslider").css("visibility", "visible");
};

numberWithCommas = function(x) {
  if(!x) return x;
  else return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

rgbToHex = function(r, g, b) {
  if(r < 0 || r > 255) alert("r is out of bounds; "+r);
  if(g < 0 || g > 255) alert("g is out of bounds; "+g);
  if(b < 0 || b > 255) alert("b is out of bounds; "+b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1,7);
};

// Note: no # for the hex string
hexToRgb = function(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return [r, g, b].join();
};

// svg functions

function calcSvgStroke(width){
  var z = map.getZoom();
  return width / Math.pow(2, (z-1));
}

function redrawSvgStroke(sel,width){
  var z = map.getZoom();
  $(sel).attr('stroke-width', width / Math.pow(2, (z-1)));
}

function redrawHatch(){
  var z = map.getZoom();
  var px = 2;
  var w = px / Math.pow(2, (z-1));

  $('#hatch').attr('width', 6 * w)
             .attr('height', 6 * w)
             .find('rect')
             // .attr('fill', "#f00")
             .attr('stroke-width', w)
             .attr('stroke-dasharray', 6 * w + ',' + 6 * w)
             .attr('width', 6 * w)
             .attr('height', 6 * w);
}

function redrawSvgMarker(){
  var z = map.getZoom();
  var sz = DEFAULT.marker_div.mradius / Math.pow(2, (z-2));
  $('.svg-layer image').each(function(){
    var me = $(this);
    me.attr('width', sz)
      .attr('height', sz);
    me.parent().attr('transform','translate(-' + (sz/2) + ',-' + (sz/2) + ')');
      // .attr('x', me.attr('x')-sz/2)
      // .attr('y', me.attr('y')-sz/2);
  });
}

function log(msg, isSuccess){
  if(isSuccess){
    console.log('%c[Success]%c ' + msg,'color:green', 'color:black');
  }else{
    console.log('%c[Failure]%c ' + msg,'color:red', 'color:black');
  }
}

function setTooltipDivContent(args){
  var i, j, d, e;
	var chart = args.chart;
	var title = args.title;
	var data = args.data;
	var scale = args.scale;
	var highlight = args.highlight;
	var hasNote = args.hasNote;
	var top10LblName = args.lblName;
	var top10LblValue = args.lblValue;
	var percent = args.percent;
	var sticky = args.sticky;
	var rank_note = 'This ranking is among all ' + scale + ' units';
	if(!sticky){
		rank_note += ' in year "' + highlight + '".';
	}else{
		rank_note += ' in the same year.';
	}

  var content = '<h3 class="place-title">';

	switch(chart){
		case 'choropleth':
      if(data.ico)
      	content += "<img onerror=\"this.style.display='none'\" class='country' src='//flagspot.net/images/" + data.ico[0] + "/" + data.ico + ".gif'></img>";

      content += '<span>';
      if(scale !== 'ALL'){
      	content += scale + ': ';
      }
      content += data.place + ' ('+data.values[0].year+')</span></h3><h3 class="var-title">' + chart_config.getChart('choropleth').icon + ' ' + title + '</h3><div><table>';
			for (i = 0; i < data.values.length; i++) {
				content += '<tr><td class="caption">'+data.values[i].name+'</td><td>' + numberWithCommas(data.values[i].value) + (percent ? '%' : '') + '</td></tr>';
			}
			content += '</table></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom left corner for more info.</p>';
			return content;
		case 'real_pie':
			content = '<h3 class="place-title">';
      if(scale !== 'ALL'){
      	content += scale + ': ';
      }
			content += data[0].data.place + ' (' + data[0].data.year + ')</h3><h3 class="var-title">' + chart_config.getChart('real_pie').icon + ' ' + title + '</h3><div><table>';
			for (i = 0; i < data.length; i++) {
				if(highlight !== false){
					if(highlight == data[i].data.name){
            content += '<tr class="active">';
          }else{
            content += '<tr>';
          }
				}else{
					content += '<tr>';
				}
				content += '<td class="caption">'+data[i].data.name+'</td><td class="align-right">' + (data[i].data.value != '-' ? numberWithCommas(data[i].data.value) + (percent ? '% (' : ' (') + data[i].data.value_p + '%)' : '-') + '</td></tr>';
			}
			content += '</table></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom left corner for more info.</p>';
			return content;
		case 'dot':
		case 'dot2':
    case 'heatmap':
			content = '<h3 class="place-title">';
			if(data.ico)
      	content += "<img onerror=\"this.style.display='none'\" class='country' src='//flagspot.net/images/" + data.ico[0] + "/" + data.ico + ".gif'></img>";
      if(scale !== 'ALL'){
      	content += scale + ' ';
      }
			content += data.values[0].year;
			content += '</h3><h3 class="var-title">' + chart_config.getChart('heatmap').icon + ' ' + title + '</h3><div><table>';
			for (j = 0; j < data.values.length; j++) {
					content += '<tr><td class="caption">' + data.values[j].name + '</td><td>' + numberWithCommas(data.values[j].value) + ((data.values[j].value !== '' && data.values[j].value !== '-' && j===0 && percent) ? '%' : '') + '</td></tr>';
				}
			content += '</table></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom left corner for more info.</p>';
			return content;
		case 'bar':
			content = '<h3 class="place-title">';
			if(scale !== 'ALL'){
      	content += scale + ': ';
      }
			content += data[0].place;
			content += '</h3><h3 class="var-title">' + chart_config.getChart('bar').icon + ' ' + title + '</h3><div><table>';
			content+='<tr><td class="caption">Year</td><td class="caption">Value</td><td class="caption">Rank</td></tr>';
			for (i = 0; i < data.length; i++) {
				if(data[i].data){ // pie  chart form
					d = data[i].data.values[0];
					e = data[i].data.values[1];
				}else{
					d = data[i].values[0];
					e = data[i].values[1];
				}
				if(!d) continue; // skip a year if its data is not available

				if(highlight !== false){
					if(highlight == d.year){
            content += '<tr class="active">';
          }else{
            content += '<tr>';
          }
				}else{
					content += '<tr>';
				}
				content += '<td>' + d.year + '</td><td>' + numberWithCommas(d.value) + (percent ? '%':'') + '</td><td>' + e.value + '</td></tr>';
			}
			content += '</table><div class="footnote">' + rank_note + '</div></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom left corner for more info.</p>';
			return content;
		case 'pie':
			content = '<h3 class="place-title">';
			if(scale !== 'ALL'){
      	content += scale + ': ';
      }
			content += data[0].data.place;
    	content += '</h3><h3 class="var-title">' + chart_config.getChart('bar').icon + ' ' + title + '</h3><div><table>';
			content+='<tr><td class="caption">Year</td><td class="caption">Value</td><td class="caption">Rank</td></tr>';
			for (i = 0; i < data.length; i++) {

				if(data[i].data){ // pie  chart form
					d = data[i].data.values[0];
					e = data[i].data.values[1];
				}else{
					d = data[i].values[0];
					e = data[i].values[1];
				}
				if(d == 'undefined'){
					continue; // skip a year if its data is not available
				}

				var na = 0;
				if(d.value === null || d.value < 0){
					na = 1;
					d.value = '-';
					e.value = '-';
				}

				if(highlight !== false){
					if(highlight == d.year){
            content += '<tr class="active">';
          }else{
            content += '<tr>';
          }
				}else{
					content += '<tr>';
				}
				content += '<td>' + d.year + '</td><td>' + numberWithCommas(d.value) + ((percent && !na) ? '%':'') + '</td><td>' + e.value + '</td></tr>';
			}
			content += '</table><div class="footnote">' + rank_note + '</div></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom left corner for more info.</p>';
			return content;
		case 'bar_top10': // dot3
			content = '<h3 class="place-title">';
			if(scale !== 'ALL'){
      	content += scale + ': ';
      }
			content += data.place + ' (' + data.values[0].year + ')</h3><h3 class="var-title">' + chart_config.getChart('bar_top10').icon + ' ' + title + '</h3><div><table><tr><td class="caption">Top</td><td class="caption">'+top10LblName+'</td><td class="caption">'+top10LblValue+'</td></tr>';

			for (j = 0; j < 10; j++) {
				content += '<tr><td class="caption">' + (j+1) + '</td><td>' + data.values[j].name + '</td><td>' + numberWithCommas(data.values[j].value) + '</td></tr>';
			}
			content += '</table></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom left corner for more info.</p>';
			return content;
	}
}

global.getHeaderHeight = function(){
  return parseInt($('nav > .container').css('height'));
};

global.getFooterHeight = function(){
  return parseInt($('#layout > footer').css('height'));
};

global.getContentHeight = function(){
  return $(window).height() - getHeaderHeight() - getFooterHeight();
};

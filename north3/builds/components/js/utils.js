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

function redrawSvgMarker(){
  console.log('redrawSvgMarker');
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
  return parseInt($('#banner').css('height'));
};

global.getFooterHeight = function(){
  return parseInt($('#footer').css('height'));
};

global.getContentHeight = function(){
  return $(window).height() - getHeaderHeight() - getFooterHeight();
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

function log(msg, isSuccess){
  if(isSuccess){
    console.log('%c[Success]%c ' + msg,'color:green', 'color:black');
  }else{
    console.log('%c[Failure]%c ' + msg,'color:red', 'color:black');
  }
}

function setTooltipDivContent(args){
  var i, j, d, e;
  var nodeType = args.nodeType;
	var chart = args.chart;
	var title = args.title;
	var data = args.data;
	var highlight = args.highlight;
	var hasNote = args.hasNote;
	var top10LblName = args.lblName;
	var top10LblValue = args.lblValue;
	var percent = args.percent;
	var sticky = args.sticky;
  var color = null;
	var rank_note = 'The ranking is among all communities in the same year.';

  var content = '<h3 class="place-title">';

	switch(chart){
    case 'pie':
      // color = data[0].data.color;
			content = '<h3 class="place-title">';
			content += data[0].data.place + ' (' + data[0].data.year + ')</h3><h3 class="var-title">' + chart_config.getChart('pie').icon + ' ' + title + '</h3><div><table>';
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
				content += ['<td class="caption">', data[i].data.name, '</td><td class="align-right">',
          // color ? '<div class="data-quality" style="background-color:' + color + '"></div>' : '',
          data[i].data.value != '&mdash;' ? numberWithCommas(data[i].data.value) + (percent ? '%' : ' (' + data[i].data.value_p + '%)') : '&mdash;',
          '</td></tr>'].join('');
			}
			content += '</table></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom right corner for more info.</p>';
			return content;
		case 'dot':
      var vals;
      // if(nodeType === 'pie'){
      //   vals = data;
      // }else if(nodeType === 'bar'){
        vals = data.values;
      // }else{
      //   throw 'Unsupported node type!';
      // }

      content = '<h3 class="place-title">';
      if(data.ico)
        content += "<img onerror=\"this.style.display='none'\" class='country' src='//flagspot.net/images/" + data.ico[0] + "/" + data.ico + ".gif'></img>";
      content += data.place + ' (' + vals[0].year + ')';
      content += '</h3><h3 class="var-title">' + chart_config.getChart('dot').icon + ' ' + title + '</h3><div><table>';
      for (j = 0; j < vals.length; j++) {
          content += '<tr><td class="caption">' + vals[j].name + '</td><td>' + numberWithCommas(vals[j].value) + ((vals[j].value !== '' && vals[j].value !== '&mdash;' && j===0 && percent) ? '%' : '') + '</td></tr>';
        }
      content += '</table></div>';
      if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom right corner for more info.</p>';
      return content;
    case 'heatmap':
			content = '<h3 class="place-title">';
			if(data.ico)
      	content += "<img onerror=\"this.style.display='none'\" class='country' src='//flagspot.net/images/" + data.ico[0] + "/" + data.ico + ".gif'></img>";
			content += data.values[0].year;
			content += '</h3><h3 class="var-title">' + chart_config.getChart('heatmap').icon + ' ' + title + '</h3><div><table>';
			for (j = 0; j < data.values.length; j++) {
					content += '<tr><td class="caption">' + data.values[j].name + '</td><td>' + numberWithCommas(data.values[j].value) + ((data.values[j].value !== '' && data.values[j].value !== '&mdash;' && j===0 && percent) ? '%' : '') + '</td></tr>';
				}
			content += '</table></div>';
			if(hasNote) content += '<p class="footnote">Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom right corner for more info.</p>';
			return content;
		case 'bar':
			content = '<h3 class="place-title">';
			content += data[0].place;
			content += '</h3><h3 class="var-title">' + chart_config.getChart('bar').icon + ' ' + title + '</h3><div><table>';
			content+='<tr><td class="caption">Year</td><td class="caption">Value</td></tr>';
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
				content += '<td>' + d.year + '</td><td>' + numberWithCommas(d.value) + (percent ? '%':'') + '</td></tr>';
			}
			content += '</table><div class="footnote">' + rank_note;
			if(hasNote){
        content += ' Click \'<i class="caption fa fa-info-circle"></i> <b>Metadata</b>\' at the bottom right corner for more info.</div></div>';
      }else{
        content += '</div></div>';
      }
			return content;
	}
}

function _showLeadLine(p1, p2, cb){
  var lead = $('#lead');
  if(!lead.length){
    throw 'Cannot find element "#lead" in the document!';
  }
  var w = +Math.sqrt(Math.pow(p1.left-p2.left, 2) + Math.pow(p1.top - p2.top, 2)).toFixed(2);
  var a = +Math.atan((p2.top-p1.top)/(p2.left-p1.left))*180/Math.PI.toFixed(2) + 180;
  if(p2.left<p1.left) a += 180;

  lead.attr('viewBox', '0 -10 ' + w + ' 20');
  var wArrow = (20 * 3 / 4).toFixed(2); // 20px is the width of the div
  $('#lead-line').attr('d', "M0,0 " + (w - wArrow) + ',0');

  w += 0; // left + 1px (see below), so width should be added by 1px
  lead.css({
    'opacity': 1,
    'width': '0px',
    'left': (p2.left + 0) + 'px', // + 1 to hide the end
    'top': (p2.top - 10) + 'px', // 10 comes half the svg's width
    'transform': 'rotate(' + a + 'deg)'
  });

  lead.animate({width: w + 'px'}, 1000, 'easeOutCirc', function(){
    lead.animate({opacity: 0}, 1000, function(){
      if(typeof cb === 'function'){
        cb.call();
      }
    });
  });

  // setTimeout(function(){
  //   lead.css({
  //     'opacity': 0
  //   });
  // }, 2000);
}


/****** remove a css style ******
  http://stackoverflow.com/questions/2465158/is-it-possible-to-remove-inline-styles-with-jquery
 ****** remove a css style *******/
(function($){
    $.fn.removeStyle = function(style){
        var search = new RegExp(style + '[^;]+;?', 'g');

        return this.each(function(){
            $(this).attr('style', function(i, style){
                return style.replace(search, '');
            });
        });
    };
}(jQuery));

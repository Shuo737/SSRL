if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}

function TooltipDiv(tip_class, stand_alone){
  this.div = $('<div class="tooltip-div ' + (tip_class || '') + (stand_alone ? ' sticky' : '') + '"></div>');
  $('#layout').append(this.div);
  this.stand_alone = stand_alone;
}

// offsets for the tooltip
TooltipDiv.prototype.dLeft = 5;
TooltipDiv.prototype.dTop = 5;

/* Tooltip class for div elements */
TooltipDiv.prototype.show = function(div,tip, coords){
  var dir, north;
  if(this.hasOwnProperty('visible') && !this.visible){
    this.div.css({'display':'block'});
  }else{
    if(!div) return;

    var winH = $(window).innerHeight();
    var winW = $(window).innerWidth();

    // if we have multiple divs, pick the one close to the center of the map
    if(div.constructor === Array && div.length > 1){
      var score = -1, inx = -1;
      for (var i = 0; i < div.length; i++) {
        var d = $(div[i]).offset();
        var s = Math.abs(winW / 2 - d.left) + Math.abs(winH / 2 - d.top);
        if (score == -1){
          score = s;
          inx = i;
        }else{
          if(s < score){
            score = s;
            inx = i;
          }
        }
      }
      div = $(div[inx]);
    }

    var divH = +div.height().toFixed(2);
    if(divH === 0 && div[0].getBBox){
       divH = +div[0].getBBox().height.toFixed(2);
    }
    var divW = div.width();
    if(divW === 0 && div[0].getBBox){
      divW = +div[0].getBBox().width.toFixed(2);
    }

    var offset = div.offset();
    if(offset.top === 0 || offset.left === 0){
      var p = div.parent();
      offset = p.offset();
      offset.left += (p.width() - divW) / 2;
      offset.top += (p.height() - divH) / 2;
    }

    if(coords && coords.length>0){
      this.div.html(tip);
      dir = 'n';
    }else{
      north = (offset.top + divH) < (winH / 2); // north: arrow is on top of the tooltip

      dir = (north?'n':'s');
      var dir2 = (north? 's':'n');

      if(this.div.hasClass(dir2))
          this.div.removeClass(dir2);
        this.div.addClass(dir);
      if(north){
        this.div.html('<div class="arrow ' + dir + '"></div>' + tip);
      }else{
        this.div.html(tip + '<div class="arrow ' + dir + '"></div>');
      }
    }

    var meH = this.div.outerHeight();
    var meW = this.div.outerWidth();

    var newLeft;
    var arrowLeft;
    var newTop;

    if(coords && coords.length>0){
      // console.log(meW, marker_div.size.h);
      newLeft = coords[0] + this.dLeft + 10;// - meW;
      newTop = coords[1] + this.dTop;// - marker_div.size.h;
    }else{
      newLeft = offset.left - this.dLeft;
      arrowLeft = offset.left - newLeft;
      if(offset.left + meW > winW){
        newLeft = winW - meW - $(window).scrollLeft() - this.dLeft;
        arrowLeft = offset.left - newLeft - this.dLeft;
      }
      if(offset.left - this.dLeft < 0){
        newLeft = - $(window).scrollLeft() + this.dLeft;
        arrowLeft = newLeft + 5;
      }

      newTop = offset.top - $(window).scrollTop();
      newTop -= parseInt($('#layout').css('top'), 10);
      if(north){
        newTop += divH + this.dTop + 8.5; // 8.5 is the arrow's height: 12 / Math.sqrt(2)
      }else{
        newTop -= meH + this.dTop + 8.5; // 8.5 is the arrow's height: 12 / Math.sqrt(2)
      }
    }

    this.div.find('.arrow').css('left', arrowLeft);
    this.div.css({
      'display':'block',
      'left': newLeft + 'px',
      'top': newTop + 'px'
    });
    this.visible = 1;
  }
};

TooltipDiv.prototype.hide = function(){
  this.div.css('display','none');
  this.visible = 0;
  this.div.remove();
};

TooltipDiv.prototype.remove = function(){
  this.div.remove();
};

TooltipDiv.prototype.setPosition = function(pnt){
  this.div.css({'left':pnt[0]+this.dLeft + 10, 'top':pnt[1]+this.dTop + 20});
};

if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}
require('jquery_ui');

global.card_broker = (function(){
  var _cards = [];
  var _cardId = 0;
  var _cardOffset = {top: 0, left: 0};
  var cardContainer = L.Control.extend({
    options: {position: 'topright'},
    initialize: function (options) {
      var me = this;
      L.Util.setOptions(me, options);
      me.div = $('<div class="card-container">');
      var title = $(['<h3><i class="demo-icon icon-card"></i> Card Deck',
        '<div class="control">',
          '<i class="icon minimize icon-minus-squared"></i>',
          '<i class="icon maximize icon-plus-squared"></i>',
        '</div>',
      '</h3>'].join(''));
      var content = $('<div class="cards"></div>');
      var footer = $([
      '<footer class="content">' +
        '<div class="container">',
          // '<div class="btn-group" role="group">',
            '<div class="btn-group dropup">',
              '<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true">',
                '<i class="icon icon-chart-rank"></i>',
                ' Order Cards ',
                '<span class="caret"></span>',
                '<span class="sr-only">Toggle Dropdown</span>',
              '</button>',
              '<ul class="dropdown-menu">',
                '<li><a data-id="order-year" href="#">Order by <strong>Year</strong></a></li>',
                '<li><a data-id="order-location" href="#">Order by <strong>Location</strong></a></li>',
                '<li><a data-id="order-topic" href="#">Order by <strong>Topics</strong></a></li>',
                '<li role="separator" class="divider"></li>',
                '<li><a data-id="order-add" href="#">Order by <strong>Time Added</strong></a></li>',
              '</ul>',
            '</div>',
            '<button type="button" data-id="remove-all" class="btn btn-danger btn-xs"><i class="icon icon-trash-empty"></i> Remove All</button>',
          // '</div>',
        '</div>',
      '</footer>'].join(''));

      me.div.append(title).append(content).append(footer);

      me.div.resizeContainer = function(){
        var newHeight = parseInt(me.div.css('height')) -
          parseInt(me.div.find('> h3').css('height')) -
          parseInt(me.div.find('> footer').css('height'));
        me.div.find('.cards').css('height', newHeight + 'px');
      };

      me.div.resizable({
        helper: "ui-resizable-helper",
        handles: "s, w, sw",
        stop: function(event ,ui){
          me.div.resizeContainer();
        }
      });

      // events
      me.div.on('mousewheel DOMMouseScroll', function(e){
        e.stopPropagation();
      });

      me.div.find('*').dblclick(function(e){
        e.stopPropagation();
      });

      me.div.on('mousedown', function(e){
        e.stopPropagation();
      });

      me.div.find('*').on('tap, hold', function(e){
        e.stopPropagation(); // bug fixed on 20160225
        console.log('tap, hold dismissed');
      });

      me.div.find('> h3').click(function(){
        var min = me.div.find('.minimize');
        if(min.is(":visible")){
          min.trigger('click');
        }else{
          me.div.find('.maximize').trigger('click');
        }
      });

      me.div.find('.minimize').click(function(e){
        e.stopPropagation(); // this click event will bubble up to h3 element which triggers this click again -- infinite loop

        // back up the current width / height
        me.div.oldWidth = me.div.css('width');
        me.div.oldHeight = me.div.css('height');
        me.div.removeStyle('left');

        // change it's width / height
        me.div.css('width', 'inherit');
        me.div.css('height', 'initial');

        me.div.find('.cards').hide();
        me.div.find('footer').hide();
        $(this).hide();
        me.div.find('.maximize').show();
      });

      me.div.find('.maximize').click(function(e){
        e.stopPropagation(); // this click event will bubble up to h3 element which triggers this click again -- infinite loop

        // restore the previous width / height
        me.div.css('width', me.div.oldWidth);
        me.div.css('height', me.div.oldHeight);

        me.div.find('.cards').show();
        me.div.find('footer').show();
        $(this).hide();
        me.div.find('.minimize').show();
      });

      // order cards
      me.div.find('[data-id^="order-"]').click(function(){
        _sortCard($(this).attr('data-id').substr(6)); // 6 is the length if ("order-")
      });

      me.div.find('[data-id="remove-all"]').click(function(){

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
                          '<p>Do you really want to throw away all cards from your deck?</p>',
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
          card_broker.removeAll();
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

      }); // end remove-all's click

    },
    onAdd: function(map){
      return this.div[0];
    }
  });

  function _stackCard(){

  }

  function _sortCard(order){
    var cards = card_broker._container.div.find('> .cards');
    var i;
    switch (order) {
      case 'year':
        _cards.sort(function(a, b){
          a1 = a.getYear();
          b1 = b.getYear();
          try{
            a1 = parseInt(a1);
            b1 = parseInt(b1);
            return a1 - b1;
          }
          catch (err){
            return a1 > b1;
          }
        });
        for (i = 0; i < _cards.length; i++){
          cards.append(cards.find('[data-id="' + _cards[i].getId() + '"]'));
        }
        break;
      case 'location':

        for (i = 0; i < _cards.length; i++) {
          _cards[i].score = (_cards[i].getLatLng().lat + 90) * 360 + _cards[i].getLatLng().lng + 180;
        }

        _cards.sort(function(a, b){
          return b.score - a.score;
        });

        for (i = 0; i < _cards.length; i++){
          cards.append(cards.find('[data-id="' + _cards[i].getId() + '"]'));
        }
        break;
      case 'topic':
        _cards.sort(function(a, b){
          a1 = a.getTitle();
          b1 = b.getTitle();
          return a1 > b1;
        });
        for (i = 0; i < _cards.length; i++){
          cards.append(cards.find('[data-id="' + _cards[i].getId() + '"]'));
        }
        break;
      case 'add':
        for (i = 0; i < _cards.length; i++){
          cards.append(cards.find('[data-id="' + i + '"]'));
        }
        break;
      default:
    }
  }

  function _findCard(card){
    for (var i = 0; i < _cards.length; i++) {
      if(_cards[i].getMarker().attr('lid') == card.getMarker().attr('lid') &&
         _cards[i].getMarker().attr('fid') == card.getMarker().attr('fid') &&
         _cards[i].getYear() == card.getYear() &&
         _cards[i].getChartType() == card.getChartType())
      return _cards[i];
    }
    return null;
  }

  return {
    generateOffset: function(){
      _cardOffset.top += 20;
      _cardOffset.left += 20;
      return _cardOffset;
    },
    generateId: function(){
      return _cardId ++;
    },
    getCards: function(){
      return _cards;
    },
    init: function(){
      this._container = new cardContainer();
      map.addControl(this._container);

      // set container's initial height
      this._container.div.resizeContainer();

      this._ready = 1;
    },
    add: function(card){
      var me = this;
      if(card instanceof Card){
        var sameCard = _findCard(card);
        if(!sameCard){
          me._container.div.css('display', 'block');
          _cards.push(card);
          var delta = 7;
          me._container.div.find('.cards').append(card.render());
          me._container.div.stop(true, true).animate({
              left: '+=' + delta,
              top: '+=' + delta,
              width: '+=' + delta * 2,
              height: '+=' + delta * 2
            }, 300, 'easeOutBack', function(){
              me._container.div.stop(true, true).animate({
                left: '-=' + delta,
                top: '-=' + delta,
                width: '-=' + delta * 2,
                height: '-=' + delta * 2
              }, 300, 'easeOutBack', function(){
                me._container.div.css({
                  left: '',
                  top: '',
                  width: '',
                  height: ''
                });
              });
          });

        }else{
          showAlertAuto('This card is already in the deck.', 'danger');
          var cardDiv = this._container.div.find('.card[data-id="' + sameCard.getId() + '"]');

          // scroll the card-container to this card
          this._container.div.find('.cards').scrollTop(this._container.div.find('.cards').scrollTop() + cardDiv.position().top);

          // flash the card couple times as a visual clue for the user
          var mask = cardDiv.find('.mask');
          mask.flashN = 0;
          mask.show();
          mask.css('opacity', 0);
          mask.flash = setInterval(function(){
            mask.css('opacity', 1);
            mask.flashN ++;
            setTimeout(function(){
              mask.css('opacity', 0);
              if(mask.flashN >= 3){
                mask.hide();
                clearInterval(mask.flash);
              }
            }, 300);
          }, 600);
        }
      }
    },
    removeAll: function(){
      while (_cards.length) {
        var cardDiv = this._container.div.find('.card[data-id="' + _cards[_cards.length - 1].getId() + '"]');
        cardDiv.remove();
        _cards.pop();
      }
      this._container.div.css('display', 'none');
    },
    remove: function(card){
      if(card instanceof Card){
        var sameCard = _findCard(card);
        if(sameCard){
          _cards.splice(_cards.indexOf(sameCard), 1);
          var cardDiv = this._container.div.find('.card[data-id="' + sameCard.getId() + '"]');
          cardDiv.remove();
          if(!_cards.length){
            this._container.div.css('display', 'none');
          }
        }else{
          throw 'Cannot find this card.';
        }
      }
    }
  }; // end return
})();

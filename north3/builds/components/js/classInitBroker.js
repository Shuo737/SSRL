global.init_broker = (function(){
  var _init = ['dataBroker', 'menuBroker'];
  return{
    init: function(broker){
      var i = _init.indexOf(broker);
      if(i > -1){
        _init.splice(i, 1);
        log(broker + ' initialized.', 1);
        if(_init.length === 0){

          initMap();
          log('map initialized.', 1);

          init_ui();
          log('ui initialized.', 1);
        }
      }else{
        throw broker + ' is not a qualified object to be initialized.';
      }
    } // end init
  }; // end return
})();

if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}

global.file_broker = (function(){

  _fileList = [];

  function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", "_blank");

    var addField = function( key, value ){
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", value );

        form.appendChild(hiddenField);
    };

    for(var key in params){
        if(params.hasOwnProperty(key)){
            if( params[key] instanceof Array ){
                for(var i = 0; i < params[key].length; i++){
                    addField(key, params[key][i]);
                }
            }
            else{
                addField( key, params[key] );
            }
        }
    }

    document.body.appendChild(form);
    form.submit();

   //  var popup = window.open('', 'formpopup', 'resizeable,scrollbars');
  	// try {
  	// 	popup.focus();
  	// 	form.target = 'formpopup';
  	// 	form.submit();
  	// }catch (e){
  	// 	w2alert("Pop-up Blocker is enabled! Please add this site to your exception list and try again.","Error");
  	// 	busy.hide();
  	// }
  }

  function _downloadXls(id){
    showStatusMsg('Downloading data  for ' + id);

    $.cookie('download_xlsx_' + id, '0', { expires: 3, path: '/' });
    post_to_url('lib/download_file.php',{'id': id}, 'GET');

  	_fileList[id] = window.setInterval(function() {

  		// Start polling for the cookie
      var cookieValue = $.cookie('download_xlsx_' + id);
      if(cookieValue == 1){
        window.clearInterval(_fileList[id]);
        delete _fileList[id];
        $.cookie('download_xlsx_' + id, 0, {expires: 3, path: '/' });

        // UI
        hideStatusMsg();
        hideModalMsg();
      }
    }, 1000);
  } // 871

  return {
    downloadXls: function(node){
      if(node instanceof Node){
        _downloadXls(node.getId());
      }else{
        throw 'Expecting a [Node] object.';
      }
    }
  };
})();

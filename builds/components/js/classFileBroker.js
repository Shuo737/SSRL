if(!global.$) {
  global.$ = global.jQuery = require('jquery');
}

require('bootstrap-select');

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

  function _download(config){
    $.cookie('download_' + config.layer, '0', { expires: 3, path: '/' });
    post_to_url('lib/download.php', config, 'GET');

    _fileList[id] = window.setInterval(function() {

      // Start polling for the cookie
      var cookieValue = $.cookie('download_' + id);
      if(cookieValue == 1){
        window.clearInterval(_fileList[id]);
        delete _fileList[id];
        $.cookie('download_' + id, 0, {expires: 3, path: '/' });

        // UI
        hideStatusMsg();
        hideModalMsg();
      }
    }, 1000);
  }

  function _prepareDownload(config){
    var type = config.type;
    showStatusMsg('Loading EULA...');
    $.ajax({
      method: 'GET',
      url: 'eula.html',
      dataType: 'text'
    }).done(function(eula){
      showModalMsg('Preparing for the download...');
      var modal = $(['<div class="modal fade download" data-backdrop="static" role="dialog">',
                  '<div class="modal-dialog">',
                    '<div class="modal-content">',
                    '<div class="modal-header">',
                      '<button type="button" class="close" data-dismiss="modal"><i class="icon icon-cancel-squared"></i></button>',
                      '<h4 class="modal-title">',
                        '<i class="icon icon-download"></i>',
                        'Download Data',
                      '</h4>',
                    '</div>',
                    '<div class="modal-body">',

                    type == 'vector' ?
                      ['<div class="format">',
                        '<div>Format: </div>',
                        '<select class="selectpicker" data-size="6">',
                          '<optgroup label="Popular">',
                            '<option data-content="<span class=\'shape\'></span>ESRI Shapefile" value="shp">ESRI Shapefile</option>',
                            '<option data-content="<span class=\'kml\'></span>KML" value="kml">KML</option>',
                            '<option data-content="<span class=\'json\'></span>GeoJSON" value="json">GeoJSON</option>',
                          '</optgroup>',
                          '<optgroup label="Other">',
                            '<option value="info">MapInfo File</option>',
                            '<option value="gml">GML</option>',
                            '<option value="gpx">GPX</option>',
                            '<option value="dxf">AutoCAD DXF</option>',
                          '</optgroup>',
                        '</select>',
                      '</div>'].join('') : '',

                      '<p>By downloading data from this service, you must agree to the following terms and conditions:</p>',
                      '<h3>Agreement</h3>',
                      '<div>' + eula + '</div>',
                    '</div>', // modal-body
                    '<div class="modal-footer">',
                        '<button type="button" data="ok" class="btn btn-success">OK</button>',
                        '<button type="button" data="cancel" class="btn btn-success">Cancel</button>',
                    '</div>',
                  '</div>',
                '</div>'].join(''));

        $('#layout').append(modal);

        modal._abort = true;

        // remove the model dialog when its turned off
        modal.on('hidden.bs.modal', function(){
          if(modal._abort){
            showModalMsg('Download procedure aborted!', 'danger');
            setTimeout(function(){
              hideModalMsg();
            }, 1500);
          }else{
            hideModalMsg();
          }

          modal.remove();
        }).on('shown.bs.modal', function(){
          modal.find('.selectpicker').selectpicker();
        });

        // show the modal dialog
        modal.modal('show');

        hideStatusMsg();

        // bind [ok] button
        modal.find('[data="ok"]').click(function(){

          modal._abort = false;

          // hide the modal dialog
          modal.modal('hide');

          // start the download
          config.format = modal.find('.selectpicker').selectpicker('val');
          _download(config);
        });

        // bind [cancel] button
        modal.find('[data="cancel"]').click(function(){

          // hide the modal dialog
          modal.modal('hide');
        });

    });
  } // end _download

  return {
    download: function(config){
      _prepareDownload(config);
    }
  };
})();

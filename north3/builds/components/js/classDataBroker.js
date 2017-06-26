global.localData_broker = (function(){

  var _supported = true;
  var _err = false;
  var _request, _db;

  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  if (!window.indexedDB) {
    _supported = false;
    log("Your browser doesn't support a stable version of IndexedDB. Local cache will not be available.");
  }

  if(_supported){
    // Let us open our database
    _request = window.indexedDB.open("north", 1);
    _request.onerror = function(event) {
      // Do something with request.errorCode!
      _err = true;
      log('DataBroker: Error while opening the target indexedDB. Why didn\'t you allow my web app to use IndexedDB?!');
    };
    _request.onsuccess = function(event) {
      // Do something with request.result!
      _db = event.target.result;
      _db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's requests!
        log("Database error: " + event.target.errorCode);
      };

      init_broker.init('dataBroker');
    };

    _request.onupgradeneeded = function(event) {
      var db = event.target.result;
      // Create an objectStore to hold information of json objects.
      var objectStore = db.createObjectStore("cache", { keyPath: "id" });

      // Create an index to search customers by id. We want to ensure that
      // no two objects have the same id, so use a unique index.
      objectStore.createIndex("inxId", "id", { unique: true });

      // Use transaction oncomplete to make sure the objectStore creation is
      // finished before adding data into it.
      objectStore.transaction.oncomplete = function(event) {
        log('objectStore initialized.', 1);
      };
    };
  }

  return{

    // check local storage support
    getindexedDBSupport: function(){
      return _supported && !_err;
    },

    // store
    store: function(config, callback){
      config.data = JSON.stringify(config.data);
      var transaction = _db.transaction(["cache"], "readwrite");

      // Do something when all the data is added to the database.
      transaction.oncomplete = function(event) {
      };

      // Don't forget to handle errors!
      transaction.onerror = function(event) {
        console.log('indexedDB transaction error:', event);
      };

      var objectStore = transaction.objectStore("cache").add(config).onsuccess = function(event) {
        // event.target.result == config.id;
        callback();
      };
    },

    // retrieve
    retrieve: function(id, callback){

      var request = _db.transaction(["cache"]).objectStore("cache").get(id);

      request.onerror = function(event) {
        console.log('indexedDB failed to get object:', event);
        return callback();
      };

      request.onsuccess = function(event) {
        if(request.result){
          return callback(JSON.parse(request.result.data));
        }else{
          return callback();
        }
      };
    },

    // get all cached items
    retrieveAll: function(){
      _db.transaction(["cache"]).objectStore("cache").openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
          console.log('IndexedDB [cache] Item: ' + cursor.key);
          cursor.continue();
        }else{
          console.log('IndexedDB [cache]: no more entries!');
        }
      };
    }
  }; // end of return

})();

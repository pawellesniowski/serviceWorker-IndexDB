import idb from "idb";

// add data to indexDB:
var dbPromise = idb.open("test-db", 1, function(upgradeDb) {
  var keyValStore = upgradeDb.createObjectStore("keyval");
  keyValStore.put("world", "hello");
});

// read data from indexDB, we create transaction:
dbPromise
  .then(function(db) {
    var tx = db.transaction("keyval");
    var keyValStore = tx.objectStore("keyval");
    return keyValStore.get("hello");
  })
  .then(function(val) {
    console.log("The value of hello is ", val);
  });

// read / write, another value to the object store, we create transaction:
dbPromise
  .then(function(db) {
    var tx = db.transaction("keyval", "readwrite");
    var keyValStore = tx.objectStore("keyval");
    keyValStore.put("bar", "foo");
    return tx.complete;
  })
  .then(function() {
    console.log("Addded bar:foo to keyval");
  });


// TODO: in the keyval store, set
// "favoriteAnimal" to your favourite animal
// eg "cat" or "dog"
  dbPromise.then(function(db) {
    var tx = db.transaction("keyval", "readwrite");
    var keyValStore = tx.objectStore("keyval");
    keyValStore.put("favoriteAnimal", "cat");
    return tx.complete;
})
.then(function() {
    console.log("Added favoriteAnimal:Cat to kayval");
});

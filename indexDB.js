import idb from "idb";

//////////////////////////////// 1 ////////////////////////////////////////

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

//////////////////////////////// 2 ////////////////////////////////////////
// Creating a diffrent store with object all of the same kind:
var dbPromise = idb.open("test-db", 2, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore("keyval");
      keyValStore.put("world", "hello");
    case 1:
      upgradeDb.createObjectStore("people", { keyPath: "name" });

  }
});

// adding whole objects:
// add people to "people"
dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Susan Keller',
    age: 34,
    favoriteAnimal: 'cat'
  });

  peopleStore.put({
    name: 'Lillie Wolfe',
    age: 28,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Marc Stone',
    age: 39,
    favoriteAnimal: 'cat'
  });

  return tx.complete;
}).then(function() {
  console.log('People added');
});

// reading objects:
dbPromise.then(function(db){
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  return peopleStore.getAll();
}).then(function(people){
  console.log("People: ", people);
});

//////////////////////////////// 3 ////////////////////////////////////////
var dbPromise = idb.open("test-db", 3, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore("keyval");
      keyValStore.put("world", "hello");
    case 1:
      upgradeDb.createObjectStore("people", { keyPath: "name" });
    case 2:
      var peopleStore = upgradeDb.transaction.objectStore("people");
      peopleStore.createIndex("animal", "favoriteAnimal");
  }
});

// list all cat people
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');

  return animalIndex.getAll('cat');
}).then(function(people) {
  console.log('Cat people:', people);
});

//////////////////////////////// 4 ////////////////////////////////////////
  var dbPromise = idb.open("test-db", 4, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
        var keyValStore = upgradeDb.createObjectStore("keyval");
        keyValStore.put("world", "hello");
      case 1:
        upgradeDb.createObjectStore("people", { keyPath: "name" });
      case 2:
        var peopleStore = upgradeDb.transaction.objectStore("people");
        peopleStore.createIndex("animal", "favoriteAnimal");
      case 3:
        var peopleStore = upgradeDb.transaction.objectStore("people");
        peopleStore.createIndex("age", "age");
    }
  });

  // TODO: console.log all people ordered by age
dbPromise
  .then(function(db) {
    var tx = db.transaction("people");
    var peopleStore = tx.objectStore("people");
    var ageIndex = peopleStore.index("age");

    return ageIndex.getAll();
  })
  .then(function(age) {
    console.log("age", age);
  });


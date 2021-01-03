const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// database name
const dbName = 'headsOfStateDB';

// collection name
const collName = 'headsOfState';

// variables for database and collection assignments
var headsOfStateDB;
var headsOfState;

// connect to server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .then((client) => { // connection to mongoDB
            headsOfStateDB = client.db(dbName); // specific database on mongoDB
            headsOfState = headsOfStateDB.collection(collName); // collection
        })
        .catch((error) => {
            console.log(error);
        })

// send query to mongoDB database to return collection, promise-mysql
// will return a then (success) or a catch (unsuccessful)
var getHeadsOfState = function() {
    return new Promise((resolve, reject) => {
        var cursor = headsOfState.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

// add a head of state query to mongoDB database, promise-mysql
// will return a then (success) or a catch (unsuccessful)
var addHeadOfState = function(id, name) {
    return new Promise((resolve, reject) => {
        headsOfState.insertOne({'_id':id, 'headOfState':name})
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

// export functions
module.exports = { getHeadsOfState, addHeadOfState }

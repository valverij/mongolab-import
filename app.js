var MongoClient = require('mongodb').MongoClient,
    config = require('./config.json'); // relies on a config.json file
    
function handleError(err) {
    if (err) {
        console.log("ERR: ", err.message);
        return false;
    } else {
        return true;
    }
}    

MongoClient.connect(config.connectionString, function (err, db) {
    if (handleError(err)) {
        console.log("Success!");
        
        db.collection('ingredients', { "name": "Salt" }, function (err, collection) {
            if (handleError(err)) {
                console.log("connected");
                collection.findOne({ "name": "Salt" }, function (err, results) {
                    console.dir(results);
                })
            }
        }); 
    }
});
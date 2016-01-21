var MongoClient = require('mongodb').MongoClient;
var config = require('./config.json'); // relies on a config.json file

var ingredients = require('./imports/ingredients.json');
    
function handleError(err, db) {
    if (err) {        
        try { 
            db.close(); 
        } catch (e) {
            // ignore errors on db close
        } finally {
            console.log('ERR: ', err.name, err.message);
            return false;    
        }        
    } else {
        return true;
    }
}    

MongoClient.connect(config.connectionString, function (err, db) {
    if (handleError(err, db)) {
        db.collection('ingredients', { "name": "Salt" }, function (err, collection) {
            if (handleError(err, db)) {                
                collection.insertMany(ingredients, function (err, result) {
                    if (!err) 
                        console.log('INSERTED!');
                    else
                        console.log('ERR: ', err.name, err.message);
                    db.close();
                });                
            }
        }); 
    }
});
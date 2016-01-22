var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var config = require('./config.json'); // relies on a config.json file

var ingredients = require('./imports/ingredients.json');
var recipes = require('./imports/recipes.json');

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

//// import ingredients
// MongoClient.connect(config.connectionString, function (err, db) {
//     if (handleError(err, db)) {
//         db.collection('ingredients', function (err, collection) {
//             if (handleError(err, db)) {                
//                 collection.insertMany(ingredients, function (err, result) {
//                     if (!err) 
//                         console.log('INSERTED!');
//                     else
//                         console.log('ERR: ', err.name, err.message);
//                     db.close();
//                 });                
//             }
//         }); 
//     }
// });

// import recipes
MongoClient.connect(config.connectionString, function (err, db) {
    if (handleError(err, db)) {
        
        var dbRecipes = db.collection('recipes'),
            dbIngredients = db.collection('ingredients');
        
        var promises = [];
        
        recipes.forEach(function (recipe) {
            promises.push(new Promise(function (resolve, reject) {
                dbIngredients.find({ "name": { $in: recipe.ingredients } }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        var mongoRecipe = { name: recipe.name, ingredients: [] };                        
                        result.each(function (err, doc) {
                            if (doc)
                                mongoRecipe.ingredients.push(doc._id);
                            else 
                                resolve(mongoRecipe);
                        });
                    }
                });
            }));
        });
        
        Promise.all(promises).then(function (allRecipes) {
            console.log('inserting...');
            dbRecipes.insertMany(allRecipes, function (err) {
                if (err)
                    console.log('ERR:', err);
                else
                    console.log('SUCCESS!!!');
                    
                db.close();
            });           
        }).catch(function (err) {
            console.log('===============================');
            console.log('Oh NOOOO!!!');
            console.log(err); 
            console.log('===============================');
        });
    }
});
'use strict';

var fs        = require('fs'); //reads our files and returns content
var path      = require('path'); 
var Sequelize = require('sequelize'); //defining our mappings between our model and our table
var basename  = path.basename(module.filename); //node file path. setting the base. giving us the last chunk of the path so it would be index Used.
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};  //define our db here. 

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);   // /// CONNECTING TO MY DATABASE
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);   
}

fs
  .readdirSync(__dirname)// reading current directory & returning  file. "readfile syn on current directory")
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'); //filtering that array. making sure it is not that first...asserting that its not hidden so .. making sure the file is not the base name. making sure it ends in js. filtering out all the hidden files, all of the index.js & also everything that does not have the extension.js
  })
  .forEach(function(file) {   //will return the user.js 
    var model = sequelize['import'](path.join(__dirname, file)); //create a modal with sequelize. making a path with the file name. telling sequelize to import the file in this element of the array. 
    db[model.name] = model; //assigning db (object) modelName to be the key value. 
  });

Object.keys(db).forEach(function(modelName) {  //creating an association here. part of sequelize. 
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

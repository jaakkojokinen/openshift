var mongoose = require('mongoose')
  , Promise = require('bluebird')
  , assert = require('assert')
  , bcrypt = require('bcryptjs');

mongoose.Promise = require('bluebird');

// Openshift environmental variables
var env = process.env
  , username = env.OPENSHIFT_MONGODB_DB_USERNAME
  , password = env.OPENSHIFT_MONGODB_DB_PASSWORD
  , host = env.OPENSHIFT_MONGODB_DB_HOST
  , port = env.OPENSHIFT_MONGODB_DB_PORT
  , appname = env.OPENSHIFT_APP_NAME;

var url = 'mongodb://'+username+':'+password+'@'+host+':'+port+'/'+appname;

var options = { promiseLibrary: require('bluebird') };
console.log(url);
var db = mongoose.createConnection(url, options);

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	address: {
		type: String
	},
	profileimage: {
		type: String
	}
});

var User = module.exports = db.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	//assert.equal(query.exec().constructor, require('bluebird'));
	console.log('user signing in= ' + JSON.stringify(query));
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    	callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){
   	bcrypt.hash(newUser.password, salt, function(err, hash){
   		newUser.password = hash;
   		newUser.save(callback);
   	});
	});
}
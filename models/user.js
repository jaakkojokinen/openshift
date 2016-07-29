var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = require('bluebird');
var bcrypt = require('bcryptjs');

var env = process.env;

var uri = 'mongodb://'+env.OPENSHIFT_MONGODB_DB_USERNAME+':'
+env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+env.OPENSHIFT_MONGODB_DB_HOST+':'
+env.OPENSHIFT_MONGODB_DB_PORT+'/'+env.OPENSHIFT_APP_NAME;

var options = { promiseLibrary: require('bluebird') };
console.log(uri);
var db = mongoose.createConnection(uri, options);

// USer Schema
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
	assert.equal(query.exec().constructor, require('bluebird'));
	console.log(query);
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
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcryptjs');

var env = process.env;

mongoose.connect('mongodb://' + env.OPENSHIFT_MONGODB_DB_HOST + 
	':' + env.OPENSHIFT_MONGODB_DB_PORT+'/');

var db = mongoose.connection;

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

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	assert.equal(query.exec().constructor, global.Promise);
	console.log(query);
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
   	bcrypt.hash(newUser.password, salt, function(err, hash) {
   		newUser.password = hash;
   		newUser.save(callback);
   	});
	});
}
var express = require('express');
var router = express.Router({strict: true});
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

console.log('9. users.js init');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/login',
	passport.authenticate('local', {failureRedirect:'/users/login', 
		failureFlash: 'Invalid username and password'}),
	function(req, res) {
		req.flash('success', 'Welcome' + User.get.username);
		res.redirect('/');
});

router.get('/userlist', function(req, res, next) {
	res.render('userlist', {title:'Users'});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Unknown User'});
		}

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) return done(err);
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		});
	});
}));

router.post('/register', upload.single('profileimage'), function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var address = req.body.address;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	console.log(req.body.file);

	if (req.file) {
		console.log('Uploading file ...');
		var profileimage = req.file.filename;
	} else {
		console.log('No File uploaded ...');
		var profileimage = 'noimage.jpg';
	}

	// Form Validator

	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').notEmpty();
	req.checkBody('address', 'address field is required').notEmpty();
	req.checkBody('username', 'UserName field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check Errors
	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			address: address,
			username: username,
			password: password,
			profileimage: profileimage
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});
		req.flash('success', 'You are now registered and can login');

		res.location('/');
		res.redirect('/');
	}

});

router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/users/login');
});

module.exports = router;

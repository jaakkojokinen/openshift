var express = require('express');
var router = express.Router({strict: true});

var User = require('../models/user');

/* GET home page. */
router.get('/', ensureAuthenticate, function(req, res, next) {
  	User.find({}, function(err, users) {
		if (err) {
			console.log(err);
		}
		var model = {
			users: users
		}
		res.render('index', model, { title: 'Members' });
	});	
});

function ensureAuthenticate(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;

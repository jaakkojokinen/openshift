var express = require('express');
var router = express.Router({strict: true});

//var User = require('../models/user');

/* GET home page. */
router.get('/', ensureAuthenticate, function(req, res, next) {
	res.render('index', { title: 'Members' });
});

function ensureAuthenticate(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;

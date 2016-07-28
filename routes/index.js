var express = require('express');
var router = express.Router();

console.log('8. index.js router get');

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

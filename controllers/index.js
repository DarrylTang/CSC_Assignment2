var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('emailer', { title: 'Express' });
});

/* GET mailing page. */
router.get('/emailer', function(req, res, next) {
  res.render('emailer');
});

module.exports = router;
